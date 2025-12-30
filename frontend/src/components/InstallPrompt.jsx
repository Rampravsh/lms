import React, { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';

const InstallPrompt = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Listen for the 'beforeinstallprompt' event
        const handleBeforeInstallPrompt = (e) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e);
            // Update UI notify the user they can install the PWA
            setIsVisible(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        // Optionally listen for appinstalled event to hide
        window.addEventListener('appinstalled', () => {
            setIsVisible(false);
            setDeferredPrompt(null);
            console.log('PWA was installed');
        });

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', () => { });
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        // Show the install prompt
        deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);

        // We've used the prompt, and can't use it again, discard it
        setDeferredPrompt(null);
        setIsVisible(false);
    };

    const handleClose = () => {
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 z-50 animate-bounce-in">
            <div className="bg-white dark:bg-navy-800 p-4 rounded-2xl shadow-xl border border-mint-500/20 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-mint-100 dark:bg-mint-900/30 rounded-xl text-mint-600 dark:text-mint-400">
                        <Download size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-navy-900 dark:text-white text-sm">Install App</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Add to home screen for better experience.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleClose}
                        className="p-2 text-slate-400 hover:text-navy-900 dark:hover:text-white"
                    >
                        <X size={20} />
                    </button>
                    <button
                        onClick={handleInstallClick}
                        className="px-4 py-2 bg-mint-500 hover:bg-mint-400 text-navy-900 font-bold rounded-xl text-sm whitespace-nowrap shadow-lg shadow-mint-500/20"
                    >
                        Install
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InstallPrompt;
