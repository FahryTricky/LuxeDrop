import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import chatService from '../services/chatService';

const ChatContext = createContext(null);

export const ChatProvider = ({ children, user, token }) => {
    const [isConnected, setIsConnected] = useState(false);
    const [users, setUsers] = useState([]); // Other online users
    const [conversations, setConversations] = useState({ global: [] });
    const [typingUsers, setTypingUsers] = useState({});
    const [activeChat, setActiveChat] = useState({ type: 'global' });
    const [error, setError] = useState(null);
    
    // Typing indicator clear timeouts
    const typingTimeouts = useRef({});

    useEffect(() => {
        if (!user || !token) return;

        console.log("ChatProvider starting stream for user", user.name);

        const handlers = {
            onAuthSuccess: (otherUsers) => {
                setIsConnected(true);
                setUsers(otherUsers);
                setError(null);
            },
            onGlobalMessage: (msg) => {
                setConversations(prev => ({
                    ...prev,
                    global: [...(prev.global || []), msg]
                }));
                showMessageNotification(msg, false);
            },
            onPrivateMessage: (msg) => {
                // If I am the sender, the other person is the context/conversation ID
                // If I am the recipient, the sender is the context/conversation ID
                const otherUserId = msg.sender.id === String(user.id) ? msg.recipient.id : msg.sender.id;
                
                setConversations(prev => ({
                    ...prev,
                    [otherUserId]: [...(prev[otherUserId] || []), msg]
                }));
                showMessageNotification(msg, true, otherUserId);
            },
            onPresenceUpdate: (updatedUser, isOnline) => {
                setUsers(prev => {
                    if (isOnline) {
                        // Avoid duplicates
                        const exists = prev.find(u => u.id === updatedUser.id);
                        if (exists) return prev;
                        return [...prev, updatedUser];
                    } else {
                        return prev.filter(u => u.id !== updatedUser.id);
                    }
                });
            },
            onTypingEvent: (typingUser, contextId, isTyping) => {
                // Ignore our own typing indicator echo if somehow received
                if (typingUser.id === String(user.id)) return;

                setTypingUsers(prev => ({
                    ...prev,
                    [contextId]: {
                        user: typingUser,
                        isTyping,
                        timestamp: Date.now()
                    }
                }));

                // Auto-clear typing indicator after 3 seconds
                if (typingTimeouts.current[contextId]) {
                    clearTimeout(typingTimeouts.current[contextId]);
                }
                
                if (isTyping) {
                    typingTimeouts.current[contextId] = setTimeout(() => {
                        setTypingUsers(prev => ({
                            ...prev,
                            [contextId]: { ...prev[contextId], isTyping: false }
                        }));
                    }, 3000);
                }
            },
            onUserList: (userList) => {
                setUsers(userList);
            },
            onError: (errMsg) => {
                setError(errMsg);
                console.error("Chat error:", errMsg);
            },
            onEnd: () => {
                setIsConnected(false);
            },
            onMessageSent: (messageId, success) => {
                // You could update message status here if you tracked pending messages
                // console.log(`Message ${messageId} sent status:`, success);
            }
        };

        const cleanup = chatService.startChatStream(user, token, handlers);

        return () => {
            console.log("ChatProvider cleanup");
            cleanup();
            Object.values(typingTimeouts.current).forEach(clearTimeout);
        };
    }, [user, token]); // Re-run if user/token changes (e.g. login/logout)

    // A helper to determine if we should show a toast notification
    const showMessageNotification = (msg, isPrivate, otherUserId = null) => {
        // Skip if sender is the current user
        if (msg.sender.id === String(user.id)) return;

        // Skip if user is actively viewing this specific conversation
        let isViewing = false;
        
        // Let's assume you have some way to track if chat UI is open or active
        // For simplicity, we check if activeChat matches
        if (isPrivate) {
            isViewing = activeChat.type === 'private' && activeChat.user?.id === otherUserId;
        } else {
            isViewing = activeChat.type === 'global';
        }

        if (!isViewing) {
            // Usually you'd trigger a toast here (e.g., react-hot-toast or similar)
            console.log(`[New Message] ${msg.sender.name}: ${msg.text}`);
            // TODO: dispatch a real toast event depending on your UI framework
        }
    };

    const sendMessage = (text, recipientId = null) => {
        chatService.sendMessage(text, recipientId);
    };

    const sendTypingIndicator = (contextId, isTyping) => {
        chatService.sendTypingIndicator(contextId, isTyping);
    };

    const [isChatOpen, setIsChatOpen] = useState(false);

    const value = {
        isConnected,
        users,
        conversations,
        typingUsers,
        activeChat,
        setActiveChat,
        sendMessage,
        sendTypingIndicator,
        error,
        isChatOpen,
        setIsChatOpen
    };

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => {
    const context = useContext(ChatContext);
    if (context === undefined) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
};
