import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import cors from 'cors';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const PORT = process.env.WS_PORT || 8080;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_dev_secret_must_be_32_chars_long';
const ADMIN_ROLE = 'admin';

console.log("Loaded JWT_SECRET length:", JWT_SECRET.length);

// User Manager to track connections
class UserManager {
    constructor() {
        this.users = new Map(); // userId -> { ws, user: { id, name, role, isOnline } }
        this.socketToUser = new Map(); // ws -> userId
    }

    addUser(ws, userId, userName, userRole) {
        userId = String(userId);
        
        // Handle reconnect: close old socket for this user ID
        const existing = this.users.get(userId);
        if (existing && existing.ws !== ws) {
            console.log(`User ${userName} reconnecting, closing old connection`);
            try {
                existing.ws.close(1000, 'Replaced by new connection');
            } catch (e) { /* ignore */ }
        }

        const userObj = { id: userId, name: userName, role: userRole || 'user', isOnline: true };
        this.users.set(userId, { ws, user: userObj });
        this.socketToUser.set(ws, userId);
        return userObj;
    }

    removeUser(ws) {
        const userId = this.socketToUser.get(ws);
        if (userId) {
            this.users.delete(userId);
            this.socketToUser.delete(ws);
            return userId;
        }
        return null;
    }

    getUser(userId) {
        return this.users.get(String(userId));
    }

    getUserBySocket(ws) {
        const userId = this.socketToUser.get(ws);
        return userId ? this.users.get(userId) : null;
    }

    isAdmin(userId) {
        const entry = this.users.get(String(userId));
        return entry?.user?.role === ADMIN_ROLE;
    }

    getAdmins() {
        return Array.from(this.users.values())
            .filter(u => u.user.role === ADMIN_ROLE)
            .map(u => u.user);
    }

    getRegularUsers() {
        return Array.from(this.users.values())
            .filter(u => u.user.role !== ADMIN_ROLE)
            .map(u => u.user);
    }

    /**
     * Get the contact list for a user depending on their role:
     * - Admin sees: all regular users online
     * - Regular user sees: all admins online
     */
    getContactsFor(userId) {
        if (this.isAdmin(userId)) {
            return this.getRegularUsers();
        } else {
            return this.getAdmins();
        }
    }

    sendToSocket(ws, message) {
        if (ws.readyState === 1) {
            ws.send(JSON.stringify(message));
        }
    }

    sendToUser(userId, message) {
        const entry = this.users.get(String(userId));
        if (entry && entry.ws.readyState === 1) {
            entry.ws.send(JSON.stringify(message));
            return true;
        }
        return false;
    }

    /**
     * Broadcast presence updates only to relevant parties:
     * - If the user who changed is an admin, notify all regular users
     * - If the user who changed is a regular user, notify all admins
     */
    broadcastPresenceTo(changedUser, isOnline, excludeUserId = null) {
        const message = JSON.stringify({
            type: 'presence',
            user: changedUser,
            isOnline,
            timestamp: Date.now()
        });

        const isChangedAdmin = changedUser.role === ADMIN_ROLE;

        for (const [userId, { ws, user }] of this.users.entries()) {
            if (excludeUserId && userId === String(excludeUserId)) continue;

            // Admins get notified about regular user changes, regular users get notified about admin changes
            const shouldNotify = isChangedAdmin
                ? (user.role !== ADMIN_ROLE)   // notify regular users when an admin comes/goes
                : (user.role === ADMIN_ROLE);  // notify admins when a user comes/goes

            if (shouldNotify && ws.readyState === 1) {
                ws.send(message);
            }
        }
    }
}

const app = express();
app.use(cors());

const server = createServer(app);
const wss = new WebSocketServer({ server });
const userManager = new UserManager();

// Basic health check
app.get('/health', (req, res) => res.json({
    status: 'ok',
    activeUsers: userManager.users.size,
    admins: userManager.getAdmins().length,
    users: userManager.getRegularUsers().length
}));

