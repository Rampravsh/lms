import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Flame, Clock, CalendarDays, MoreVertical, BookOpen } from 'lucide-react';
import clsx from 'clsx';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudentDashboard } from '../store/slices/courseSlice';

// --- Sub-Components ---
const ProgressCircle = ({ percentage, label, colorClass, grade }) => {
    const radius = 30;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-24 h-24 flex items-center justify-center">
                {/* Background Circle */}
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        cx="48"
                        cy="48"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-slate-200 dark:text-navy-700"
                    />
                    {/* Progress Circle */}
                    <circle
                        cx="48"
                        cy="48"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        className={clsx("transition-all duration-1000 ease-out", colorClass)}
                    />
                </svg>
                <span className="absolute text-xl font-bold text-slate-800 dark:text-white">{grade || `${percentage}%`}</span>
            </div>
            <span className="mt-2 text-sm text-slate-500 dark:text-slate-400 font-medium">{label}</span>
            {grade && <span className="text-xs text-mint-600 dark:text-mint-500">Excellent</span>}
        </div>
    );
};

const StatWidget = ({ icon: Icon, title, value, subtext }) => (
    <div className="bg-white dark:bg-navy-800 p-6 rounded-2xl border border-slate-200 dark:border-navy-700/50 hover:border-mint-500/30 transition-colors group shadow-sm dark:shadow-none">
        <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-slate-100 dark:bg-navy-900 rounded-xl group-hover:bg-mint-500/10 transition-colors">
                <Icon className="text-mint-600 dark:text-mint-400 group-hover:text-mint-500 dark:group-hover:text-mint-300" size={24} />
            </div>
            <MoreVertical size={16} className="text-slate-400 dark:text-navy-600 cursor-pointer hover:text-navy-900 dark:hover:text-white" />
        </div>
        <h3 className="text-3xl font-bold text-slate-800 dark:text-white mb-1">{value}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{title}</p>
        <p className="text-xs text-mint-600 dark:text-mint-500 mt-2">{subtext}</p>
    </div>
);

