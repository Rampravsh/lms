import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../store/slices/authSlice';
import { User, Mail, Lock, BookOpen, ArrowRight } from 'lucide-react';
import clsx from 'clsx';

const Signup = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLoading, error } = useSelector((state) => state.auth);

    // Form State
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student'); // Default role

    const handleSignup = async (e) => {
        e.preventDefault();
        const resultAction = await dispatch(registerUser({ name, email, password, role }));
        if (registerUser.fulfilled.match(resultAction)) {
            // Check if we got a token back (auto-login triggered)
            if (resultAction.payload && resultAction.payload.token) {
                navigate('/');
            } else {
                navigate('/verify-otp', { state: { email } });
            }
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-navy-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white dark:bg-navy-800 rounded-3xl shadow-xl overflow-hidden border border-slate-200 dark:border-navy-700">
                <div className="p-8">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-mint-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-mint-500/30">
                            <BookOpen size={32} className="text-navy-900" />
                        </div>
                        <h1 className="text-3xl font-bold text-navy-900 dark:text-white mb-2">Create Account</h1>
                        <p className="text-slate-500 dark:text-slate-400">Join our learning community today</p>
                        {error && <p className="text-red-500 mt-2">{error}</p>}
                    </div>

                    <form onSubmit={handleSignup} className="space-y-4 mb-8">
                        {/* Name Field */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-xl focus:ring-2 focus:ring-mint-500 text-slate-900 dark:text-white outline-none transition-all"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-xl focus:ring-2 focus:ring-mint-500 text-slate-900 dark:text-white outline-none transition-all"
                                    placeholder="name@example.com"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-xl focus:ring-2 focus:ring-mint-500 text-slate-900 dark:text-white outline-none transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {/* Role Selection (Demo purposes) */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">I am a:</label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setRole('student')}
                                    className={clsx(
                                        "py-2 px-4 rounded-xl text-sm font-medium transition-all border",
                                        role === 'student'
                                            ? "bg-mint-500 border-mint-500 text-navy-900 shadow-md shadow-mint-500/20"
                                            : "bg-slate-50 dark:bg-navy-900 border-slate-200 dark:border-navy-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-navy-800"
                                    )}
                                >
                                    Student
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRole('admin')}
                                    className={clsx(
                                        "py-2 px-4 rounded-xl text-sm font-medium transition-all border",
                                        role === 'admin'
                                            ? "bg-navy-600 border-navy-600 text-white shadow-md shadow-navy-600/20"
                                            : "bg-slate-50 dark:bg-navy-900 border-slate-200 dark:border-navy-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-navy-800"
                                    )}
                                >
                                    Instructor / Admin
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-mint-500 hover:bg-mint-400 text-navy-900 font-bold py-3.5 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg shadow-mint-500/25 flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
                        >
                            {isLoading ? 'Creating Account...' : 'Create Account'}
                            <ArrowRight size={20} />
                        </button>
                    </form>
                </div>

                <div className="bg-slate-50 dark:bg-navy-900/50 p-6 text-center border-t border-slate-100 dark:border-navy-800">
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                        Already have an account? <Link to="/login" className="font-bold text-mint-600 dark:text-mint-400 hover:underline">Log in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
