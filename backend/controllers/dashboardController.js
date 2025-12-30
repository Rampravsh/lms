const Course = require('../models/Course');
const User = require('../models/User');
const Progress = require('../models/Progress');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get Student Dashboard Stats
// @route   GET /api/dashboard/student
// @access  Private (Student)
exports.getStudentDashboard = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    // --- Backfill Logic: Ensure all enrolled courses have a Progress record ---
    // Fetch user to get enrolledCourses list
    const user = await User.findById(userId);
    if (user && user.enrolledCourses && user.enrolledCourses.length > 0) {
        for (const courseId of user.enrolledCourses) {
            const exists = await Progress.exists({ user: userId, course: courseId });
            if (!exists) {
                // Fetch course to get video count
                const course = await Course.findById(courseId);
                if (course) {
                    await Progress.create({
                        user: userId,
                        course: courseId,
                        completedVideos: [],
                        totalLectures: course.videos.length,
                        lecturesCompleted: 0,
                        completionPercentage: 0,
                        timeSpent: 0,
                        lastAccessed: Date.now()
                    });
                }
            }
        }
    }
    // ------------------------------------------------------------------------

    // 1. Enrolled Courses Count
    const enrolledCoursesCount = await Progress.countDocuments({ user: userId });

    // 2. Completed Courses Count
    const completedCoursesCount = await Progress.countDocuments({
        user: userId,
        completionPercentage: 100
    });

    // 3. Total Study Hours
    try {
        const progressDocs = await Progress.find({ user: userId });
        const totalMinutes = progressDocs.reduce((acc, curr) => acc + (curr.timeSpent || 0), 0);
        var totalHours = (totalMinutes / 60).toFixed(1);
    } catch (error) {
        console.error("Error calculating total hours:", error);
        var totalHours = 0;
    }

    // 4. Active Course (Most recently accessed)
    const lastActiveProgress = await Progress.findOne({ user: userId })
        .sort({ lastAccessed: -1 })
        .populate('course', 'title thumbnail description');

    const activeCourse = lastActiveProgress ? lastActiveProgress.course : null;
    const activeProgress = lastActiveProgress ? lastActiveProgress.completionPercentage : 0;



    res.status(200).json(new ApiResponse(200, {
        enrolledCourses: enrolledCoursesCount,
        completedCourses: completedCoursesCount,
        totalHours,
        activeCourse,
        activeProgress,
        streak: 0 // Placeholder
    }, 'Student dashboard data fetched'));
});

// @desc    Get Admin Dashboard Stats
// @route   GET /api/dashboard/admin
// @access  Private (Admin)
exports.getAdminDashboard = asyncHandler(async (req, res) => {
    // 1. Total Global Users (Platform-wide)
    const totalUsers = await User.countDocuments({ role: 'student' });

    // 2. Total Instructors (Platform-wide) - keeping this
    const totalInstructors = await User.countDocuments({ role: 'instructor' });

    // 3. YOUR Total Courses (Scoped)
    const totalCourses = await Course.countDocuments({ instructor: req.user._id });

    // 4. YOUR Total Enrollments (Scoped)
    // Find all course IDs owned by this user
    const myCourseIds = await Course.find({ instructor: req.user._id }).distinct('_id');

    // Count Progress docs where course is in myCourseIds
    const totalEnrollments = await Progress.countDocuments({ course: { $in: myCourseIds } });

    res.status(200).json(new ApiResponse(200, {
        totalUsers,
        totalInstructors,
        totalCourses,
        totalEnrollments
    }, 'Admin dashboard data fetched'));
});
