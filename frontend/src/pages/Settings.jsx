import React, { useState, useEffect } from 'react';
import { User, Bell, Lock, Moon, Sun, Mail, Save, Shield, LogOut, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser, setUser } from '../store/slices/authSlice';
import ThemeToggle from '../components/common/ThemeToggle';
import api from '../api/axios';

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
    const { user: reduxUser } = useSelector((state) => state.auth);
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        bio: '',
        avatar: '',
        notifications: {
            courseUpdates: true,
            newMessages: true,
            assignmentDeadlines: true,
            promotionalEmails: false
        }
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPasswordForm, setShowPasswordForm] = useState(false);

    // Load user data
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await api.get('/auth/me');

                if (response.data.success) {
                    const u = response.data.data;
                    setFormData({
                        name: u.name || '',
                        email: u.email || '',
                        bio: u.bio || '',
                        avatar: u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name}`,
                        notifications: {
                            courseUpdates: u.notifications?.courseUpdates ?? true,
                            newMessages: u.notifications?.newMessages ?? true,
                            assignmentDeadlines: u.notifications?.assignmentDeadlines ?? true,
                            promotionalEmails: u.notifications?.promotionalEmails ?? false
                        }
                    });
                }
            } catch (error) {
                console.error("Failed to load user settings", error);
            }
        };
        fetchUserData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNotificationChange = (key) => {
        setFormData(prev => ({
            ...prev,
            notifications: {
                ...prev.notifications,
                [key]: !prev.notifications[key]
            }
        }));
    };

    const handleRegenerateAvatar = () => {
        const randomSeed = Math.random().toString(36).substring(7);
        const newAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${randomSeed}`;
        setFormData(prev => ({ ...prev, avatar: newAvatar }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setIsLoading(true);
        setSuccessMessage('');
        try {
            const response = await api.put('/auth/profile', {
                name: formData.name,
                bio: formData.bio,
                avatar: formData.avatar,
                notifications: formData.notifications
            });

            if (response.data.success) {
                setSuccessMessage('Settings saved successfully!');
                dispatch(setUser(response.data.data)); // Update Redux state
                setTimeout(() => setSuccessMessage(''), 3000);
            }
        } catch (error) {
            console.error("Failed to save settings", error);
            alert("Failed to save settings");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSavePassword = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert("New passwords do not match");
            return;
        }
        if (!passwordData.currentPassword) {
            alert("Please enter current password");
            return;
        }

        try {
            const response = await api.put('/auth/password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });

            if (response.data.success) {
                alert("Password changed successfully");
                setShowPasswordForm(false);
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            }
        } catch (error) {
            alert(error.response?.data?.message || "Failed to change password");
        }
    };

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
                                <img src={formData.avatar} alt="Profile" />
                            </div>
                            <button
                                onClick={handleRegenerateAvatar}
                                className="text-sm font-semibold text-mint-600 dark:text-mint-400 hover:underline"
                            >
                                Change Avatar (Randomize)
                            </button>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-mint-500 focus:border-transparent outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Bio</label>
                            <input
                                type="text"
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                placeholder="Tell us about yourself"
                                className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-mint-500 focus:border-transparent outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                            <input
                                type="email"
                                value={formData.email}
                                disabled
                                className="w-full px-4 py-2 rounded-xl bg-slate-100 dark:bg-navy-950 border border-slate-200 dark:border-navy-700 text-slate-500 dark:text-slate-400 cursor-not-allowed"
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
                        {[
                            { label: 'Course Updates', key: 'courseUpdates' },
                            { label: 'New Messages', key: 'newMessages' },
                            { label: 'Assignment Deadlines', key: 'assignmentDeadlines' },
                            { label: 'Promotional Emails', key: 'promotionalEmails' }
                        ].map((item) => (
                            <div key={item.key} className="flex items-center justify-between">
                                <span className="text-slate-700 dark:text-slate-300">{item.label}</span>
                                <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                                    <input
                                        type="checkbox"
                                        id={item.key}
                                        checked={formData.notifications[item.key]}
                                        onChange={() => handleNotificationChange(item.key)}
                                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer checked:right-0 checked:bg-mint-500 checked:border-mint-500 transition-all duration-300 right-6 border-slate-300"
                                    />
                                    <label htmlFor={item.key} className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${formData.notifications[item.key] ? 'bg-mint-200' : 'bg-slate-300'}`}></label>
                                </div>
                            </div>
                        ))}
                    </div>
                </SettingsSection>

                {/* Security */}
                <SettingsSection title="Security" icon={Shield}>
                    <div className="space-y-4">
                        {!showPasswordForm ? (
                            <button
                                onClick={() => setShowPasswordForm(true)}
                                className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-navy-900 rounded-xl hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors group"
                            >
                                <div className="text-left">
                                    <h3 className="font-semibold text-slate-900 dark:text-white">Change Password</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Update your account password</p>
                                </div>
                                <Lock size={18} className="text-slate-400 group-hover:text-mint-500" />
                            </button>
                        ) : (
                            <div className="p-4 bg-slate-50 dark:bg-navy-900 rounded-xl border border-slate-200 dark:border-navy-700 space-y-3 animate-fade-in">
                                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Change Password</h3>
                                <input
                                    type="password"
                                    name="currentPassword"
                                    placeholder="Current Password"
                                    value={passwordData.currentPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full px-4 py-2 rounded-xl bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-600 text-slate-900 dark:text-white focus:ring-2 focus:ring-mint-500 outline-none"
                                />
                                <input
                                    type="password"
                                    name="newPassword"
                                    placeholder="New Password"
                                    value={passwordData.newPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full px-4 py-2 rounded-xl bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-600 text-slate-900 dark:text-white focus:ring-2 focus:ring-mint-500 outline-none"
                                />
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Confirm New Password"
                                    value={passwordData.confirmPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full px-4 py-2 rounded-xl bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-600 text-slate-900 dark:text-white focus:ring-2 focus:ring-mint-500 outline-none"
                                />
                                <div className="flex justify-end gap-2 pt-2">
                                    <button
                                        onClick={() => setShowPasswordForm(false)}
                                        className="px-3 py-1 text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSavePassword}
                                        className="px-3 py-1 text-sm bg-mint-500 text-navy-900 rounded-lg hover:bg-mint-400 font-medium"
                                    >
                                        Update Password
                                    </button>
                                </div>
                            </div>
                        )}

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

                <div className="flex items-center gap-4 w-full md:w-auto">
                    {successMessage && (
                        <span className="text-green-500 flex items-center gap-1 animate-fade-in">
                            <Check size={18} />
                            {successMessage}
                        </span>
                    )}
                    <button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="w-full md:w-auto px-6 py-3 bg-mint-500 text-navy-900 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-mint-400 transition-colors shadow-lg shadow-mint-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-navy-900 border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Save size={20} />
                        )}
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Settings;
