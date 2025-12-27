import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import { Settings as SettingsIcon } from 'lucide-react';

const Layout = ({ children }) => {
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
                    <Link
                        to="/settings"
                        className="p-2 rounded-full bg-slate-200/50 dark:bg-navy-700/50 text-slate-800 dark:text-white hover:bg-slate-300/50 dark:hover:bg-navy-600/50 transition-colors backdrop-blur-sm"
                    >
                        <SettingsIcon size={20} />
                    </Link>
                </header>

                {/* Scrollable Content Area */}
                <main className="flex-1 overflow-y-auto w-full p-4 md:p-8 pt-20 md:pt-24 mb-16 md:mb-0 scroll-smooth">
                    <div className="max-w-7xl mx-auto min-h-full">
                        {children}
                    </div>
                </main>

                {/* Mobile Nav (Fixed Bottom) */}
                <MobileNav />
            </div>
        </div>
    );
};

export default Layout;
