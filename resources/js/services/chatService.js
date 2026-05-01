class ChatService {
    constructor() {
        this.ws = null;
        this.reconnectAttempts = 0;
        this.reconnectTimer = null;
        this.isIntentionalClose = false;
        this.MAX_RECONNECT_ATTEMPTS = 5;
        this.handlers = {};
        
        // Use connection timestamp to prevent old socket handlers from firing
        this.connectionId = null;
    }

    startChatStream(user, token, handlers) {
        this.handlers = handlers;
        this.isIntentionalClose = false;
        
        this.connect(user, token);
        
        return () => this.endChatStream();
    }

    connect(user, token) {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }

        const wsHost = import.meta.env.VITE_WS_HOST || 'ws://localhost:8080';
        this.ws = new WebSocket(wsHost);
        this.connectionId = Date.now();
        const currentSocket = this.ws;

        this.ws.onopen = () => {
            if (this.ws !== currentSocket) return;
            
            console.log('WebSocket Connected');
            this.reconnectAttempts = 0;
            
            // Send auth message
            this.ws.send(JSON.stringify({
                type: 'auth',
                userId: String(user.id),
                userName: user.name,
                token: token
            }));
        };

        this.ws.onmessage = (event) => {
            if (this.ws !== currentSocket) return;
            this._handleServerMessage(event.data);
        };

        this.ws.onclose = (event) => {
            if (this.ws !== currentSocket) return;
            console.log('WebSocket Disconnected', event.code);
            
            if (this.handlers.onEnd) {
                this.handlers.onEnd();
            }

            if (!this.isIntentionalClose && event.code !== 1000) {
                this.handleReconnect(user, token);
            }
        };

        this.ws.onerror = (error) => {
            if (this.ws !== currentSocket) return;
            console.error('WebSocket Error:', error);
            if (this.handlers.onError) {
                this.handlers.onError('WebSocket connection error');
            }
        };
    }

    handleReconnect(user, token) {
        if (this.reconnectAttempts >= this.MAX_RECONNECT_ATTEMPTS) {
            if (this.handlers.onError) {
                this.handlers.onError('Failed to reconnect after maximum attempts');
            }
            return;
        }

        this.reconnectAttempts++;
        const delay = Math.min(3000 * Math.pow(2, this.reconnectAttempts - 1), 30000); // 3s, 6s, 12s, 24s, 30s
        
        console.log(`Reconnecting in ${delay}ms... (Attempt ${this.reconnectAttempts})`);
        
        if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
        this.reconnectTimer = setTimeout(() => {
            if (!this.isIntentionalClose) {
                this.connect(user, token);
            }
        }, delay);
    }

    endChatStream() {
        this.isIntentionalClose = true;
        if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
        
        if (this.ws) {
            this.ws.close(1000, 'Intentional disconnect');
            this.ws = null;
        }
    }

    sendMessage(text, recipientId = null) {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            if (this.handlers.onError) this.handlers.onError('Not connected');
            return;
        }

        const message = {
            type: 'message',
            text: text,
            id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
        };

        if (recipientId) {
            message.recipientId = String(recipientId);
        }

        this.ws.send(JSON.stringify(message));
    }

    sendTypingIndicator(contextId, isTyping) {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

        this.ws.send(JSON.stringify({
            type: 'typing',
            contextId: String(contextId),
            isTyping: isTyping
        }));
    }

    _handleServerMessage(data) {
        let parsed;
        try {
            parsed = JSON.parse(data);
        } catch (e) {
            console.error('Failed to parse message', data);
            return;
        }

        switch (parsed.type) {
            case 'auth_success':
                if (this.handlers.onAuthSuccess) {
                    this.handlers.onAuthSuccess(parsed.users);
                }
                break;
            case 'global_message':
                if (this.handlers.onGlobalMessage) {
                    this.handlers.onGlobalMessage(parsed);
                }
                break;
            case 'private_message':
                if (this.handlers.onPrivateMessage) {
                    this.handlers.onPrivateMessage(parsed);
                }
                break;
            case 'presence':
                if (this.handlers.onPresenceUpdate) {
                    this.handlers.onPresenceUpdate(parsed.user, parsed.isOnline);
                }
                break;
            case 'typing':
                if (this.handlers.onTypingEvent) {
                    this.handlers.onTypingEvent(parsed.user, parsed.contextId, parsed.isTyping);
                }
                break;
            case 'user_list':
                if (this.handlers.onUserList) {
                    this.handlers.onUserList(parsed.users);
                }
                break;
            case 'error':
                if (this.handlers.onError) {
                    this.handlers.onError(parsed.message);
                }
                break;
            case 'message_sent':
                if (this.handlers.onMessageSent) {
                    this.handlers.onMessageSent(parsed.messageId, parsed.success);
                }
                break;
            default:
                console.log('Unknown message type:', parsed.type);
        }
    }
}

// Singleton instance
const chatService = new ChatService();
export default chatService;
