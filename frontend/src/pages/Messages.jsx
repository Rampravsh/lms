import React, { useState } from 'react';
import { Search, Send, Phone, Video, MoreVertical, MessageSquare } from 'lucide-react';
import clsx from 'clsx';

const CONTACTS = [
    { id: 1, name: 'CTO Bhaiya', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CTO', message: 'Did you check the new system design video?', time: '2m ago', unread: 2, online: true },
    { id: 2, name: 'Sarah Miller', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', message: 'Thanks for the help with React hooks!', time: '1h ago', unread: 0, online: false },
    { id: 3, name: 'Study Group A', avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=Study', message: 'Meeting at 5 PM?', time: '3h ago', unread: 5, online: true },
    { id: 4, name: 'David Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David', message: 'Can you review my PR?', time: '1d ago', unread: 0, online: false },
];

const MESSAGES = [
    { id: 1, sender: 'other', text: 'Hey Alex! How is the MERN course going?', time: '10:30 AM' },
    { id: 2, sender: 'me', text: 'It’s going great! Just finished the MongoDB module.', time: '10:32 AM' },
    { id: 3, sender: 'other', text: 'Awesome. Did you check the new system design video?', time: '10:33 AM' },
    { id: 4, sender: 'me', text: 'Not yet, planning to watch it tonight!', time: '10:35 AM' },
    { id: 5, sender: 'other', text: 'Highly recommend it. The load balancing part is crucial.', time: '10:36 AM' },
    { id: 6, sender: 'me', text: 'Thanks for the tip! Will prioritize it.', time: '10:40 AM' },
];

const Messages = () => {
    const [selectedContact, setSelectedContact] = useState(CONTACTS[0]);
    const [newMessage, setNewMessage] = useState('');

    // Adjusting height to fit within the layout which has padding and headers
    // The parent container in Layout has padding top ~6rem (24) and p-4/8.
    // We want this component to fill the remaining vertical space.
    // h-[calc(100vh-8rem)] typically works well assuming standard header height and margins.

    return (
        <div className="flex bg-white/70 dark:bg-navy-800/70 backdrop-blur-xl rounded-2xl shadow-sm border border-slate-200 dark:border-navy-700 h-[calc(100vh-8rem)] overflow-hidden">
            {/* Sidebar / Contact List */}
            <div className={clsx(
                "w-full md:w-80 border-r border-slate-200 dark:border-navy-700 flex flex-col bg-white/50 dark:bg-navy-900/50",
                selectedContact ? "hidden md:flex" : "flex"
            )}>
                <div className="p-4 border-b border-slate-200 dark:border-navy-700 backdrop-blur-sm">
                    <h2 className="text-xl font-bold text-navy-900 dark:text-white mb-4">Messages</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-navy-800/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-mint-500 text-slate-700 dark:text-slate-300 placeholder-slate-400"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {CONTACTS.map(contact => (
                        <div
                            key={contact.id}
                            onClick={() => setSelectedContact(contact)}
                            className={clsx(
                                "p-4 flex gap-3 hover:bg-slate-50/80 dark:hover:bg-navy-700/50 cursor-pointer transition-colors border-b border-slate-50 dark:border-navy-800/30",
                                selectedContact?.id === contact.id ? "bg-mint-50/50 dark:bg-navy-700/50 border-l-4 border-l-mint-500" : "border-l-4 border-l-transparent"
                            )}
                        >
                            <div className="relative">
                                <img src={contact.avatar} alt={contact.name} className="w-12 h-12 rounded-full bg-slate-200 dark:bg-navy-900 object-cover" />
                                {contact.online && <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-navy-800 rounded-full"></span>}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="font-semibold text-slate-900 dark:text-white truncate">{contact.name}</h3>
                                    <span className="text-xs text-slate-400">{contact.time}</span>
                                </div>
                                <p className={clsx("text-sm truncate", contact.unread > 0 ? "text-slate-800 dark:text-slate-200 font-medium" : "text-slate-500 dark:text-slate-400")}>
                                    {contact.message}
                                </p>
                            </div>
                            {contact.unread > 0 && (
                                <div className="flex items-center">
                                    <span className="w-5 h-5 bg-mint-500 text-navy-900 text-[10px] font-bold rounded-full flex items-center justify-center">
                                        {contact.unread}
                                    </span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className={clsx(
                "flex-1 flex-col bg-slate-50/30 dark:bg-navy-900/30 backdrop-blur-sm",
                selectedContact ? "flex" : "hidden md:flex"
            )}>
                {selectedContact ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 bg-white/80 dark:bg-navy-800/80 backdrop-blur-md border-b border-slate-200 dark:border-navy-700 flex items-center justify-between sticky top-0 z-10 transition-all">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setSelectedContact(null)}
                                    className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-navy-700 rounded-full"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
                                </button>
                                <img src={selectedContact.avatar} alt={selectedContact.name} className="w-10 h-10 rounded-full object-cover" />
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-white">{selectedContact.name}</h3>
                                    <p className="text-xs text-green-500 flex items-center gap-1 font-medium">
                                        Online
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-slate-400">
                                <button className="p-2 hover:bg-slate-100 dark:hover:bg-navy-700 rounded-full transition-colors"><Phone size={20} /></button>
                                <button className="p-2 hover:bg-slate-100 dark:hover:bg-navy-700 rounded-full transition-colors"><Video size={20} /></button>
                                <button className="p-2 hover:bg-slate-100 dark:hover:bg-navy-700 rounded-full transition-colors"><MoreVertical size={20} /></button>
                            </div>
                        </div>

                        {/* Messages List - Scrollable */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-6">
                            {MESSAGES.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={clsx(
                                        "flex",
                                        msg.sender === 'me' ? "justify-end" : "justify-start"
                                    )}
                                >
                                    <div className={clsx(
                                        "max-w-[75%] p-3.5 rounded-2xl text-sm shadow-sm backdrop-blur-sm",
                                        msg.sender === 'me'
                                            ? "bg-mint-500 text-navy-900 rounded-tr-sm"
                                            : "bg-white/80 dark:bg-navy-800/80 text-slate-700 dark:text-slate-200 rounded-tl-sm border border-slate-100 dark:border-navy-700"
                                    )}>
                                        <p className="leading-relaxed">{msg.text}</p>
                                        <span className={clsx(
                                            "text-[10px] block text-right mt-1 opacity-70 font-medium",
                                            msg.sender === 'me' ? "text-navy-900" : "text-slate-400"
                                        )}>
                                            {msg.time}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input Area - Fixed Bottom of Container */}
                        <div className="p-4 bg-white/80 dark:bg-navy-800/80 backdrop-blur-md border-t border-slate-200 dark:border-navy-700">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 bg-slate-100 dark:bg-navy-900 border-0 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-mint-500 placeholder-slate-400"
                                />
                                <button className="bg-mint-500 text-navy-900 p-3 rounded-xl hover:bg-mint-400 transition-colors shadow-lg shadow-mint-500/20 active:scale-95">
                                    <Send size={20} />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                        <div className="w-20 h-20 bg-slate-100 dark:bg-navy-800 rounded-full flex items-center justify-center mb-6 animate-pulse">
                            <MessageSquare size={36} className="text-slate-300 dark:text-navy-600" />
                        </div>
                        <p className="text-xl font-medium text-slate-600 dark:text-slate-300">Your Messages</p>
                        <p className="text-sm mt-2">Select a conversation to start chatting</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Messages;
