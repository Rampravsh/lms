import React from 'react';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-navy-800 text-white font-sans flex flex-col md:flex-row">
            <div className="hidden md:block">
                <Sidebar />
            </div>

            <main className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto w-full mb-16 md:mb-0">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>

            <MobileNav />
        </div>
    );
};

export default Layout;
