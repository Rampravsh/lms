import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin, MoreVertical } from 'lucide-react';
import clsx from 'clsx';

// Mock Data
const MOCK_EVENTS = [
    { id: 1, title: 'System Design Exam', date: new Date(2025, 9, 28), type: 'exam', time: '10:00 AM' }, // Oct 28
    { id: 2, title: 'MERN Project Due', date: new Date(2025, 9, 25), type: 'assignment', time: '11:59 PM' }, // Oct 25
    { id: 3, title: 'Live Q&A Session', date: new Date(2025, 9, 30), type: 'live', time: '05:00 PM' }, // Oct 30
    { id: 4, title: 'React Basics Quiz', date: new Date(2025, 10, 5), type: 'exam', time: '02:00 PM' }, // Nov 5
    { id: 5, title: 'Database Optimization', date: new Date(2025, 10, 12), type: 'live', time: '04:00 PM' }, // Nov 12
];

const EVENT_TYPES = {
    exam: { color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800' },
    assignment: { color: 'bg-mint-100 dark:bg-mint-900/30 text-mint-700 dark:text-mint-400 border-mint-200 dark:border-mint-800' },
    live: { color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800' },
};

const Calendar = () => {
    // State for currently viewed month
    // Defaulting to October 2025 as per other mock data in the app, or use new Date() for real time
    const [currentDate, setCurrentDate] = useState(new Date(2025, 9, 1));

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay(); // 0 = Sunday

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const goToToday = () => {
        setCurrentDate(new Date()); // Will jump to ACTUAL today
    };

    const isToday = (day) => {
        const today = new Date();
        return day === today.getDate() &&
            currentDate.getMonth() === today.getMonth() &&
            currentDate.getFullYear() === today.getFullYear();
    };

    const getEventsForDay = (day) => {
        return MOCK_EVENTS.filter(event =>
            event.date.getDate() === day &&
            event.date.getMonth() === currentDate.getMonth() &&
            event.date.getFullYear() === currentDate.getFullYear()
        );
    };

    // Generate calendar grid
    const renderCalendarDays = () => {
        const days = [];

        // Empty slots for days before the 1st
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<div key={`empty-${i}`} className="h-24 md:h-32 bg-slate-50/50 dark:bg-navy-900/30 border border-slate-100 dark:border-navy-800"></div>);
        }

        // Actual days
        for (let day = 1; day <= daysInMonth; day++) {
            const events = getEventsForDay(day);
            const today = isToday(day);

            days.push(
                <div
                    key={day}
                    className={clsx(
                        "h-24 md:h-32 border border-slate-100 dark:border-navy-800 p-2 overflow-hidden transition-colors hover:bg-slate-50 dark:hover:bg-navy-800/50 flex flex-col gap-1 group relative",
                        today && "bg-mint-50/30 dark:bg-navy-800"
                    )}
                >
                    <span
                        className={clsx(
                            "w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium mb-1",
                            today
                                ? "bg-mint-500 text-navy-900 shadow-sm"
                                : "text-slate-500 dark:text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-navy-700"
                        )}
                    >
                        {day}
                    </span>

                    {/* Events List */}
                    <div className="flex-1 overflow-y-auto space-y-1 custom-scrollbar">
                        {events.map(event => (
                            <div
                                key={event.id}
                                className={clsx(
                                    "text-[10px] md:text-xs px-2 py-1 rounded truncate border font-medium cursor-pointer transition-transform hover:scale-102",
                                    EVENT_TYPES[event.type].color
                                )}
                                title={event.title}
                            >
                                {event.time.split(' ')[0]} {event.title}
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        return days;
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-6rem)]">
            {/* Main Calendar Area */}
            <div className="flex-1 flex flex-col bg-white dark:bg-navy-800 rounded-2xl shadow-sm border border-slate-200 dark:border-navy-700 overflow-hidden">
                {/* Header */}
                <div className="p-6 flex items-center justify-between border-b border-slate-200 dark:border-navy-700">
                    <div className="flex items-center gap-4">
                        <h2 className="text-2xl font-bold text-navy-900 dark:text-white">
                            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </h2>
                        <div className="flex bg-slate-100 dark:bg-navy-900 rounded-lg p-1">
                            <button onClick={prevMonth} className="p-1 hover:bg-white dark:hover:bg-navy-700 rounded-md text-slate-500 transition-colors">
                                <ChevronLeft size={20} />
                            </button>
                            <button onClick={today => setCurrentDate(new Date())} className="px-3 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-navy-900 dark:hover:text-white transition-colors">
                                Today
                            </button>
                            <button onClick={nextMonth} className="p-1 hover:bg-white dark:hover:bg-navy-700 rounded-md text-slate-500 transition-colors">
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                    {/* Filter / Add Event (Visual Only) */}
                    <div className="hidden md:flex gap-2">
                        <button className="px-4 py-2 bg-mint-500 text-navy-900 rounded-xl font-semibold hover:bg-mint-400 transition-colors">
                            + Add Event
                        </button>
                    </div>
                </div>

                {/* Days Header */}
                <div className="grid grid-cols-7 border-b border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-900/50">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="py-3 text-center text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-7 flex-1 overflow-y-auto">
                    {renderCalendarDays()}
                </div>
            </div>

            {/* Sidebar - Upcoming List */}
            <div className="w-full lg:w-80 flex flex-col gap-6">
                <div className="bg-white dark:bg-navy-800 rounded-2xl shadow-sm border border-slate-200 dark:border-navy-700 p-6 flex-1">
                    <h3 className="text-lg font-bold text-navy-900 dark:text-white mb-4 flex items-center gap-2">
                        <CalendarIcon size={20} className="text-mint-500" />
                        Upcoming Events
                    </h3>

                    <div className="space-y-4">
                        {MOCK_EVENTS.sort((a, b) => a.date - b.date).map(event => (
                            <div key={event.id} className="flex gap-4 group cursor-pointer">
                                <div className="flex flex-col items-center bg-slate-100 dark:bg-navy-900 rounded-xl p-2 min-w-[3.5rem] h-fit">
                                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                                        {monthNames[event.date.getMonth()].substring(0, 3)}
                                    </span>
                                    <span className="text-xl font-bold text-navy-900 dark:text-white">
                                        {event.date.getDate()}
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-navy-900 dark:text-white group-hover:text-mint-500 transition-colors">
                                        {event.title}
                                    </h4>
                                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                                        <Clock size={12} />
                                        <span>{event.time}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                                        <span className={clsx("w-2 h-2 rounded-full",
                                            event.type === 'exam' ? 'bg-red-500' :
                                                event.type === 'assignment' ? 'bg-mint-500' : 'bg-blue-500'
                                        )}></span>
                                        <span className="capitalize">{event.type.replace('_', ' ')}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Calendar;
