import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin, MoreVertical, Plus, X, Trash2 } from 'lucide-react';
import clsx from 'clsx';

const EVENT_TYPES = {
    exam: { label: 'Exam', color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800' },
    assignment: { label: 'Assignment', color: 'bg-mint-100 dark:bg-mint-900/30 text-mint-700 dark:text-mint-400 border-mint-200 dark:border-mint-800' },
    live: { label: 'Live Session', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800' },
    study: { label: 'Study Group', color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800' },
};

const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState(() => {
        const saved = localStorage.getItem('calendar_events');
        return saved ? JSON.parse(saved) : [
            { id: 1, title: 'Welcome to LMS', date: new Date().toISOString(), type: 'live', time: '10:00 AM' }
        ];
    });

    // Convert string dates back to Date objects for processing if needed, 
    // but storing as ISO strings is safer for JSON. We'll parse when reading.

    useEffect(() => {
        localStorage.setItem('calendar_events', JSON.stringify(events));
    }, [events]);

    const [showAddModal, setShowAddModal] = useState(false);
    const [newEvent, setNewEvent] = useState({ title: '', date: '', time: '', type: 'study' });

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    const goToToday = () => setCurrentDate(new Date());

    const isToday = (day) => {
        const today = new Date();
        return day === today.getDate() &&
            currentDate.getMonth() === today.getMonth() &&
            currentDate.getFullYear() === today.getFullYear();
    };

    const getEventsForDay = (day) => {
        return events.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate.getDate() === day &&
                eventDate.getMonth() === currentDate.getMonth() &&
                eventDate.getFullYear() === currentDate.getFullYear();
        });
    };

    const handleAddEvent = (e) => {
        e.preventDefault();
        if (!newEvent.title || !newEvent.date) return;

        const eventToAdd = {
            id: Date.now(),
            ...newEvent,
            date: new Date(newEvent.date).toISOString() // Store as ISO
        };

        setEvents([...events, eventToAdd]);
        setShowAddModal(false);
        setNewEvent({ title: '', date: '', time: '', type: 'study' });
    };

    const handleDeleteEvent = (id) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            setEvents(events.filter(e => e.id !== id));
        }
    };

    const renderCalendarDays = () => {
        const days = [];
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<div key={`empty-${i}`} className="min-h-[6rem] md:h-32 bg-slate-50/50 dark:bg-navy-900/30 border border-slate-100 dark:border-navy-800"></div>);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dayEvents = getEventsForDay(day);
            const today = isToday(day);

            days.push(
                <div
                    key={day}
                    className={clsx(
                        "min-h-[6rem] md:h-32 border border-slate-100 dark:border-navy-800 p-1 md:p-2 overflow-hidden transition-colors hover:bg-slate-50 dark:hover:bg-navy-800/50 flex flex-col gap-1 group relative",
                        today && "bg-mint-50/30 dark:bg-navy-800"
                    )}
                    onClick={() => {
                        // Optional: Click day to pre-fill add modal
                        setNewEvent(prev => ({
                            ...prev,
                            date: new Date(currentDate.getFullYear(), currentDate.getMonth(), day + 1).toISOString().split('T')[0]
                        }));
                        setShowAddModal(true);
                    }}
                >
                    <span className={clsx("w-6 h-6 md:w-7 md:h-7 flex items-center justify-center rounded-full text-xs md:text-sm font-medium mb-1",
                        today ? "bg-mint-500 text-navy-900 shadow-sm" : "text-slate-500 dark:text-slate-400"
                    )}>
                        {day}
                    </span>
                    <div className="flex-1 overflow-y-auto space-y-1 custom-scrollbar">
                        {dayEvents.map(event => (
                            <div
                                key={event.id}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteEvent(event.id);
                                }}
                                className={clsx(
                                    "text-[10px] md:text-xs px-1 md:px-2 py-0.5 md:py-1 rounded truncate border font-medium cursor-pointer transition-transform hover:scale-102 hover:opacity-80",
                                    EVENT_TYPES[event.type]?.color || EVENT_TYPES.study.color
                                )}
                                title={`${event.title} (Click to delete)`}
                            >
                                {event.time && <span className="mr-1 hidden md:inline">{event.time}</span>}
                                {event.title}
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
        return days;
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-6rem)] relative">

            {/* Main Calendar Area */}
            <div className="flex-1 flex flex-col bg-white dark:bg-navy-800 rounded-2xl shadow-sm border border-slate-200 dark:border-navy-700 overflow-hidden">
                {/* Header */}
                <div className="p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-200 dark:border-navy-700">
                    <div className="flex items-center gap-4 w-full md:w-auto justify-between">
                        <h2 className="text-xl md:text-2xl font-bold text-navy-900 dark:text-white">
                            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </h2>
                        <div className="flex bg-slate-100 dark:bg-navy-900 rounded-lg p-1 md:hidden">
                            <button onClick={prevMonth} className="p-1"><ChevronLeft size={20} /></button>
                            <button onClick={nextMonth} className="p-1"><ChevronRight size={20} /></button>
                        </div>
                    </div>

                    <div className="flex w-full md:w-auto gap-2">
                        <div className="hidden md:flex bg-slate-100 dark:bg-navy-900 rounded-lg p-1">
                            <button onClick={prevMonth} className="p-1 hover:bg-white dark:hover:bg-navy-700 rounded-md text-slate-500 transition-colors"><ChevronLeft size={20} /></button>
                            <button onClick={goToToday} className="px-3 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-navy-900 dark:hover:text-white transition-colors">Today</button>
                            <button onClick={nextMonth} className="p-1 hover:bg-white dark:hover:bg-navy-700 rounded-md text-slate-500 transition-colors"><ChevronRight size={20} /></button>
                        </div>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="flex-1 md:flex-none px-4 py-2 bg-mint-500 text-navy-900 rounded-xl font-semibold hover:bg-mint-400 transition-colors text-sm md:text-base flex items-center justify-center gap-2"
                        >
                            <Plus size={18} />
                            Add Event
                        </button>
                    </div>
                </div>

                {/* Days Header */}
                <div className="grid grid-cols-7 border-b border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-900/50">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="py-2 md:py-3 text-center text-xs md:text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-7 flex-1 auto-rows-fr">
                    {renderCalendarDays()}
                </div>
            </div>

            {/* Sidebar - Upcoming List */}
            <div className="w-full lg:w-80 flex flex-col gap-6">
                <div className="bg-white dark:bg-navy-800 rounded-2xl shadow-sm border border-slate-200 dark:border-navy-700 p-6 flex-1 max-h-[500px] lg:max-h-none overflow-y-auto">
                    <h3 className="text-lg font-bold text-navy-900 dark:text-white mb-4 flex items-center gap-2 sticky top-0 bg-white dark:bg-navy-800 z-10 pb-2">
                        <CalendarIcon size={20} className="text-mint-500" />
                        Upcoming Events
                    </h3>

                    <div className="space-y-4">
                        {events.length === 0 ? (
                            <p className="text-slate-500 text-sm text-center">No upcoming events</p>
                        ) : (
                            events
                                .filter(e => new Date(e.date) >= new Date(new Date().setHours(0, 0, 0, 0)))
                                .sort((a, b) => new Date(a.date) - new Date(b.date))
                                .slice(0, 5) // Show top 5
                                .map(event => (
                                    <div key={event.id} className="flex gap-4 group cursor-pointer" onClick={() => handleDeleteEvent(event.id)}>
                                        <div className="flex flex-col items-center bg-slate-100 dark:bg-navy-900 rounded-xl p-2 min-w-[3.5rem] h-fit">
                                            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                                                {monthNames[new Date(event.date).getMonth()].substring(0, 3)}
                                            </span>
                                            <span className="text-xl font-bold text-navy-900 dark:text-white">
                                                {new Date(event.date).getDate()}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-navy-900 dark:text-white group-hover:text-mint-500 transition-colors truncate">
                                                {event.title}
                                            </h4>
                                            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                <Clock size={12} />
                                                <span>{event.time || 'All Day'}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                <span className={clsx("w-2 h-2 rounded-full", EVENT_TYPES[event.type]?.color.split(' ')[0].replace('bg-', 'bg-') || 'bg-slate-400')}></span>
                                                <span className="capitalize">{EVENT_TYPES[event.type]?.label || event.type}</span>
                                            </div>
                                        </div>
                                        <button className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))
                        )}
                    </div>
                </div>
            </div>

            {/* Add Event Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-navy-800 rounded-2xl shadow-xl w-full max-w-md p-6 border border-slate-200 dark:border-navy-700 animate-fade-in-up">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-navy-900 dark:text-white">Add New Event</h3>
                            <button onClick={() => setShowAddModal(false)} className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleAddEvent} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Event Title</label>
                                <input
                                    type="text"
                                    required
                                    value={newEvent.title}
                                    onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-mint-500 outline-none"
                                    placeholder="e.g. Project Review"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date</label>
                                    <input
                                        type="date"
                                        required
                                        value={newEvent.date}
                                        onChange={e => setNewEvent({ ...newEvent, date: e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-mint-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Time</label>
                                    <input
                                        type="time"
                                        value={newEvent.time}
                                        onChange={e => setNewEvent({ ...newEvent, time: e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-mint-500 outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Type</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {Object.entries(EVENT_TYPES).map(([key, config]) => (
                                        <button
                                            key={key}
                                            type="button"
                                            onClick={() => setNewEvent({ ...newEvent, type: key })}
                                            className={clsx(
                                                "px-3 py-2 rounded-lg text-sm font-medium border transition-all",
                                                newEvent.type === key
                                                    ? "bg-mint-500 text-navy-900 border-mint-500"
                                                    : "bg-slate-50 dark:bg-navy-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-navy-700 hover:border-mint-500"
                                            )}
                                        >
                                            {config.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    className="w-full py-3 bg-mint-500 text-navy-900 font-bold rounded-xl hover:bg-mint-400 transition-colors shadow-lg shadow-mint-500/20"
                                >
                                    Save Event
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Calendar;
