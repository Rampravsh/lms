import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../store/slices/authSlice';
import { LayoutDashboard, BookOpen, Calendar, MessageSquare, Settings, LogOut, TrendingUp, Smartphone, LogIn, Video } from 'lucide-react';
import clsx from 'clsx';

const Sidebar = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await dispatch(logoutUser());
        navigate('/login');
    };

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/', hideForRoles: ['admin'] },
        { icon: TrendingUp, label: 'Analytics', path: '/analytics', roles: ['admin'] },
        { icon: BookOpen, label: 'Courses', path: '/courses' },
        { icon: Video, label: 'Manage Courses', path: '/admin/courses', roles: ['admin', 'instructor'] },
        { icon: Calendar, label: 'Calendar', path: '/calendar', protected: true },
        { icon: MessageSquare, label: 'Messages', path: '/messages', protected: true },
        { icon: Settings, label: 'Settings', path: '/settings', protected: true },
    ];

    return (
        <aside className="w-64 bg-white dark:bg-navy-900 border-r border-slate-200 dark:border-navy-800 h-screen fixed left-0 top-0 flex flex-col transition-colors duration-300">
            <div className="p-6">
                <h1 className="text-2xl font-bold text-navy-900 dark:text-white flex items-center gap-2">
                    <span className="w-8 h-8 bg-mint-500 rounded-lg flex items-center justify-center text-navy-900 font-bold">L</span>
                    LMS
                </h1>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-2">
                {navItems
                    .filter(item => {
                        if (item.hideForRoles && user && item.hideForRoles.includes(user.role)) return false;
                        if (item.roles && (!user || !item.roles.includes(user.role))) return false;
                        if (item.protected && !user) return false;
                        return true;
                    })
                    .map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                clsx(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                                    isActive
                                        ? "bg-mint-500 text-navy-900 font-semibold shadow-lg shadow-mint-500/20"
                                        : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-navy-800 hover:text-navy-900 dark:hover:text-white"
                                )
                            }
                        >
                            <item.icon size={20} />
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
            </nav>

            <div className="p-4 border-t border-slate-200 dark:border-navy-800">
                <div className="p-4 border-t border-slate-200 dark:border-navy-800">
                    {user ? (
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 w-full hover:bg-slate-100 dark:hover:bg-navy-800 rounded-xl transition-colors"
                        >
                            <LogOut size={20} />
                            <span>Logout</span>
                        </button>
                    ) : (
                        <button
                            onClick={() => navigate('/login')}
                            className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-mint-600 dark:hover:text-mint-400 w-full hover:bg-slate-100 dark:hover:bg-navy-800 rounded-xl transition-colors"
                        >
                            <LogIn size={20} />
                            <span>Login</span>
                        </button>
                    )}
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
