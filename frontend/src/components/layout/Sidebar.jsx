import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Calendar, MessageSquare, Settings, LogOut, TrendingUp, Smartphone } from 'lucide-react';
import clsx from 'clsx';

const Sidebar = () => {
    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
        { icon: TrendingUp, label: 'Analytics', path: '/analytics' },
        // { icon: Smartphone, label: 'Mobile App', path: '/mobile' }, // Removed
        { icon: BookOpen, label: 'Courses', path: '/courses' },
        { icon: Calendar, label: 'Calendar', path: '/calendar' },
        { icon: MessageSquare, label: 'Messages', path: '/messages' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    return (
        <aside className="w-64 bg-navy-900 border-r border-navy-800 h-screen fixed left-0 top-0 flex flex-col">
            <div className="p-6">
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <span className="w-8 h-8 bg-mint-500 rounded-lg flex items-center justify-center text-navy-900 font-bold">L</span>
                    LMS
                </h1>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            clsx(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                                isActive
                                    ? "bg-mint-500 text-navy-900 font-semibold shadow-lg shadow-mint-500/20"
                                    : "text-slate-400 hover:bg-navy-800 hover:text-white"
                            )
                        }
                    >
                        <item.icon size={20} />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-navy-800">
                <button className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 w-full hover:bg-navy-800 rounded-xl transition-colors">
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
