import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, AlertCircle, Clock, TrendingUp } from 'lucide-react';

const data = [
    { subject: 'Math', avg: 85 },
    { subject: 'Physics', avg: 72 },
    { subject: 'Chem', avg: 90 },
    { subject: 'Bio', avg: 68 },
    { subject: 'Eng', avg: 78 },
    { subject: 'Hist', avg: 82 },
];

const loginActivity = [
    { day: 'Mon', count: 120 },
    { day: 'Tue', count: 145 },
    { day: 'Wed', count: 132 },
    { day: 'Thu', count: 98 },
    { day: 'Fri', count: 150 },
    { day: 'Sat', count: 45 },
    { day: 'Sun', count: 30 },
];

const atRiskStudents = [
    { name: 'Manuel Kenner', risk: 'Low Engagement', lastActive: 'Jun 25, 2023', id: 1 },
    { name: 'Alslia Cemmis', risk: 'Missing Assignments', lastActive: 'Jun 25, 2023', id: 2 },
    { name: 'Janastin Wium', risk: 'Low Test Scores', lastActive: 'Mar 13, 2023', id: 3 },
    { name: 'Tasla Rrager', risk: 'Low Engagement', lastActive: 'May 22, 2023', id: 4 },
];

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-navy-800 p-6 rounded-2xl border border-navy-700/50 flex items-center gap-4">
        <div className={`p-4 rounded-xl bg-navy-900 ${color}`}>
            <Icon size={24} />
        </div>
        <div>
            <p className="text-slate-400 text-sm">{title}</p>
            <h3 className="text-2xl font-bold text-white">{value}</h3>
        </div>
    </div>
);

const Analytics = () => {
    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-white">Instructor Analytics</h1>
                    <p className="text-slate-400">Class performance overview and insights.</p>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Students" value="1,240" icon={Users} color="text-blue-400" />
                <StatCard title="At-Risk" value="12" icon={AlertCircle} color="text-red-400" />
                <StatCard title="Avg. Attendance" value="92%" icon={Clock} color="text-mint-400" />
                <StatCard title="Class Average" value="B+" icon={TrendingUp} color="text-orange-400" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Bar Chart Component */}
                <div className="bg-navy-800 p-6 rounded-2xl border border-navy-700">
                    <h3 className="text-lg font-semibold text-white mb-6">Class Average Scores by Subject</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
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
                    </div>
                </div>

                {/* Login Activity Heatmap (Simplified as a Grid for now) */}
                <div className="bg-navy-800 p-6 rounded-2xl border border-navy-700">
                    <h3 className="text-lg font-semibold text-white mb-6">Student Login Activity (Last 7 Days)</h3>

                    <div className="grid grid-cols-7 gap-2 h-64 items-end">
                        {loginActivity.map((day, idx) => (
                            <div key={idx} className="flex flex-col items-center gap-2 group">
                                <div
                                    className="w-full bg-mint-500/20 rounded-md relative group-hover:bg-mint-500/40 transition-colors"
                                    style={{ height: `${(day.count / 150) * 100}%` }}
                                >
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-navy-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-navy-700 pointer-events-none z-10">
                                        {day.count} logins
                                    </div>
                                </div>
                                <span className="text-xs text-slate-500">{day.day}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* At Risk Students List */}
            <div className="bg-navy-800 rounded-2xl border border-navy-700 overflow-hidden">
                <div className="p-6 border-b border-navy-700">
                    <h3 className="text-lg font-semibold text-white">At-Risk Students Requiring Attention</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-navy-900 text-slate-400 text-sm uppercase tracking-wider">
                                <th className="px-6 py-4 font-medium">Student Name</th>
                                <th className="px-6 py-4 font-medium">Risk Factor</th>
                                <th className="px-6 py-4 font-medium">Last Active</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-navy-700">
                            {atRiskStudents.map((student) => (
                                <tr key={student.id} className="hover:bg-navy-700/50 transition-colors">
                                    <td className="px-6 py-4 text-white font-medium">{student.name}</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-500/10 text-orange-400 border border-orange-500/20">
                                            {student.risk}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-400 text-sm">{student.lastActive}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-blue-400 hover:text-blue-300 text-sm font-medium hover:underline">
                                            View Profile
                                        </button>
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