wss.on('connection', (ws) => {
    console.log('New connection attempt');
    let isAuthenticated = false;
    let currentUserId = null;

    ws.on('message', (data) => {
        let parsed;
        try {
            parsed = JSON.parse(data.toString());
        } catch (e) {
            return;
        }

        // ── AUTH ────────────────────────────────────────────────────────────
        if (parsed.type === 'auth') {
            const { userId, userName, token } = parsed;

            if (!userId || !userName || !token) {
                userManager.sendToSocket(ws, { type: 'error', message: 'Missing auth details' });
                ws.close(1008, 'Auth failed');
                return;
            }

            try {
                const decoded = jwt.verify(token, JWT_SECRET);
                // The JWT payload should contain the user's role; fall back to 'user'
                const userRole = decoded.role || 'user';

                const user = userManager.addUser(ws, userId, userName, userRole);
                isAuthenticated = true;
                currentUserId = user.id;

                console.log(`User authenticated: ${userName} (${userId}) [role: ${userRole}]`);

                // Send auth_success with the correct contact list
                userManager.sendToSocket(ws, {
                    type: 'auth_success',
                    users: userManager.getContactsFor(currentUserId)
                });

                // Broadcast presence to relevant parties only
                userManager.broadcastPresenceTo(user, true, currentUserId);

            } catch (err) {
                console.error("JWT Verification failed:", err.message);
                userManager.sendToSocket(ws, { type: 'error', message: 'Invalid token' });
                ws.close(1008, 'Invalid token');
            }
            return;
        }

        if (!isAuthenticated) {
            userManager.sendToSocket(ws, { type: 'error', message: 'Not authenticated' });
            return;
        }

        const messageId = parsed.id || `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        const currentUser = userManager.getUser(currentUserId)?.user;
        if (!currentUser) return;

        // ── MESSAGE ─────────────────────────────────────────────────────────
        if (parsed.type === 'message') {
            const text = typeof parsed.text === 'string' ? parsed.text.trim() : '';
            if (!text) return;

            if (!parsed.recipientId) {
                // Block global/broadcast messages entirely — only private is allowed
                userManager.sendToSocket(ws, {
                    type: 'error',
                    message: 'Global chat is disabled. Please send a direct message.'
                });
                return;
            }

            const recipientId = String(parsed.recipientId);
            const recipientEntry = userManager.getUser(recipientId);

            if (!recipientEntry) {
                userManager.sendToSocket(ws, { type: 'error', message: 'User is offline' });
                return;
            }

            const recipientUser = recipientEntry.user;

            // ── ENFORCE ADMIN↔USER ONLY ──────────────────────────────────
            const senderIsAdmin = currentUser.role === ADMIN_ROLE;
            const recipientIsAdmin = recipientUser.role === ADMIN_ROLE;

            // Block user→user and admin→admin
            if (senderIsAdmin === recipientIsAdmin) {
                userManager.sendToSocket(ws, {
                    type: 'error',
                    message: senderIsAdmin
                        ? 'Admins cannot chat with other admins.'
                        : 'You can only send messages to an admin.'
                });
                return;
            }

            const privateMsg = {
                type: 'private_message',
                id: messageId,
                sender: currentUser,
                recipient: recipientUser,
                text,
                timestamp: Date.now()
            };

            // Deliver to recipient & echo back to sender
            userManager.sendToUser(recipientId, privateMsg);
            userManager.sendToSocket(ws, privateMsg);
            userManager.sendToSocket(ws, { type: 'message_sent', success: true, messageId });
            return;
        }

        // ── TYPING ──────────────────────────────────────────────────────────
        if (parsed.type === 'typing') {
            if (!parsed.contextId || parsed.contextId === 'global') return; // no global typing

            const targetId = String(parsed.contextId);
            const targetEntry = userManager.getUser(targetId);
            if (!targetEntry) return;

            const targetUser = targetEntry.user;
            const senderIsAdmin = currentUser.role === ADMIN_ROLE;
            const targetIsAdmin = targetUser.role === ADMIN_ROLE;

            // Only allow typing events between admin and user
            if (senderIsAdmin === targetIsAdmin) return;

            userManager.sendToUser(targetId, {
                type: 'typing',
                user: currentUser,
                contextId: String(currentUserId), // always the sender's ID as the conversation key
                isTyping: !!parsed.isTyping,
                timestamp: Date.now()
            });
            return;
        }

        // ── GET_USERS ────────────────────────────────────────────────────────
        if (parsed.type === 'get_users') {
            userManager.sendToSocket(ws, {
                type: 'user_list',
                users: userManager.getContactsFor(currentUserId)
            });
            return;
        }
    });

    ws.on('close', () => {
        if (currentUserId) {
            const userObj = userManager.getUser(currentUserId)?.user;
            const removedId = userManager.removeUser(ws);
            if (removedId && userObj) {
                console.log(`User disconnected: ${userObj.name} (${userObj.id})`);
                userManager.broadcastPresenceTo(userObj, false);
            }
        }
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});

server.listen(PORT, () => {
    console.log(`WebSocket server running on port ${PORT}`);
});
