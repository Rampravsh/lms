import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchCourses, deleteCourse } from '../../store/slices/courseSlice';
import { Plus, Edit, Trash2, Video, Users } from 'lucide-react';

const AdminCourses = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { courses, isLoading } = useSelector((state) => state.courses);

    useEffect(() => {
        dispatch(fetchCourses());
    }, [dispatch]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            await dispatch(deleteCourse(id));
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-navy-900 dark:text-white">Manage Courses</h1>
                    <p className="text-slate-500 dark:text-slate-400">Create and manage your educational content.</p>
                </div>
                <button
                    onClick={() => navigate('/admin/courses/new')}
                    className="bg-mint-500 hover:bg-mint-400 text-navy-900 font-bold py-2.5 px-6 rounded-xl flex items-center gap-2 shadow-lg shadow-mint-500/20 transition-all"
                >
                    <Plus size={20} />
                    Create Course
                </button>
            </div>

            <div className="bg-white dark:bg-navy-800 rounded-2xl shadow-sm border border-slate-200 dark:border-navy-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-navy-900 border-b border-slate-200 dark:border-navy-700 text-slate-500 dark:text-slate-400 text-sm uppercase tracking-wider">
                                <th className="px-6 py-4 font-medium">Course</th>
                                <th className="px-6 py-4 font-medium">Instructor</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium">Content</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-navy-700">
                            {courses.map((course) => (
                                <tr key={course.id || course._id} className="hover:bg-slate-50 dark:hover:bg-navy-700/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-10 rounded-lg bg-slate-200 dark:bg-navy-900 overflow-hidden">
                                                <img
                                                    src={course.thumbnail || '/placeholder.png'}
                                                    alt="thumbnail"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-slate-800 dark:text-white">{course.title}</h3>
                                                <span className="text-xs text-slate-500 dark:text-slate-400 uppercase">{course.category}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300 text-sm">
                                        {course.instructor?.name || 'Unknown'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${course.isPublished
                                            ? 'bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400'
                                            : 'bg-yellow-100 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
                                            }`}>
                                            {course.isPublished ? 'Published' : 'Draft'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300 text-sm">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-1.5" title="Modules">
                                                <Video size={16} className="text-slate-400" />
                                                <span>{course.videos?.length || 0}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5" title="Students">
                                                <Users size={16} className="text-slate-400" />
                                                <span>{course.studentsEnrolled?.length || 0}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => navigate(`/admin/courses/${course.id || course._id}/edit`)}
                                                className="p-2 text-slate-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors"
                                                title="Edit Course"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(course.id || course._id)}
                                                className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                                                title="Delete Course"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {courses.length === 0 && !isLoading && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                                        No courses found. Create your first course to get started.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminCourses;
