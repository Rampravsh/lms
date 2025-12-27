import React from 'react';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import ThemeToggle from '../common/ThemeToggle';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-navy-800 text-slate-900 dark:text-white font-sans flex flex-col md:flex-row transition-colors duration-300">
            <div className="hidden md:block">
                <Sidebar />
            </div>

            <main className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto w-full mb-16 md:mb-0 relative">
                <div className="absolute top-4 right-4 z-10">
                    <ThemeToggle />
                </div>
                <div className="max-w-7xl mx-auto pt-12 md:pt-0">
                    {children}
                </div>
            </main>

            <MobileNav />
        </div>
    );
};

export default Layout;
