import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Search, Send, Phone, Video, MoreVertical, User, MessageSquare } from 'lucide-react';
import io from 'socket.io-client';
import clsx from 'clsx';

const Messages = () => {
    const { user } = useSelector((state) => state.auth);
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [messageInput, setMessageInput] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [contacts, setContacts] = useState([]); // Real users
    const messagesEndRef = useRef(null);

    // Load conversations from local storage
    const [conversations, setConversations] = useState(() => {
        const saved = localStorage.getItem('conversations');
        return saved ? JSON.parse(saved) : {};
    });

    // Fetch real users on mount
    useEffect(() => {
        const fetchUsers = async () => {
            if (!user) return;
            try {
                const token = localStorage.getItem('token');
                // Use dynamic hostname to support mobile/network access
                const baseUrl = `http://${window.location.hostname}:8000`;
                const response = await fetch(`${baseUrl}/api/auth/users`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                if (data.success) {
                    setContacts(data.data);
                }
            } catch (error) {
                console.error("Failed to fetch contacts", error);
            }
        };
        fetchUsers();
    }, [user]);

    // Initialize Socket
    useEffect(() => {
        if (!user) return;

        // Use dynamic hostname to match how the page was loaded (localhost or IP)
        const socketUrl = `http://${window.location.hostname}:8000`;
        const newSocket = io(socketUrl);
        setSocket(newSocket);

        newSocket.emit('join', user._id || user.id);

        newSocket.on('onlineUsers', (users) => {
            setOnlineUsers(users);
        });

        newSocket.on('receiveMessage', (message) => {
            handleReceiveMessage(message);
        });

        return () => newSocket.close();
    }, [user]);

    // Save conversations to local storage
    useEffect(() => {
        localStorage.setItem('conversations', JSON.stringify(conversations));
    }, [conversations]);

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [activeChat, conversations]);

    const handleReceiveMessage = (message) => {
        const { senderId, content, timestamp } = message;

        setConversations(prev => {
            const chatId = senderId;
            // Lookup sender in contacts, or use a placeholder if not found yet
            // We use 'mockUsers' finding logic here dynamically based on 'contacts' state
            // Note: contacts state might not be fully populated if receive happens before fetch
            // But usually fetch is fast. We will just store what we have.
            // Since we can't reliably find the sender object inside this callback if contacts 
            // is stale, we'll construct a basic user object or try to find it.
            // To avoid closure staleness, we won't rely on 'contacts' state here excessively 
            // unless we use a ref or ensure dependency.
            // Simplified: Just update the message list. The User info comes from `contacts` during render.

            const existingChat = prev[chatId] || { messages: [] };

            return {
                ...prev,
                [chatId]: {
                    ...existingChat,
                    messages: [...(existingChat.messages || []), { ...message, isMine: false }]
                }
            };
        });
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!messageInput.trim() || !activeChat || !socket) return;

        const newMessage = {
            senderId: user._id || user.id,
            receiverId: activeChat._id,
            content: messageInput,
            timestamp: new Date().toISOString(),
            isMine: true
        };

        // Emit to server
        socket.emit('sendMessage', newMessage);

        // Save locally
        setConversations(prev => {
            const chatId = activeChat._id;
            const existingChat = prev[chatId] || { messages: [] };

            return {
                ...prev,
                [chatId]: {
                    ...existingChat,
                    messages: [...(existingChat.messages || []), newMessage]
                }
            };
        });

        setMessageInput('');
    };

    const isOnline = (userId) => onlineUsers.includes(userId);

    const formatTime = (isoString) => {
        if (!isoString) return '';
        const date = new Date(isoString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Filter contacts based on search
    const filteredContacts = contacts.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex bg-white/70 dark:bg-navy-800/70 backdrop-blur-xl rounded-2xl shadow-sm border border-slate-200 dark:border-navy-700 h-[calc(100vh-8rem)] overflow-hidden animate-fade-in">
            {/* Sidebar / Contact List */}
            <div className={clsx(
                "w-full md:w-80 border-r border-slate-200 dark:border-navy-700 flex flex-col bg-white/50 dark:bg-navy-900/50",
                activeChat ? "hidden md:flex" : "flex"
            )}>
                <div className="p-4 border-b border-slate-200 dark:border-navy-700 backdrop-blur-sm">
                    <h2 className="text-xl font-bold text-navy-900 dark:text-white mb-4">Messages</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-navy-800/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-mint-500 text-slate-700 dark:text-slate-300 placeholder-slate-400"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {contacts.length === 0 ? (
                        <div className="p-6 text-center text-slate-500 dark:text-slate-400">
                            <p>No other users found.</p>
                            <p className="text-sm mt-2">Register a new account in a different browser to verify chat!</p>
                        </div>
                    ) : (
                        filteredContacts.map((contact) => {
                            const conversation = conversations[contact._id];
                            const lastMessage = conversation?.messages?.[conversation.messages.length - 1];
                            const online = isOnline(contact._id);

                            return (
                                <div
                                    key={contact._id}
                                    onClick={() => setActiveChat(contact)}
                                    className={clsx(
                                        "p-4 flex gap-3 hover:bg-slate-50/80 dark:hover:bg-navy-700/50 cursor-pointer transition-colors border-b border-slate-50 dark:border-navy-800/30",
                                        activeChat?._id === contact._id ? "bg-mint-50/50 dark:bg-navy-700/50 border-l-4 border-l-mint-500" : "border-l-4 border-l-transparent"
                                    )}
                                >
                                    <div className="relative">
                                        <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200 dark:bg-navy-900">
                                            {/* Use random avatar if none provided, or verify backend provides 'avatar' field */}
                                            <img src={contact.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${contact.name}`} alt={contact.name} className="w-full h-full object-cover" />
                                        </div>
                                        {online && <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-navy-800 rounded-full"></span>}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h3 className="font-semibold text-slate-900 dark:text-white truncate">{contact.name}</h3>
                                            {lastMessage && (
                                                <span className="text-xs text-slate-400">{formatTime(lastMessage.timestamp)}</span>
                                            )}
                                        </div>
                                        <p className={clsx("text-sm truncate", "text-slate-500 dark:text-slate-400")}>
                                            {lastMessage ? (lastMessage.isMine ? `You: ${lastMessage.content}` : lastMessage.content) : 'Start a conversation'}
                                        </p>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className={clsx(
                "flex-1 flex-col bg-slate-50/30 dark:bg-navy-900/30 backdrop-blur-sm",
                activeChat ? "flex" : "hidden md:flex"
            )}>
                {activeChat ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 bg-white/80 dark:bg-navy-800/80 backdrop-blur-md border-b border-slate-200 dark:border-navy-700 flex items-center justify-between sticky top-0 z-10 transition-all">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setActiveChat(null)}
                                    className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-navy-700 rounded-full"
                                >
                                    <Search size={24} /> {/* Placeholder for Back */}
                                </button>
                                <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200">
                                    <img src={activeChat.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${activeChat.name}`} alt={activeChat.name} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-white">{activeChat.name}</h3>
                                    <div className="flex items-center gap-1.5">
                                        <div className={`w-2 h-2 rounded-full ${isOnline(activeChat._id) ? 'bg-green-500' : 'bg-slate-400'}`}></div>
                                        <span className="text-xs text-slate-500">{isOnline(activeChat._id) ? 'Online' : 'Offline'}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-slate-400">
                                <button className="p-2 hover:bg-slate-100 dark:hover:bg-navy-700 rounded-full transition-colors"><Phone size={20} /></button>
                                <button className="p-2 hover:bg-slate-100 dark:hover:bg-navy-700 rounded-full transition-colors"><Video size={20} /></button>
                                <button className="p-2 hover:bg-slate-100 dark:hover:bg-navy-700 rounded-full transition-colors"><MoreVertical size={20} /></button>
                            </div>
                        </div>

                        {/* Messages List - Scrollable */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {conversations[activeChat._id]?.messages?.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={clsx(
                                        "flex",
                                        msg.isMine ? "justify-end" : "justify-start"
                                    )}
                                >
                                    <div className={clsx(
                                        "max-w-[75%] p-3.5 rounded-2xl text-sm shadow-sm backdrop-blur-sm",
                                        msg.isMine
                                            ? "bg-mint-500 text-navy-900 rounded-tr-sm"
                                            : "bg-white/80 dark:bg-navy-800/80 text-slate-700 dark:text-slate-200 rounded-tl-sm border border-slate-100 dark:border-navy-700"
                                    )}>
                                        <p className="leading-relaxed">{msg.content}</p>
                                        <span className={clsx(
                                            "text-[10px] block text-right mt-1 opacity-70 font-medium",
                                            msg.isMine ? "text-navy-900" : "text-slate-400"
                                        )}>
                                            {formatTime(msg.timestamp)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {(!conversations[activeChat._id]?.messages || conversations[activeChat._id].messages.length === 0) && (
                                <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center">
                                    <div className="w-16 h-16 bg-slate-200 dark:bg-navy-800 rounded-full flex items-center justify-center mb-4">
                                        <Send size={24} className="ml-1" />
                                    </div>
                                    <p>No messages yet.</p>
                                    <p className="text-sm">Say hello to {activeChat.name}!</p>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area - Fixed Bottom of Container */}
                        <form onSubmit={handleSendMessage} className="p-4 bg-white/80 dark:bg-navy-800/80 backdrop-blur-md border-t border-slate-200 dark:border-navy-700">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 bg-slate-100 dark:bg-navy-900 border-0 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-mint-500 placeholder-slate-400 outline-none"
                                />
                                <button
                                    type="submit"
                                    disabled={!messageInput.trim()}
                                    className="bg-mint-500 text-navy-900 p-3 rounded-xl hover:bg-mint-400 transition-colors shadow-lg shadow-mint-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send size={20} />
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="hidden md:flex flex-1 flex-col items-center justify-center text-slate-400 bg-slate-50 dark:bg-navy-900/30">
                        <div className="w-20 h-20 bg-white dark:bg-navy-800 rounded-full flex items-center justify-center mb-6 shadow-sm">
                            <User size={40} className="text-mint-500" />
                        </div>
                        <h3 className="text-xl font-bold text-navy-900 dark:text-white mb-2">Select a Conversation</h3>
                        <p className="max-w-xs text-center">Choose a contact from the list to start chatting or send a new message.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Messages;
