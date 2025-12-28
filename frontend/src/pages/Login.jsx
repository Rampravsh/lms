import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../store/slices/authSlice';
import { Lock, Mail, ArrowRight, BookOpen } from 'lucide-react';

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLoading, error } = useSelector((state) => state.auth);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (role) => {
        // We are passing role just to simulate different buttons, 
        // but real login depends on credentials. 
        // For now, we'll just send email/password.
        const resultAction = await dispatch(loginUser({ email, password }));
        if (loginUser.fulfilled.match(resultAction)) {
            navigate('/');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-navy-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white dark:bg-navy-800 rounded-3xl shadow-xl overflow-hidden border border-slate-200 dark:border-navy-700">
                <div className="p-8">
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-mint-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-mint-500/30">
                            <BookOpen size={32} className="text-navy-900" />
                        </div>
                        <h1 className="text-3xl font-bold text-navy-900 dark:text-white mb-2">Welcome Back</h1>
                        <p className="text-slate-500 dark:text-slate-400">Sign in to access your learning dashboard</p>
                        {error && <p className="text-red-500 mt-2">{error}</p>}
                    </div>

                    <div className="space-y-4 mb-8">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-xl focus:ring-2 focus:ring-mint-500 text-slate-900 dark:text-white outline-none transition-all"
                                    placeholder="name@example.com"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-xl focus:ring-2 focus:ring-mint-500 text-slate-900 dark:text-white outline-none transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button className="text-sm font-medium text-mint-600 dark:text-mint-400 hover:text-mint-500">Forgot Password?</button>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={() => handleLogin('student')}
                            className="w-full bg-mint-500 hover:bg-mint-400 text-navy-900 font-bold py-3.5 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg shadow-mint-500/25 flex items-center justify-center gap-2"
                        >
                            {isLoading ? 'Logging in...' : 'Login as Student'}
                            <ArrowRight size={20} />
                        </button>
                        <button
                            onClick={() => handleLogin('admin')}
                            className="w-full bg-slate-100 dark:bg-navy-700 hover:bg-slate-200 dark:hover:bg-navy-600 text-navy-900 dark:text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
                        >
                            Login as Admin
                        </button>
                    </div>
                </div>
                <div className="bg-slate-50 dark:bg-navy-900/50 p-6 text-center border-t border-slate-100 dark:border-navy-800">
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                        Don't have an account? <Link to="/signup" className="font-bold text-mint-600 dark:text-mint-400 hover:underline">Sign up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
