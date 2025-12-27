import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Play, Lock, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCourses } from '../context/CourseContext';
import clsx from 'clsx';

const CoursePlayer = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { courses, progress, markVideoCompleted, enrollInCourse } = useCourses();

    // Find course
    const course = courses.find(c => c.id === courseId);

    // State for current video (default to first one)
    const [currentVideo, setCurrentVideo] = useState(null);

    // Initialize
    useEffect(() => {
        if (course) {
            // Auto enroll on visit
            enrollInCourse(course.id);
            // Default to first video if not set
            if (!currentVideo && course.videos.length > 0) {
                setCurrentVideo(course.videos[0]);
            }
        }
    }, [course, courseId]);

    if (!course) {
        return <div className="p-8 text-center text-slate-500">Course not found</div>;
    }

    if (!currentVideo) {
        return <div className="p-8 text-center text-slate-500">Loading player...</div>;
    }

    const isVideoCompleted = (videoId) => {
        return progress[courseId]?.[videoId] || false;
    };

    const handleVideoComplete = () => {
        markVideoCompleted(courseId, currentVideo.id);
    };

    const playVideo = (video) => {
        setCurrentVideo(video);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Calculate next video for auto-suggestion
    const currentIndex = course.videos.findIndex(v => v.id === currentVideo.id);
    const nextVideo = course.videos[currentIndex + 1];

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-6rem)]">
            {/* Main Content - Video Player */}
            <div className="flex-1 flex flex-col overflow-y-auto lg:overflow-visible">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/courses')}
                    className="mb-4 text-slate-500 hover:text-navy-900 dark:hover:text-white flex items-center gap-1 w-fit"
                >
                    <ChevronLeft size={20} />
                    Back to Courses
                </button>

                {/* Video Embed */}
                <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-lg mb-6 relative group">
                    <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${currentVideo.id}?autoplay=1&rel=0`}
                        title={currentVideo.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                    ></iframe>
                </div>

                {/* Video Info */}
                <div className="bg-white dark:bg-navy-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-navy-700">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div>
                            <h2 className="text-2xl font-bold text-navy-900 dark:text-white mb-2">
                                {currentVideo.title}
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400">
                                {course.instructor} • {course.title}
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleVideoComplete}
                                className={clsx(
                                    "px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-all",
                                    isVideoCompleted(currentVideo.id)
                                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                                        : "bg-mint-500 text-navy-900 hover:bg-mint-600"
                                )}
                            >
                                <CheckCircle size={20} />
                                {isVideoCompleted(currentVideo.id) ? 'Completed' : 'Mark as Completed'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sidebar - Playlist */}
            <div className="lg:w-96 flex flex-col bg-white dark:bg-navy-900 border-l border-slate-200 dark:border-navy-800 -mr-6 -my-6 lg:my-0 lg:mr-0 lg:rounded-2xl lg:border lg:shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 dark:border-navy-800 bg-slate-50 dark:bg-navy-900">
                    <h3 className="font-bold text-lg text-navy-900 dark:text-white">Course Content</h3>
                    <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        {Object.keys(progress[courseId] || {}).length} / {course.videos.length} completed
                    </div>
                    {/* Progress Bar */}
                    <div className="mt-3 h-2 w-full bg-slate-200 dark:bg-navy-700 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-mint-500 transition-all duration-500"
                            style={{ width: `${(Object.keys(progress[courseId] || {}).length / course.videos.length) * 100}%` }}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {course.videos.map((video, index) => {
                        const isActive = currentVideo.id === video.id;
                        const isCompleted = isVideoCompleted(video.id);

                        return (
                            <button
                                key={video.id}
                                onClick={() => playVideo(video)}
                                className={clsx(
                                    "w-full text-left p-3 rounded-xl flex items-center gap-3 transition-colors",
                                    isActive
                                        ? "bg-slate-100 dark:bg-navy-800 border border-slate-200 dark:border-navy-700"
                                        : "hover:bg-slate-50 dark:hover:bg-navy-800/50"
                                )}
                            >
                                <div className="relative flex-shrink-0">
                                    <div className={clsx(
                                        "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold",
                                        isCompleted
                                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                            : isActive
                                                ? "bg-mint-500 text-navy-900"
                                                : "bg-slate-200 dark:bg-navy-700 text-slate-600 dark:text-slate-400"
                                    )}>
                                        {isCompleted ? <CheckCircle size={14} /> : index + 1}
                                    </div>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h4 className={clsx(
                                        "text-sm font-medium truncate",
                                        isActive ? "text-navy-900 dark:text-white" : "text-slate-600 dark:text-slate-300"
                                    )}>
                                        {video.title}
                                    </h4>
                                    <span className="text-xs text-slate-400 dark:text-slate-500 block mt-0.5">
                                        {video.duration}
                                    </span>
                                </div>

                                {isActive && <Play size={16} className="text-mint-500" />}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default CoursePlayer;
