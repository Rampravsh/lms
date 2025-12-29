import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourseById } from '../store/slices/courseSlice';
import { CheckCircle, Play, Lock, ExternalLink, ChevronLeft, ChevronRight, Loader } from 'lucide-react';
import clsx from 'clsx';

const CoursePlayer = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { currentCourse: course, isLoading, error } = useSelector((state) => state.courses);

    // State for current video (default to first one)
    const [currentVideo, setCurrentVideo] = useState(null);
    const [completedVideos, setCompletedVideos] = useState({}); // Local state for now

    useEffect(() => {
        if (courseId) {
            dispatch(fetchCourseById(courseId));
        }
    }, [dispatch, courseId]);

    // Initialize/Reset when course changes
    useEffect(() => {
        if (course && course.videos && course.videos.length > 0) {
            if (!currentVideo) {
                setCurrentVideo(course.videos[0]);
            }
        }
    }, [course]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader className="animate-spin text-mint-500" size={40} />
            </div>
        );
    }

    if (error || !course) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-6rem)]">
                <p className="text-slate-500 mb-4">{error || 'Course not found'}</p>
                <button
                    onClick={() => navigate('/courses')}
                    className="text-mint-600 hover:underline"
                >
                    Back to Courses
                </button>
            </div>
        );
    }

    if (!currentVideo) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-6rem)]">
                <p className="text-slate-500">No content available for this course.</p>
                <button
                    onClick={() => navigate('/courses')}
                    className="text-mint-600 hover:underline mt-4"
                >
                    Back to Courses
                </button>
            </div>
        );
    }

    // Helper to extract proper video ID from URL if using YouTube
    const getVideoId = (url) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const videoId = getVideoId(currentVideo.videoUrl);
    const videoSrc = videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0` : currentVideo.videoUrl;

    const isVideoCompleted = (id) => {
        return completedVideos[id] || false;
    };

    const handleVideoComplete = () => {
        setCompletedVideos(prev => ({ ...prev, [currentVideo._id]: true }));
        // Dispatch action to backend to save progress here
    };

    const playVideo = (video) => {
        setCurrentVideo(video);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

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
                    {videoId ? (
                        <iframe
                            width="100%"
                            height="100%"
                            src={videoSrc}
                            title={currentVideo.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full"
                        ></iframe>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-white">
                            <p>Video unavailable or invalid URL</p>
                        </div>
                    )}
                </div>

                {/* Video Info */}
                <div className="bg-white dark:bg-navy-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-navy-700">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div>
                            <h2 className="text-2xl font-bold text-navy-900 dark:text-white mb-2">
                                {currentVideo.title}
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400">
                                {course.instructor?.name || 'Instructor'} • {course.title}
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleVideoComplete}
                                className={clsx(
                                    "px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-all",
                                    isVideoCompleted(currentVideo._id)
                                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                                        : "bg-mint-500 text-navy-900 hover:bg-mint-600"
                                )}
                            >
                                <CheckCircle size={20} />
                                {isVideoCompleted(currentVideo._id) ? 'Completed' : 'Mark as Completed'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sidebar - Playlist */}
            <div className="lg:w-96 flex flex-col bg-white dark:bg-navy-900 border-l border-slate-200 dark:border-navy-800 -mr-6 -my-6 lg:my-0 lg:mr-0 lg:rounded-2xl lg:border lg:shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 dark:border-navy-800 bg-slate-50 dark:bg-navy-900">
                    <h3 className="font-bold text-lg text-navy-900 dark:text-white">Course Content</h3>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                    {course.videos?.map((video, index) => {
                        const isActive = currentVideo?._id === video._id;
                        const isCompleted = isVideoCompleted(video._id);

                        return (
                            <button
                                key={video._id}
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
                                        {video.duration} min
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