const ContinueLearningCard = ({ course, progress, onResume }) => {
    if (!course) return null;

    return (
        <div className="bg-gradient-to-br from-navy-800 to-navy-900 dark:from-navy-800 dark:to-navy-900 border border-navy-700 dark:border-navy-700 p-6 rounded-2xl relative overflow-hidden group shadow-lg">
            {/* Decorative Blur */}
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-mint-500/10 blur-3xl rounded-full group-hover:bg-mint-500/20 transition-all"></div>

            <div className="relative z-10 flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                    <p className="text-mint-400 text-sm font-bold uppercase tracking-wider mb-2">Continue Learning</p>
                    <h2 className="text-2xl font-bold text-white mb-2">{course.title}</h2>
                    <p className="text-slate-400 text-sm mb-6">{course.description}</p>

                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex-1 h-2 bg-navy-950 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-mint-500 rounded-full shadow-[0_0_10px_rgba(100,255,218,0.5)] transition-all duration-1000"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                        <span className="text-white font-bold text-sm">{progress}%</span>
                    </div>

                    <button
                        onClick={onResume}
                        className="bg-mint-500 hover:bg-mint-400 text-navy-900 font-bold py-3 px-8 rounded-xl flex items-center gap-2 transition-transform active:scale-95 shadow-lg shadow-mint-500/20"
                    >
                        <Play size={18} fill="currentColor" />
                        Resume
                    </button>
                </div>

                {/* Video Thumbnail Placeholder */}
                <div className="w-full md:w-64 h-40 bg-navy-950 rounded-xl relative overflow-hidden border border-navy-700/50 group-hover:border-mint-500/50 transition-colors">
                    <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20">
                            <Play size={20} className="ml-1 text-white" fill="currentColor" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AssignmentItem = ({ title, due, subject, icon: Icon }) => (
    <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-navy-900/50 border border-slate-200 dark:border-navy-800 rounded-xl hover:border-mint-500/30 dark:hover:border-navy-600 transition-colors cursor-pointer text-left">
        <div className="p-3 bg-white dark:bg-navy-800 rounded-lg text-mint-600 dark:text-mint-400 shadow-sm dark:shadow-none">
            <Icon size={20} />
        </div>
        <div className="flex-1">
            <h4 className="text-slate-800 dark:text-white font-semibold text-sm">{title}</h4>
            <p className="text-slate-500 dark:text-slate-500 text-xs">{subject}</p>
        </div>
        <div className="text-right">
            <p className="text-slate-600 dark:text-slate-300 text-xs font-medium">{due}</p>
            <span className="text-[10px] text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-400/10 px-2 py-0.5 rounded-full mt-1 inline-block">Due soon</span>
        </div>
    </div>
)

const Dashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { dashboard, isLoading } = useSelector((state) => state.courses);
    const { user, isAuthenticated } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isAuthenticated) {
            if (user?.role === 'admin') {
                navigate('/analytics');
            } else {
                dispatch(fetchStudentDashboard());
            }
        }
    }, [dispatch, isAuthenticated, user, navigate]);

    // --- Public / Demo Dashboard Logic ---
    if (!isAuthenticated) {
        return (
            <div className="space-y-8 animate-fade-in">
                {/* Public Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">Welcome to LMS</h1>
                        <p className="text-slate-500 dark:text-slate-400">Start your learning journey today.</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => navigate('/login')}
                            className="px-6 py-2 bg-white dark:bg-navy-800 text-slate-700 dark:text-white font-semibold rounded-xl border border-slate-200 dark:border-navy-700 hover:bg-slate-50 dark:hover:bg-navy-700 transition-colors"
                        >
                            Login
                        </button>
                        <button
                            onClick={() => navigate('/signup')}
                            className="px-6 py-2 bg-mint-500 text-navy-900 font-bold rounded-xl hover:bg-mint-400 transition-colors shadow-lg shadow-mint-500/20"
                        >
                            Get Started
                        </button>
                    </div>
                </div>

                {/* Demo Stats Grid (Blurred/Locked) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
                    {/* Overlay for locking content */}
                    <div className="absolute inset-0 z-10 bg-white/50 dark:bg-navy-900/50 backdrop-blur-sm flex items-center justify-center rounded-2xl border border-slate-200 dark:border-navy-700">
                        <div className="text-center p-6 bg-white dark:bg-navy-800 rounded-2xl shadow-xl border border-slate-100 dark:border-navy-700">
                            <h3 className="text-xl font-bold text-navy-900 dark:text-white mb-2">Track Your Progress</h3>
                            <p className="text-slate-500 dark:text-slate-400 mb-4">Log in to see your stats, streak, and learning hours.</p>
                            <button
                                onClick={() => navigate('/login')}
                                className="px-6 py-2 bg-mint-500 text-navy-900 font-bold rounded-xl hover:bg-mint-400 transition-colors"
                            >
                                Login to View
                            </button>
                        </div>
                    </div>

                    {/* Mock Widgets behind blur */}
                    <div className="bg-white dark:bg-navy-800 p-6 rounded-2xl border border-slate-200 dark:border-navy-700/50 flex flex-col justify-between opacity-50">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Overall Progress</h3>
                        <div className="flex justify-between items-end">
                            <ProgressCircle percentage={0} label="Course Completion" colorClass="text-mint-500" />
                            <ProgressCircle percentage={0} label="Quiz Performance" colorClass="text-blue-500" />
                            <ProgressCircle percentage={0} grade="-" label="Grade" colorClass="text-purple-500" />
                        </div>
                    </div>
                    <StatWidget icon={BookOpen} title="Active Courses" value="-" subtext="View all courses" />
                    <StatWidget icon={Flame} title="Study Streak" value="-" subtext="Keep it up!" />
                    <StatWidget icon={Clock} title="Hours Spent" value="-" subtext="Total learning time" />
                </div>

                {/* Public Course Teaser */}
                <div className="bg-gradient-to-br from-navy-900 to-navy-800 rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden">
                    <div className="relative z-10 max-w-2xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Explore Our Premium Courses</h2>
                        <p className="text-slate-300 mb-8 text-lg">Access high-quality content, expert instructors, and a supportive community. Join thousands of learners today.</p>
                        <button
                            onClick={() => navigate('/courses')}
                            className="px-8 py-3 bg-mint-500 text-navy-900 font-bold text-lg rounded-xl hover:bg-mint-400 transition-transform hover:scale-105 shadow-xl shadow-mint-500/20"
                        >
                            Browse All Courses
                        </button>
                    </div>
                    {/* Decorative Background */}
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
                        </svg>
                    </div>
                </div>
            </div>
        );
    }

    if (isLoading || !dashboard) {
        return <div className="p-8 text-center text-slate-500">Loading dashboard...</div>;
    }

    const { enrolledCourses, completedCourses, totalHours, activeCourse } = dashboard;

    // Placeholder for progress until backend provides it per course in this endpoint
    const activeProgress = 0;

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">Welcome back, {user?.name || 'Student'}!</h1>
                    <p className="text-slate-500 dark:text-slate-400">Here's what's happening with your courses today.</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-500 dark:text-slate-400 hidden md:block">October 25, 2025</span>
                    <button className="p-2 bg-white dark:bg-navy-800 rounded-lg text-slate-500 dark:text-slate-300 hover:text-navy-900 dark:hover:text-white border border-slate-200 dark:border-navy-700 shadow-sm dark:shadow-none">
                        <CalendarDays size={20} />
                    </button>
                    <div className="w-10 h-10 bg-mint-500 rounded-full overflow-hidden border-2 border-white dark:border-navy-800 shadow-md">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="Profile" />
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-navy-800 p-6 rounded-2xl border border-slate-200 dark:border-navy-700/50 flex flex-col justify-between shadow-sm dark:shadow-none">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Overall Progress</h3>
                    <div className="flex justify-between items-end">
                        <ProgressCircle percentage={activeProgress} label="Course Completion" colorClass="text-mint-500" />
                        <ProgressCircle percentage={88} label="Quiz Performance" colorClass="text-blue-500" />
                        <ProgressCircle percentage={95} grade="A-" label="Grade" colorClass="text-purple-500" />
                    </div>
                </div>

                <div className="cursor-pointer transition-transform hover:-translate-y-1" onClick={() => navigate('/courses')}>
                    <StatWidget icon={BookOpen} title="Active Courses" value={enrolledCourses} subtext="View all courses" />
                </div>
                <StatWidget icon={Flame} title="Study Streak" value="0 Days" subtext="Keep it up!" />
                <StatWidget icon={Clock} title="Hours Spent" value={`${totalHours}h`} subtext="Total learning time" />

                <div className="bg-white dark:bg-navy-800 p-6 rounded-2xl border border-slate-200 dark:border-navy-700/50 shadow-sm dark:shadow-none">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Upcoming Assignments</h3>
                    <div className="space-y-3">
                        <AssignmentItem icon={Clock} title="ML Project" subject="Machine Learning" due="Tomorrow" />
                        <AssignmentItem icon={CalendarDays} title="Statistics Quiz" subject="Data Science" due="Oct 28" />
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:col-span-3 gap-8">
                <div className="lg:col-span-2">
                    {activeCourse ? (
                        <ContinueLearningCard
                            course={activeCourse}
                            progress={activeProgress}
                            onResume={() => navigate(`/courses/${activeCourse._id}/learn`)}
                        />
                    ) : (
                        <div className="bg-white dark:bg-navy-800 p-8 rounded-2xl border border-dashed border-slate-300 dark:border-navy-700 text-center flex flex-col items-center justify-center h-64">
                            <BookOpen size={48} className="text-slate-300 dark:text-navy-600 mb-4" />
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">No active courses</h3>
                            <p className="text-slate-500 mb-4">You haven't enrolled in any courses yet.</p>
                            <button
                                onClick={() => navigate('/courses')}
                                className="bg-mint-500 text-navy-900 px-6 py-2 rounded-xl font-semibold hover:bg-mint-400 transition-colors"
                            >
                                Browse Courses
                            </button>
                        </div>
                    )}
                </div>

                {/* Right Column / Additional Widgets could go here */}
                <div className="bg-white dark:bg-navy-800 p-6 rounded-2xl border border-slate-200 dark:border-navy-700 h-full flex items-center justify-center text-slate-500 shadow-sm dark:shadow-none">
                    <div className="text-center">
                        <p className="mb-2 text-slate-500 dark:text-slate-500">Weekly Goal</p>
                        <div className="text-2xl font-bold text-slate-800 dark:text-white mb-1">4/5 Days</div>
                        <div className="w-full bg-slate-100 dark:bg-navy-950 h-2 rounded-full mt-2">
                            <div className="bg-blue-500 h-full w-[80%] rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
