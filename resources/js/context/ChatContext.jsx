import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import chatService from '../services/chatService';

const ChatContext = createContext(null);

export const ChatProvider = ({ children, user, token }) => {
    const [isConnected, setIsConnected] = useState(false);
    // contacts = the relevant people this user can chat with
    // - For admins: list of online regular users
    // - For regular users: list of online admins
    const [contacts, setContacts] = useState([]);
    const [conversations, setConversations] = useState({});
    const [typingUsers, setTypingUsers] = useState({});

    // For regular users, activeChat is always the first admin.
    // For admins, activeChat is whichever user they select.
    const [activeChat, setActiveChat] = useState(null); // { user: {...} }
    const [error, setError] = useState(null);
    const [isChatOpen, setIsChatOpen] = useState(false);

    const typingTimeouts = useRef({});
    const isAdmin = user?.role === 'admin';

    useEffect(() => {
        if (!user || !token) return;

        console.log("ChatProvider starting stream for user", user.name, "[role:", user.role, "]");

        const handlers = {
            onAuthSuccess: (serverContacts) => {
                setIsConnected(true);
                setContacts(serverContacts);
                setError(null);

                // For regular users: auto-select the first admin as active chat target
                if (!isAdmin && serverContacts.length > 0) {
                    setActiveChat({ user: serverContacts[0] });
                }
            },
            onPrivateMessage: (msg) => {
                // The conversation key is always the OTHER person's id from this user's perspective
                const otherUserId = msg.sender.id === String(user.id)
                    ? msg.recipient.id
                    : msg.sender.id;

                setConversations(prev => ({
                    ...prev,
                    [otherUserId]: [...(prev[otherUserId] || []), msg]
                }));
            },
            onPresenceUpdate: (updatedUser, isOnline) => {
                setContacts(prev => {
                    if (isOnline) {
                        const exists = prev.find(u => u.id === updatedUser.id);
                        if (exists) return prev;
                        const updated = [...prev, updatedUser];

                        // If we're a regular user and this is an admin coming online,
                        // set them as active chat if we had none
                        if (!isAdmin && updatedUser.role === 'admin') {
                            setActiveChat(cur => cur ?? { user: updatedUser });
                        }

                        return updated;
                    } else {
                        return prev.filter(u => u.id !== updatedUser.id);
                    }
                });
            },
            onTypingEvent: (typingUser, contextId, isTyping) => {
                if (typingUser.id === String(user.id)) return;

                setTypingUsers(prev => ({
                    ...prev,
                    [contextId]: { user: typingUser, isTyping, timestamp: Date.now() }
                }));

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
                setContacts(userList);
            },
            onError: (errMsg) => {
                setError(errMsg);
                console.error("Chat error:", errMsg);
            },
            onEnd: () => {
                setIsConnected(false);
            },
            onMessageSent: () => {}
        };

        const cleanup = chatService.startChatStream(user, token, handlers);

        return () => {
            console.log("ChatProvider cleanup");
            cleanup();
            Object.values(typingTimeouts.current).forEach(clearTimeout);
        };
    }, [user, token]);

    const sendMessage = (text, recipientId) => {
        chatService.sendMessage(text, recipientId);
    };

    const sendTypingIndicator = (contextId, isTyping) => {
        chatService.sendTypingIndicator(contextId, isTyping);
    };

    const value = {
        isConnected,
        isAdmin,
        contacts,
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
