import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import { Settings as SettingsIcon } from 'lucide-react';

const Layout = () => {
    const { user } = useSelector((state) => state.auth);

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-navy-800 text-slate-900 dark:text-white font-sans transition-colors duration-300 overflow-hidden">
            {/* Sidebar (Desktop) */}
            <div className="hidden md:block w-64 flex-shrink-0 z-30">
                <Sidebar />
            </div>

            {/* Main Content Wrapper */}
            <div className="flex-1 flex flex-col h-full relative overflow-hidden">

                {/* Fixed Glass Header */}
                <header className="fixed top-0 right-0 left-0 md:left-64 h-16 flex items-center justify-end px-6 z-20 backdrop-blur-md bg-white/70 dark:bg-navy-900/80 border-b border-transparent transition-colors duration-300">
                    {user ? (
                        <Link
                            to="/settings"
                            className="flex items-center gap-3 pl-3 pr-4 py-1.5 rounded-full bg-slate-100/50 dark:bg-navy-800/50 border border-slate-200/50 dark:border-navy-700/50 hover:bg-slate-200/50 dark:hover:bg-navy-700/50 transition-all backdrop-blur-sm group"
                        >
                            <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 dark:border-navy-600 group-hover:border-mint-500 transition-colors">
                                <img
                                    src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                                    alt={user.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="hidden md:block text-left">
                                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 group-hover:text-navy-900 dark:group-hover:text-white transition-colors">
                                    {user.name}
                                </p>
                                <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                    {user.role}
                                </p>
                            </div>
                        </Link>
                    ) : (
                        <Link
                            to="/login"
                            className="p-2 rounded-full bg-slate-200/50 dark:bg-navy-700/50 text-slate-800 dark:text-white hover:bg-slate-300/50 dark:hover:bg-navy-600/50 transition-colors backdrop-blur-sm"
                        >
                            <SettingsIcon size={20} />
                        </Link>
                    )}
                </header>

                {/* Scrollable Content Area */}
                <main className="flex-1 overflow-y-auto w-full p-4 md:p-8 pt-20 md:pt-24 mb-16 md:mb-0 scroll-smooth">
                    <div className="max-w-7xl mx-auto min-h-full">
                        <Outlet />
                    </div>
                </main>

                {/* Mobile Nav (Fixed Bottom) */}
                <MobileNav />
            </div>
        </div>
    );
};

export default Layout;
