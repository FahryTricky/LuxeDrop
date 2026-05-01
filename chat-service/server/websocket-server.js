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

console.log("Loaded JWT_SECRET length:", JWT_SECRET.length);

// User Manager to track connections
class UserManager {
    constructor() {
        this.users = new Map(); // userId -> { ws, user: { id, name, isOnline } }
        this.socketToUser = new Map(); // ws -> userId
    }

    addUser(ws, userId, userName) {
        userId = String(userId);
        
        // Handle reconnect/multi-tab by closing old socket for this specific user ID
        // Note: The prompt says "Tutup koneksi lama untuk prevent duplicate subscriptions"
        // But also says: "Setiap tab dapat login dengan akun berbeda tanpa conflict" 
        // If it's the SAME account, do we allow multiple tabs for the same account? 
        // "Multi-tab different accounts (Tab 1 User A + Tab 2 User B)"
        // Let's assume for now 1 connection per user account. If they log in multiple tabs with same account, we replace.
        const existing = this.users.get(userId);
        if (existing && existing.ws !== ws) {
            console.log(`User ${userName} reconnecting/new tab, closing old connection`);
            try {
                existing.ws.close(1000, 'Replaced by new connection');
            } catch (e) {
                // ignore
            }
        }

        const userObj = { id: userId, name: userName, isOnline: true };
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

    getAllUsers() {
        return Array.from(this.users.values()).map(u => u.user);
    }

    getOtherUsers(excludeUserId) {
        return this.getAllUsers().filter(u => u.id !== String(excludeUserId));
    }

    broadcast(message, excludeUserId = null) {
        const messageStr = JSON.stringify(message);
        for (const [userId, { ws }] of this.users.entries()) {
            if (excludeUserId && userId === String(excludeUserId)) continue;
            if (ws.readyState === 1) { // OPEN
                ws.send(messageStr);
            }
        }
    }

    sendToUser(userId, message) {
        const user = this.users.get(String(userId));
        if (user && user.ws.readyState === 1) {
            user.ws.send(JSON.stringify(message));
            return true;
        }
        return false;
    }

    sendToSocket(ws, message) {
        if (ws.readyState === 1) {
            ws.send(JSON.stringify(message));
        }
    }
}

const app = express();
app.use(cors());

// Basic health check
app.get('/health', (req, res) => res.json({ status: 'ok', activeUsers: userManager.users.size }));

const server = createServer(app);
const wss = new WebSocketServer({ server });
const userManager = new UserManager();

wss.on('connection', (ws, request) => {
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

        if (parsed.type === 'auth') {
            const { userId, userName, token } = parsed;
            
            if (!userId || !userName || !token) {
                userManager.sendToSocket(ws, { type: 'error', message: 'Missing auth details' });
                ws.close(1008, 'Auth failed');
                return;
            }

            try {
                // Verify JWT token using the secret from .env
                jwt.verify(token, JWT_SECRET);
                
                const user = userManager.addUser(ws, userId, userName);
                isAuthenticated = true;
                currentUserId = user.id;

                console.log(`User authenticated: ${userName} (${userId})`);

                // Send auth success
                userManager.sendToSocket(ws, {
                    type: 'auth_success',
                    users: userManager.getOtherUsers(currentUserId)
                });

                // Broadcast presence online
                userManager.broadcast({
                    type: 'presence',
                    user,
                    isOnline: true,
                    timestamp: Date.now()
                }, currentUserId);

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

        // Generate unique message ID if not provided
        const messageId = parsed.id || `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

        switch (parsed.type) {
            case 'message':
                const currentUser = userManager.getUser(currentUserId)?.user;
                if (!currentUser) break;

                const text = typeof parsed.text === 'string' ? parsed.text.trim() : '';
                if (!text) break;

                if (parsed.recipientId) {
                    // Private message
                    const recipientId = String(parsed.recipientId);
                    const recipientObj = userManager.getUser(recipientId)?.user;
                    
                    if (!recipientObj) {
                        userManager.sendToSocket(ws, { type: 'error', message: 'User is offline' });
                        break;
                    }

                    const privateMsg = {
                        type: 'private_message',
                        id: messageId,
                        sender: currentUser,
                        recipient: recipientObj,
                        text,
                        timestamp: Date.now()
                    };

                    // Send to recipient
                    userManager.sendToUser(recipientId, privateMsg);
                    // Echo back to sender
                    userManager.sendToSocket(ws, privateMsg);

                    // Confirm sent
                    userManager.sendToSocket(ws, { type: 'message_sent', success: true, messageId });
                } else {
                    // Global message
                    const globalMsg = {
                        type: 'global_message',
                        id: messageId,
                        sender: currentUser,
                        text,
                        timestamp: Date.now()
                    };

                    userManager.broadcast(globalMsg);
                    userManager.sendToSocket(ws, { type: 'message_sent', success: true, messageId });
                }
                break;

            case 'typing':
                if (parsed.contextId) {
                    const typingMsg = {
                        type: 'typing',
                        user: userManager.getUser(currentUserId)?.user,
                        contextId: parsed.contextId,
                        isTyping: !!parsed.isTyping,
                        timestamp: Date.now()
                    };
                    
                    // If contextId is 'global', broadcast to all except sender
                    if (parsed.contextId === 'global') {
                        userManager.broadcast(typingMsg, currentUserId);
                    } else {
                        // Otherwise it's a private chat, send to specific user
                        userManager.sendToUser(parsed.contextId, typingMsg);
                    }
                }
                break;

            case 'get_users':
                userManager.sendToSocket(ws, {
                    type: 'user_list',
                    users: userManager.getAllUsers()
                });
                break;
        }
    });

    ws.on('close', () => {
        if (currentUserId) {
            const userObj = userManager.getUser(currentUserId)?.user;
            const removedId = userManager.removeUser(ws);
            if (removedId && userObj) {
                console.log(`User disconnected: ${userObj.name} (${userObj.id})`);
                userManager.broadcast({
                    type: 'presence',
                    user: userObj,
                    isOnline: false,
                    timestamp: Date.now()
                });
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
