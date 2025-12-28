import React from 'react';
import { User, Bell, Lock, Moon, Sun, Mail, Save, Shield, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../store/slices/authSlice';
import ThemeToggle from '../components/common/ThemeToggle';

const SettingsSection = ({ title, icon: Icon, children }) => (
    <div className="bg-white dark:bg-navy-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-navy-700">
        <h2 className="text-xl font-bold text-navy-900 dark:text-white mb-6 flex items-center gap-2">
            <Icon size={24} className="text-mint-500" />
            {title}
        </h2>
        {children}
    </div>
);

const Settings = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await dispatch(logoutUser());
        navigate('/login');
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-10">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-navy-900 dark:text-white mb-2">
                    Settings
                </h1>
                <p className="text-slate-500 dark:text-slate-400">
                    Manage your account preferences and application settings.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Profile Settings */}
                <SettingsSection title="Profile" icon={User}>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 bg-mint-500 rounded-full overflow-hidden border-2 border-slate-100 dark:border-navy-700">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="Profile" />
                            </div>
                            <button className="text-sm font-semibold text-mint-600 dark:text-mint-400 hover:underline">
                                Change Avatar
                            </button>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                            <input
                                type="text"
                                defaultValue="Alex Johnson"
                                className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-mint-500 focus:border-transparent outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                            <input
                                type="email"
                                defaultValue="alex@example.com"
                                className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-mint-500 focus:border-transparent outline-none"
                            />
                        </div>
                    </div>
                </SettingsSection>

                {/* Appearance Settings */}
                <SettingsSection title="Appearance" icon={Moon}>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-navy-900 rounded-xl border border-slate-100 dark:border-navy-700">
                            <div>
                                <h3 className="font-semibold text-slate-900 dark:text-white">Theme Mode</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Toggle light or dark theme</p>
                            </div>
                            <ThemeToggle />
                        </div>

                        {/* Placeholder for future settings like 'Accent Color' */}
                        <div className="opacity-50 pointer-events-none">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Accent Color (Coming Soon)</label>
                            <div className="flex gap-2">
                                <div className="w-8 h-8 rounded-full bg-mint-500 ring-2 ring-offset-2 ring-mint-500 cursor-pointer"></div>
                                <div className="w-8 h-8 rounded-full bg-blue-500 cursor-pointer"></div>
                                <div className="w-8 h-8 rounded-full bg-purple-500 cursor-pointer"></div>
                            </div>
                        </div>
                    </div>
                </SettingsSection>

                {/* Notifications */}
                <SettingsSection title="Notifications" icon={Bell}>
                    <div className="space-y-3">
                        {['Course Updates', 'New Messages', 'Assignment Deadlines', 'Promotional Emails'].map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between">
                                <span className="text-slate-700 dark:text-slate-300">{item}</span>
                                <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                                    <input type="checkbox" name="toggle" id={`toggle-${idx}`} className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer checked:right-0 checked:bg-mint-500 checked:border-mint-500 transition-all duration-300 right-6 border-slate-300" defaultChecked={idx !== 3} />
                                    <label htmlFor={`toggle-${idx}`} className="toggle-label block overflow-hidden h-6 rounded-full bg-slate-300 cursor-pointer checked:bg-mint-200"></label>
                                </div>
                            </div>
                        ))}
                    </div>
                </SettingsSection>

                {/* Security */}
                <SettingsSection title="Security" icon={Shield}>
                    <div className="space-y-4">
                        <button className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-navy-900 rounded-xl hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors group">
                            <div className="text-left">
                                <h3 className="font-semibold text-slate-900 dark:text-white">Change Password</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Update your account password</p>
                            </div>
                            <Lock size={18} className="text-slate-400 group-hover:text-mint-500" />
                        </button>

                        <button className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-navy-900 rounded-xl hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors group">
                            <div className="text-left">
                                <h3 className="font-semibold text-slate-900 dark:text-white">Two-Factor Auth</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Secure your account</p>
                            </div>
                            <Shield size={18} className="text-slate-400 group-hover:text-mint-500" />
                        </button>
                    </div>
                </SettingsSection>
            </div>

            {/* Actions Footer */}
            <div className="pt-6 border-t border-slate-200 dark:border-navy-800 flex flex-col md:flex-row justify-between items-center gap-4">
                <button
                    onClick={handleLogout}
                    className="w-full md:w-auto px-6 py-3 border border-red-200 dark:border-red-900/30 text-red-500 dark:text-red-400 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                >
                    <LogOut size={20} />
                    Logout
                </button>

                <button className="w-full md:w-auto px-6 py-3 bg-mint-500 text-navy-900 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-mint-400 transition-colors shadow-lg shadow-mint-500/20">
                    <Save size={20} />
                    Save Changes
                </button>
            </div>
        </div>
    );
};

export default Settings;
