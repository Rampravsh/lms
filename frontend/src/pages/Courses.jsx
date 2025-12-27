import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayCircle, Clock, BookOpen, ExternalLink } from 'lucide-react';
import { useCourses } from '../context/CourseContext';

const Courses = () => {
    const { courses, enrolledCourses, getCourseProgress } = useCourses();
    const navigate = useNavigate();

    return (
        <div className="space-y-6">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-navy-900 dark:text-white mb-2">
                    Available Courses
                </h1>
                <p className="text-slate-500 dark:text-slate-400">
                    Master new skills with our curated video courses from CTO Bhaiya.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => {
                    const isEnrolled = enrolledCourses.includes(course.id);
                    const progress = getCourseProgress(course.id);

                    return (
                        <div
                            key={course.id}
                            className="bg-white dark:bg-navy-800 rounded-2xl shadow-sm border border-slate-100 dark:border-navy-700 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full"
                        >
                            {/* Thumbnail */}
                            <div className="relative h-48 bg-slate-200 dark:bg-navy-700">
                                <img
                                    src={course.thumbnail}
                                    alt={course.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                                    <button
                                        onClick={() => navigate(`/courses/${course.id}/learn`)}
                                        className="bg-mint-500 text-navy-900 px-6 py-2 rounded-full font-semibold flex items-center gap-2 transform hover:scale-105 transition-transform"
                                    >
                                        <PlayCircle size={20} />
                                        {isEnrolled ? 'Continue' : 'Start Learning'}
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 flex flex-col flex-1">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="px-3 py-1 bg-mint-50 dark:bg-mint-900/20 text-mint-600 dark:text-mint-400 text-xs font-semibold rounded-full">
                                        {course.category}
                                    </span>
                                    {isEnrolled && (
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
                                            <span>{course.videos.length} Videos</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock size={16} />
                                            <span>~{course.videos.reduce((acc, curr) => {
                                                const [h, m] = curr.duration.split(':').length === 3
                                                    ? curr.duration.split(':').map(Number)
                                                    : [0, ...curr.duration.split(':').map(Number)];
                                                // Simplified estimation
                                                return acc; // Just showing logic placeholder, not calculating exact sum for UI simplicity
                                            }, 'Variable')}</span>
                                            <span>Self-paced</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => navigate(`/courses/${course.id}/learn`)}
                                        className="w-full py-2.5 rounded-xl font-semibold transition-colors bg-slate-100 dark:bg-navy-700 text-navy-900 dark:text-white hover:bg-slate-200 dark:hover:bg-navy-600"
                                    >
                                        {isEnrolled ? 'Continue Learning' : 'Enroll Now'}
                                    </button>

                                    <a
                                        href={course.channelLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block text-center text-xs text-mint-600 dark:text-mint-400 hover:underline flex items-center justify-center gap-1"
                                    >
                                        Visit Channel <ExternalLink size={12} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Courses;
