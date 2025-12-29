import React, { createContext, useContext, useState, useEffect } from 'react';

const CourseContext = createContext();

export const useCourses = () => useContext(CourseContext);

export const CourseProvider = ({ children }) => {
    const [courses] = useState([]);

    // Progress state: { [courseId]: { [videoId]: true, ... } }
    const [progress, setProgress] = useState(() => {
        const saved = localStorage.getItem('courseProgress');
        return saved ? JSON.parse(saved) : {};
    });

    // Enrolled courses state: list of course IDs
    const [enrolledCourses, setEnrolledCourses] = useState(() => {
        const saved = localStorage.getItem('enrolledCourses');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('courseProgress', JSON.stringify(progress));
    }, [progress]);

    useEffect(() => {
        localStorage.setItem('enrolledCourses', JSON.stringify(enrolledCourses));
    }, [enrolledCourses]);

    const markVideoCompleted = (courseId, videoId) => {
        setProgress(prev => {
            const courseProgress = prev[courseId] || {};
            // Toggle or set to true. Assuming we just want to mark as completed.
            return {
                ...prev,
                [courseId]: {
                    ...courseProgress,
                    [videoId]: true
                }
            };
        });

        // Auto-enroll if not already enrolled
        if (!enrolledCourses.includes(courseId)) {
            setEnrolledCourses(prev => [...prev, courseId]);
        }
    };

    const getCourseProgress = (courseId) => {
        const course = courses.find(c => c.id === courseId);
        if (!course) return 0;

        const courseProgress = progress[courseId] || {};
        const completedCount = Object.keys(courseProgress).length;
        const totalVideos = course.videos.length;

        return totalVideos === 0 ? 0 : Math.round((completedCount / totalVideos) * 100);
    };

    const enrollInCourse = (courseId) => {
        if (!enrolledCourses.includes(courseId)) {
            setEnrolledCourses(prev => [...prev, courseId]);
        }
    };

    const value = {
        courses,
        progress,
        enrolledCourses,
        markVideoCompleted,
        getCourseProgress,
        enrollInCourse
    };

    return (
        <CourseContext.Provider value={value}>
            {children}
        </CourseContext.Provider>
    );
};
