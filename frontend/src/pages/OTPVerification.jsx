import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { verifyOtp, resendOtp } from '../store/slices/authSlice';
import { Shield, ArrowRight, RefreshCw } from 'lucide-react';

const OTPVerification = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isLoading, error } = useSelector((state) => state.auth);

    const [otp, setOtp] = useState('');
    const [email, setEmail] = useState('');
    const [timer, setTimer] = useState(600); // 10 minutes in seconds
    const [canResend, setCanResend] = useState(false);

    useEffect(() => {
        if (location.state?.email) {
            setEmail(location.state.email);
        } else {
            // Redirect if no email provided (e.g. direct access)
            navigate('/signup');
        }
    }, [location, navigate]);

    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else {
            setCanResend(true);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        const resultAction = await dispatch(verifyOtp({ email, otp }));
        if (verifyOtp.fulfilled.match(resultAction)) {
            navigate('/');
        }
    };

    const handleResend = async () => {
        setCanResend(false);
        setTimer(600);
        await dispatch(resendOtp({ email }));
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-navy-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white dark:bg-navy-800 rounded-3xl shadow-xl overflow-hidden border border-slate-200 dark:border-navy-700">
                <div className="p-8">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-mint-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-mint-500/30">
                            <Shield size={32} className="text-navy-900" />
                        </div>
                        <h1 className="text-3xl font-bold text-navy-900 dark:text-white mb-2">Verify Email</h1>
                        <p className="text-slate-500 dark:text-slate-400">
                            We sent a code to <span className="font-semibold text-navy-900 dark:text-white">{email}</span>
                        </p>
                    </div>

                    <form onSubmit={handleVerify} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 text-center">
                                Enter 6-digit Code
                            </label>
                            <input
                                type="text"
                                maxLength="6"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                className="w-full text-center text-3xl tracking-[0.5em] font-bold py-4 bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-xl focus:ring-2 focus:ring-mint-500 text-slate-900 dark:text-white outline-none transition-all"
                                placeholder="000000"
                            />
                        </div>

                        {error && <p className="text-red-500 text-center text-sm">{error}</p>}

                        <button
                            type="submit"
                            disabled={isLoading || otp.length !== 6}
                            className="w-full bg-mint-500 hover:bg-mint-400 text-navy-900 font-bold py-3.5 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg shadow-mint-500/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Verifying...' : 'Verify Account'}
                            <ArrowRight size={20} />
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-2">
                            Didn't receive the code?
                        </p>
                        {canResend ? (
                            <button
                                onClick={handleResend}
                                className="flex items-center justify-center gap-2 mx-auto text-mint-600 dark:text-mint-400 font-semibold hover:underline"
                            >
                                <RefreshCw size={16} />
                                Resend Code
                            </button>
                        ) : (
                            <p className="text-slate-400 dark:text-slate-500 text-sm font-medium">
                                Resend in {formatTime(timer)}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OTPVerification;
