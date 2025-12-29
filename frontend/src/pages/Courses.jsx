import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourses } from '../store/slices/courseSlice';
import { PlayCircle, Clock, BookOpen, ExternalLink, Loader } from 'lucide-react';

const Courses = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { courses, isLoading, error } = useSelector((state) => state.courses);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(fetchCourses());
    }, [dispatch]);

    // Helper to check enrollment (mock logic if backend doesn't provide it directly in list)
    // Assuming course object might have 'isEnrolled' or we check student's enrollment list
    // For now, simple check:
    const isEnrolled = (courseId) => {
        if (!user || !courseId) return false;
        // Ideally checking user.enrolledCourses if available, or course.studentsEnrolled
        return false;
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader className="animate-spin text-mint-500" size={40} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-red-500 mb-4">{error}</p>
                <button
                    onClick={() => dispatch(fetchCourses())}
                    className="px-4 py-2 bg-slate-100 rounded-lg hover:bg-slate-200"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-navy-900 dark:text-white mb-2">
                    Available Courses
                </h1>
                <p className="text-slate-500 dark:text-slate-400">
                    Master new skills with our curated video courses.
                </p>
            </header>

            {courses.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-navy-800 rounded-2xl border border-slate-200 dark:border-navy-700">
                    <p className="text-slate-500">No courses available yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => {
                        const enrolled = isEnrolled(course.id || course._id);
                        // Mock progress for now
                        const progress = 0;
                        const videoCount = course.videos?.length || 0;

                        return (
                            <div
                                key={course.id || course._id}
                                className="bg-white dark:bg-navy-800 rounded-2xl shadow-sm border border-slate-100 dark:border-navy-700 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full"
                            >
                                {/* Thumbnail */}
                                <div className="relative h-48 bg-slate-200 dark:bg-navy-700">
                                    <img
                                        src={course.thumbnail || '/placeholder.png'}
                                        alt={course.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                                        <button
                                            onClick={() => navigate(`/courses/${course.id || course._id}/learn`)}
                                            className="bg-mint-500 text-navy-900 px-6 py-2 rounded-full font-semibold flex items-center gap-2 transform hover:scale-105 transition-transform"
                                        >
                                            <PlayCircle size={20} />
                                            {enrolled ? 'Continue' : 'Start Learning'}
                                        </button>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 flex flex-col flex-1">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="px-3 py-1 bg-mint-50 dark:bg-mint-900/20 text-mint-600 dark:text-mint-400 text-xs font-semibold rounded-full uppercase">
                                            {course.category || 'General'}
                                        </span>
                                        {enrolled && (
                                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                                {progress}% Complete
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="text-xl font-bold text-navy-900 dark:text-white mb-2 line-clamp-2">
                                        {course.title}
                                    </h3>

                                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 line-clamp-3 flex-1">
                                        {course.description}
                                    </p>

                                    {/* Footer */}
                                    <div className="pt-4 border-t border-slate-100 dark:border-navy-700 space-y-3">
                                        <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                                            <div className="flex items-center gap-2">
                                                <BookOpen size={16} />
                                                <span>{videoCount} Videos</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock size={16} />
                                                <span>Self-paced</span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => navigate(`/courses/${course.id || course._id}/learn`)}
                                            className="w-full py-2.5 rounded-xl font-semibold transition-colors bg-slate-100 dark:bg-navy-700 text-navy-900 dark:text-white hover:bg-slate-200 dark:hover:bg-navy-600"
                                        >
                                            {enrolled ? 'Continue Learning' : 'Enroll Now'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Courses;
