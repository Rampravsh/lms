import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, TrendingUp, BookOpen, Calendar, MessageSquare } from 'lucide-react';
import clsx from 'clsx';

const MobileNav = () => {
    const navItems = [
        { icon: LayoutDashboard, label: 'Home', path: '/' },
        { icon: TrendingUp, label: 'Analytics', path: '/analytics' },
        { icon: BookOpen, label: 'Courses', path: '/courses' },
        { icon: Calendar, label: 'Calendar', path: '/calendar' },
        { icon: MessageSquare, label: 'Messages', path: '/messages' },
    ];

    return (
        <div className="fixed bottom-0 left-0 w-full bg-white dark:bg-navy-900 border-t border-slate-200 dark:border-navy-800 p-2 flex justify-around items-center z-50 md:hidden pb-safe transition-colors duration-300">
            {navItems.map((item) => (
                <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                        clsx(
                            "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors",
                            isActive
                                ? "text-mint-600 dark:text-mint-500"
                                : "text-slate-500 dark:text-slate-500 hover:text-navy-900 dark:hover:text-slate-300"
                        )
                    }
                >
                    <item.icon size={24} />
                    <span className="text-[10px] font-medium">{item.label}</span>
                </NavLink>
            ))}
        </div>
    );
};

export default MobileNav;
