import React, { useRef, useEffect } from 'react';
import { useChat } from '@/context/ChatContext';

export default function ChatWidget({ currentUser }) {
    const { isConnected, users, conversations, sendMessage, activeChat, setActiveChat, sendTypingIndicator, typingUsers, isChatOpen, setIsChatOpen } = useChat();
    const messagesEndRef = useRef(null);

    // Auto scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isChatOpen) {
            scrollToBottom();
        }
    }, [conversations, isChatOpen, activeChat]);

    const handleSend = (e) => {
        e.preventDefault();
        // Since we removed local message state to fix the import easily, let's add it back
        const form = e.target;
        const input = form.elements.messageInput;
        const msgText = input.value;
        if (!msgText.trim()) return;
        
        const recipientId = activeChat.type === 'private' ? activeChat.user.id : null;
        sendMessage(msgText, recipientId);
        input.value = '';
        sendTypingIndicator(recipientId || 'global', false);
    };

    const handleTyping = (e) => {
        const recipientId = activeChat.type === 'private' ? activeChat.user.id : 'global';
        sendTypingIndicator(recipientId, e.target.value.length > 0);
    };

    const toggleChat = () => setIsChatOpen(!isChatOpen);

    const activeMessages = activeChat.type === 'global' 
        ? (conversations.global || []) 
        : (conversations[activeChat.user.id] || []);

    const typingContext = activeChat.type === 'private' ? activeChat.user.id : 'global';
    const currentTypingUsers = typingUsers[typingContext];

    // If we're not connected, don't show the widget (or show a loading state)
    if (!isConnected) return null;

    return (
        <>
            {/* Floating Action Button */}
            <button
                onClick={toggleChat}
                className={`fixed bottom-6 right-6 w-14 h-14 rounded-full bg-emerald-500 text-black flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:bg-emerald-400 transition-all z-50 ${isChatOpen ? 'scale-0' : 'scale-100'}`}
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                {/* Unread dot indicator could go here */}
            </button>

            {/* Chat Window */}
            <div 
                className={`fixed bottom-6 right-6 w-[380px] h-[600px] max-h-[80vh] flex flex-col bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl transition-all duration-300 z-50 transform origin-bottom-right ${isChatOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/[0.02] rounded-t-2xl">
                    <div>
                        <h3 className="font-bold text-white text-sm tracking-wide">
                            {activeChat.type === 'global' ? 'Lounge Chat' : `Chat: ${activeChat.user.name}`}
                        </h3>
                        <p className="text-[10px] text-emerald-500 font-medium tracking-wider uppercase flex items-center gap-1.5 mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            Connected
                        </p>
                    </div>
                    <div className="flex gap-2">
                        {activeChat.type === 'private' && (
                            <button 
                                onClick={() => setActiveChat({ type: 'global' })}
                                className="p-1.5 text-gray-400 hover:text-white transition-colors"
                                title="Back to Global Chat"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                            </button>
                        )}
                        <button 
                            onClick={toggleChat}
                            className="p-1.5 text-gray-400 hover:text-white transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Online Users Banner (Only in Global) */}
                {activeChat.type === 'global' && users.length > 0 && (
                    <div className="flex px-4 py-3 gap-2 overflow-x-auto border-b border-white/5 bg-white/[0.01] no-scrollbar">
                        {users.map(u => (
                            <button
                                key={u.id}
                                onClick={() => setActiveChat({ type: 'private', user: u })}
                                className="flex flex-col items-center flex-shrink-0 group"
                                title={`Chat with ${u.name}`}
                            >
                                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold text-gray-300 group-hover:bg-emerald-500 group-hover:text-black group-hover:border-emerald-500 transition-all relative">
                                    {u.name.charAt(0).toUpperCase()}
                                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#0a0a0a] rounded-full"></span>
                                </div>
                                <span className="text-[9px] text-gray-500 mt-1 max-w-[40px] truncate">{u.name}</span>
                            </button>
                        ))}
                    </div>
                )}

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {activeMessages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-500">
                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
                                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                            <p className="text-xs">No messages yet</p>
                        </div>
                    ) : (
                        activeMessages.map((msg, idx) => {
                            const isMe = msg.sender.id === String(currentUser.id);
                            return (
                                <div key={msg.id || idx} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                    <span className="text-[10px] text-gray-500 mb-1 px-1">
                                        {isMe ? 'You' : msg.sender.name}
                                    </span>
                                    <div 
                                        className={`px-4 py-2 rounded-2xl max-w-[85%] text-sm ${
                                            isMe 
                                                ? 'bg-emerald-500 text-black rounded-tr-none' 
                                                : 'bg-white/10 text-white rounded-tl-none border border-white/5'
                                        }`}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            );
                        })
                    )}
                    
                    {/* Typing Indicator */}
                    {currentTypingUsers && currentTypingUsers.isTyping && (
                        <div className="flex flex-col items-start">
                            <span className="text-[10px] text-gray-500 mb-1 px-1">
                                {currentTypingUsers.user.name} is typing...
                            </span>
                            <div className="px-4 py-3 rounded-2xl bg-white/5 rounded-tl-none border border-white/5 flex gap-1">
                                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></span>
                                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <form onSubmit={handleSend} className="p-3 border-t border-white/10 bg-white/[0.02] rounded-b-2xl">
                    <div className="flex gap-2 relative">
                        <input
                            type="text"
                            name="messageInput"
                            onChange={handleTyping}
                            placeholder="Type a message..."
                            className="flex-1 bg-black/50 border border-white/10 text-white text-sm rounded-full px-4 py-2.5 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 placeholder:text-gray-600"
                        />
                        <button 
                            type="submit"
                            className="w-10 h-10 rounded-full bg-emerald-500 text-black flex items-center justify-center hover:bg-emerald-400 disabled:opacity-50 disabled:hover:bg-emerald-500 transition-colors flex-shrink-0"
                        >
                            <svg className="w-4 h-4 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
