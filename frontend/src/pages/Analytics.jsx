import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, AlertCircle, Clock, TrendingUp } from 'lucide-react';

import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchAdminDashboard } from '../store/slices/courseSlice';

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white dark:bg-navy-800 p-6 rounded-2xl border border-slate-200 dark:border-navy-700/50 flex items-center gap-4 shadow-sm dark:shadow-none transition-colors">
        <div className={`p-4 rounded-xl bg-slate-100 dark:bg-navy-900 ${color} bg-opacity-10 dark:bg-opacity-100`}>
            <Icon size={24} />
        </div>
        <div>
            <p className="text-slate-500 dark:text-slate-400 text-sm">{title}</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{value}</h3>
        </div>
    </div>
);

const Analytics = () => {
    const dispatch = useDispatch();
    const { dashboard, isLoading } = useSelector((state) => state.courses);

    useEffect(() => {
        dispatch(fetchAdminDashboard());
    }, [dispatch]);

    if (isLoading || !dashboard) {
        return <div className="p-8 text-center">Loading analytics...</div>;
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Instructor Analytics</h1>
                    <p className="text-slate-500 dark:text-slate-400">Class performance overview and insights.</p>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Students" value={dashboard.totalStudents || 0} icon={Users} color="text-blue-400" />
                <StatCard title="Active Courses" value={dashboard.totalCourses || 0} icon={TrendingUp} color="text-orange-400" />
                <StatCard title="Total Enrollments" value={dashboard.totalEnrollments || 0} icon={Users} color="text-mint-400" />
                <StatCard title="Avg. Completion" value={`${dashboard.avgCompletionRate || 0}%`} icon={Clock} color="text-red-400" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Chart 1: Enrollment Growth */}
                <div className="bg-white dark:bg-navy-800 rounded-2xl shadow-sm border border-slate-200 dark:border-navy-700 p-6">
                    <h2 className="text-xl font-bold text-navy-900 dark:text-white mb-6">New Enrollments (Trends)</h2>
                    <div className="h-[300px] w-full flex items-center justify-center">
                        {(!dashboard.enrollmentGrowth || dashboard.enrollmentGrowth.length === 0 || dashboard.enrollmentGrowth.every(d => d.avg === 0)) ? (
                            <div className="text-center text-slate-400">
                                <p>No enrollment trends yet.</p>
                                <p className="text-sm">Share your courses to get started!</p>
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={dashboard.enrollmentGrowth || []}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                    <XAxis dataKey="subject" tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
                                        itemStyle={{ color: '#64ffda' }}
                                        cursor={{ fill: 'transparent' }}
                                    />
                                    <Bar dataKey="avg" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* Chart 2: Course Popularity */}
                <div className="bg-white dark:bg-navy-800 rounded-2xl shadow-sm border border-slate-200 dark:border-navy-700 p-6">
                    <h2 className="text-xl font-bold text-navy-900 dark:text-white mb-6">Most Popular Courses</h2>
                    <div className="h-[300px] w-full flex items-center justify-center">
                        {(!dashboard.coursePopularity || dashboard.coursePopularity.length === 0) ? (
                            <div className="text-center text-slate-400">
                                <p>No data available.</p>
                                <p className="text-sm">Enrollments will appear here.</p>
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={dashboard.coursePopularity || []} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                                    <XAxis type="number" tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                    <YAxis dataKey="subject" type="category" width={100} tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
                                        itemStyle={{ color: '#ffbd2e' }}
                                        cursor={{ fill: 'transparent' }}
                                    />
                                    <Bar dataKey="avg" fill="#ffbd2e" radius={[0, 4, 4, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>
            </div>

            {/* At Risk Students List */}
            <div className="bg-white dark:bg-navy-800 rounded-2xl border border-slate-200 dark:border-navy-700 overflow-hidden shadow-sm dark:shadow-none transition-colors">
                <div className="p-6 border-b border-slate-200 dark:border-navy-700">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white">At-Risk Students Requiring Attention</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-navy-900 text-slate-500 dark:text-slate-400 text-sm uppercase tracking-wider">
                                <th className="px-6 py-4 font-medium">Student Name</th>
                                <th className="px-6 py-4 font-medium">Risk Factor</th>
                                <th className="px-6 py-4 font-medium">Last Active</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-navy-700">
                            {(dashboard.atRiskStudents || []).length === 0 && (
                                <tr>
                                    <td colSpan="3" className="px-6 py-4 text-center text-slate-500">No students currently at risk.</td>
                                </tr>
                            )}
                            {(dashboard.atRiskStudents || []).map((student) => (
                                <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-navy-700/50 transition-colors">
                                    <td className="px-6 py-4 text-slate-800 dark:text-white font-medium">{student.name}</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20">
                                            {student.risk}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-sm">{student.lastActive}</td>
                                    <td className="px-6 py-4 text-right">
                                        {/* Action buttons can go here */}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
