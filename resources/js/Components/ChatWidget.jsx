import React, { useRef, useEffect } from 'react';
import { useChat } from '@/context/ChatContext';

export default function ChatWidget({ currentUser }) {
    const {
        isConnected,
        isAdmin,
        contacts,
        conversations,
        sendMessage,
        activeChat,
        setActiveChat,
        sendTypingIndicator,
        typingUsers,
        isChatOpen,
        setIsChatOpen
    } = useChat();

    const messagesEndRef = useRef(null);

    // Auto scroll to bottom
    useEffect(() => {
        if (isChatOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [conversations, isChatOpen, activeChat]);

    const handleSend = (e) => {
        e.preventDefault();
        const form = e.target;
        const input = form.elements.messageInput;
        const msgText = input.value;
        if (!msgText.trim() || !activeChat) return;

        sendMessage(msgText, activeChat.user.id);
        input.value = '';
        sendTypingIndicator(activeChat.user.id, false);
    };

    const handleTyping = (e) => {
        if (!activeChat) return;
        sendTypingIndicator(activeChat.user.id, e.target.value.length > 0);
    };

    const toggleChat = () => setIsChatOpen(!isChatOpen);

    // Messages for the active conversation
    const activeMessages = activeChat ? (conversations[activeChat.user.id] || []) : [];
    const currentTypingUsers = activeChat ? typingUsers[activeChat.user.id] : null;

    // Header title
    const headerTitle = activeChat
        ? (isAdmin ? `Chat dengan ${activeChat.user.name}` : 'Chat dengan Admin')
        : (isAdmin ? 'Pilih Pengguna' : 'Menunggu Admin...');

    // Count unread (simple: any messages in conversations for non-active chats)
    const hasUnread = isAdmin && Object.keys(conversations).some(uid => {
        if (!activeChat || uid !== activeChat.user.id) {
            return (conversations[uid] || []).length > 0;
        }
        return false;
    });

    return (
        <>
            {/* Floating Action Button */}
            <button
                id="chat-toggle-btn"
                onClick={toggleChat}
                className={`fixed bottom-6 right-6 w-14 h-14 rounded-full bg-emerald-500 text-black flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:bg-emerald-400 transition-all z-50 ${isChatOpen ? 'scale-0 pointer-events-none' : 'scale-100'}`}
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                {hasUnread && (
                    <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-[#0a0a0a]" />
                )}
            </button>

            {/* Chat Window */}
            <div
                className={`fixed bottom-6 right-6 flex flex-col bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl transition-all duration-300 z-50 transform origin-bottom-right ${isChatOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'} ${isAdmin ? 'w-[700px] max-w-[95vw]' : 'w-[380px]'} h-[600px] max-h-[80vh]`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/[0.02] rounded-t-2xl flex-shrink-0">
                    <div className="flex items-center gap-3">
                        {/* Back button: only for admin when a chat is selected */}
                        {isAdmin && activeChat && (
                            <button
                                onClick={() => setActiveChat(null)}
                                className="p-1.5 text-gray-400 hover:text-white transition-colors"
                                title="Kembali ke daftar"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                            </button>
                        )}
                        <div>
                            <h3 className="font-bold text-white text-sm tracking-wide">{headerTitle}</h3>
                            {isConnected ? (
                                <p className="text-[10px] text-emerald-500 font-medium tracking-wider uppercase flex items-center gap-1.5 mt-0.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    Connected
                                </p>
                            ) : (
                                <p className="text-[10px] text-orange-500 font-medium tracking-wider uppercase flex items-center gap-1.5 mt-0.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                                    Reconnecting...
                                </p>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={toggleChat}
                        className="p-1.5 text-gray-400 hover:text-white transition-colors"
                        title="Tutup"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* ── ADMIN VIEW ──────────────────────────────────────── */}
                {isAdmin ? (
                    <div className="flex flex-1 overflow-hidden">
                        {/* Left sidebar: user list */}
                        <div className="w-52 border-r border-white/10 flex flex-col flex-shrink-0 overflow-y-auto">
                            <div className="px-3 py-2 border-b border-white/5">
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                    Pengguna Online ({contacts.length})
                                </p>
                            </div>
                            {contacts.length === 0 ? (
                                <div className="flex-1 flex flex-col items-center justify-center text-gray-600 px-4 text-center">
                                    <svg className="w-8 h-8 mb-2 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <p className="text-xs leading-relaxed">Belum ada pengguna online</p>
                                </div>
                            ) : (
                                contacts.map(u => {
                                    const isActive = activeChat?.user.id === u.id;
                                    const msgCount = (conversations[u.id] || []).length;
                                    const hasMsg = !isActive && msgCount > 0;
                                    return (
                                        <button
                                            key={u.id}
                                            onClick={() => setActiveChat({ user: u })}
                                            className={`flex items-center gap-3 px-3 py-3 text-left transition-colors relative ${isActive ? 'bg-emerald-500/10 border-r-2 border-emerald-500' : 'hover:bg-white/[0.03]'}`}
                                        >
                                            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold text-gray-300 flex-shrink-0 relative">
                                                {u.name.charAt(0).toUpperCase()}
                                                <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 border-2 border-[#0a0a0a] rounded-full" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-xs font-semibold truncate ${isActive ? 'text-emerald-400' : 'text-gray-300'}`}>{u.name}</p>
                                                <p className="text-[10px] text-gray-600 truncate">
                                                    {typingUsers[u.id]?.isTyping ? 'Sedang mengetik...' : 'Online'}
                                                </p>
                                            </div>
                                            {hasMsg && (
                                                <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                                            )}
                                        </button>
                                    );
                                })
                            )}
                        </div>

                        {/* Right: conversation panel */}
                        <div className="flex-1 flex flex-col overflow-hidden">
                            {activeChat ? (
                                <>
                                    <MessageList
                                        messages={activeMessages}
                                        currentUserId={String(currentUser.id)}
                                        messagesEndRef={messagesEndRef}
                                        typingInfo={currentTypingUsers}
                                    />
                                    <ChatInput
                                        onSubmit={handleSend}
                                        onTyping={handleTyping}
                                        isConnected={isConnected}
                                    />
                                </>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-gray-600 p-6 text-center">
                                    <svg className="w-10 h-10 mb-3 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                    <p className="text-sm font-medium text-gray-500">Pilih pengguna untuk memulai percakapan</p>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    // ── USER VIEW ──────────────────────────────────────────
                    <div className="flex flex-col flex-1 overflow-hidden">
                        {contacts.length === 0 && !isConnected ? (
                            // Not connected yet
                            <div className="flex-1 flex flex-col items-center justify-center text-gray-600 p-6 text-center">
                                <svg className="w-10 h-10 mb-3 text-gray-700 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                <p className="text-sm text-gray-500">Menghubungkan ke server chat...</p>
                            </div>
                        ) : contacts.length === 0 ? (
                            // Connected but no admin online
                            <div className="flex-1 flex flex-col items-center justify-center text-gray-600 p-6 text-center">
                                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-3">
                                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <p className="text-sm font-medium text-gray-400 mb-1">Admin sedang offline</p>
                                <p className="text-xs text-gray-600 leading-relaxed">
                                    Tidak ada admin yang online saat ini. Silakan coba lagi nanti atau hubungi via email.
                                </p>
                            </div>
                        ) : (
                            // Admin available — show conversation
                            <>
                                {/* Admin info banner */}
                                {activeChat && (
                                    <div className="px-4 py-2.5 border-b border-white/5 bg-white/[0.01] flex items-center gap-3 flex-shrink-0">
                                        <div className="w-7 h-7 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-[11px] font-bold text-emerald-400">
                                            {activeChat.user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-white">{activeChat.user.name}</p>
                                            <p className="text-[10px] text-emerald-500 uppercase tracking-wider font-bold">Admin · Online</p>
                                        </div>
                                    </div>
                                )}

                                <MessageList
                                    messages={activeMessages}
                                    currentUserId={String(currentUser.id)}
                                    messagesEndRef={messagesEndRef}
                                    typingInfo={currentTypingUsers}
                                />
                                <ChatInput
                                    onSubmit={handleSend}
                                    onTyping={handleTyping}
                                    isConnected={isConnected}
                                    disabled={!activeChat}
                                    placeholder={activeChat ? 'Ketik pesan ke admin...' : 'Admin tidak tersedia'}
                                />
                            </>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}

// ── Sub-components ──────────────────────────────────────────────────────────

function MessageList({ messages, currentUserId, messagesEndRef, typingInfo }) {
    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </div>
                    <p className="text-xs">Belum ada pesan. Mulailah percakapan!</p>
                </div>
            ) : (
                messages.map((msg, idx) => {
                    const isMe = msg.sender.id === currentUserId;
                    return (
                        <div key={msg.id || idx} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                            <span className="text-[10px] text-gray-500 mb-1 px-1">
                                {isMe ? 'Anda' : msg.sender.name}
                            </span>
                            <div className={`px-4 py-2 rounded-2xl max-w-[85%] text-sm ${isMe
                                ? 'bg-emerald-500 text-black rounded-tr-none'
                                : 'bg-white/10 text-white rounded-tl-none border border-white/5'
                            }`}>
                                {msg.text}
                            </div>
                        </div>
                    );
                })
            )}

            {/* Typing Indicator */}
            {typingInfo?.isTyping && (
                <div className="flex flex-col items-start">
                    <span className="text-[10px] text-gray-500 mb-1 px-1">{typingInfo.user.name} sedang mengetik...</span>
                    <div className="px-4 py-3 rounded-2xl bg-white/5 rounded-tl-none border border-white/5 flex gap-1">
                        <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" />
                        <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>
    );
}

function ChatInput({ onSubmit, onTyping, isConnected, disabled = false, placeholder = 'Ketik pesan...' }) {
    return (
        <form onSubmit={onSubmit} className="p-3 border-t border-white/10 bg-white/[0.02] rounded-b-2xl relative flex-shrink-0">
            {(!isConnected) && (
                <div className="absolute inset-0 z-10 bg-[#0a0a0a]/80 backdrop-blur-sm flex items-center justify-center rounded-b-2xl">
                    <p className="text-xs text-gray-400 font-medium tracking-wider uppercase">Menghubungkan ke server...</p>
                </div>
            )}
            <div className="flex gap-2">
                <input
                    type="text"
                    name="messageInput"
                    onChange={onTyping}
                    placeholder={placeholder}
                    disabled={!isConnected || disabled}
                    className="flex-1 bg-black/50 border border-white/10 text-white text-sm rounded-full px-4 py-2.5 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 placeholder:text-gray-600 disabled:opacity-50"
                />
                <button
                    type="submit"
                    disabled={!isConnected || disabled}
                    className="w-10 h-10 rounded-full bg-emerald-500 text-black flex items-center justify-center hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                >
                    <svg className="w-4 h-4 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                </button>
            </div>
        </form>
    );
}
