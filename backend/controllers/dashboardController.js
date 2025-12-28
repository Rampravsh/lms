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

    // 1. Enrolled Courses Count
    const enrolledCoursesCount = await Progress.countDocuments({ user: userId });

    // 2. Completed Courses Count (assuming 100% completion)
    const completedCoursesCount = await Progress.countDocuments({
        user: userId,
        completionPercentage: 100
    });

    // 3. Total Study Hours (This would ideally come from summing up duration of completed lessons)
    // For now, we'll estimate or sum if we had the data easily accessible. 
    // Let's aggregate from Progress -> Course -> Modules -> Lessons
    // This is complex without a direct "time spent" field. 
    // We'll return a placeholder or calculate based on completed lessons if possible.
    // Simplified: Count completed lessons * avg duration (or 0 for now)
    const progressDocs = await Progress.find({ user: userId }).populate({
        path: 'completedLessons',
        select: 'duration'
    });

    let totalMinutes = 0;
    progressDocs.forEach(p => {
        p.completedLessons.forEach(l => {
            totalMinutes += (l.duration || 0);
        });
    });
    const totalHours = (totalMinutes / 60).toFixed(1);

    // 4. Active Course (Most recently updated progress)
    const lastActiveProgress = await Progress.findOne({ user: userId })
        .sort({ updatedAt: -1 })
        .populate('course', 'title thumbnail');

    const activeCourse = lastActiveProgress ? lastActiveProgress.course : null;

    res.status(200).json(new ApiResponse(200, {
        enrolledCourses: enrolledCoursesCount,
        completedCourses: completedCoursesCount,
        totalHours,
        activeCourse,
        streak: 0 // Placeholder for streak logic
    }, 'Student dashboard data fetched'));
});

// @desc    Get Admin Dashboard Stats
// @route   GET /api/dashboard/admin
// @access  Private (Admin)
exports.getAdminDashboard = asyncHandler(async (req, res) => {
    const totalUsers = await User.countDocuments({ role: 'student' });
    const totalInstructors = await User.countDocuments({ role: 'instructor' });
    const totalCourses = await Course.countDocuments();
    const totalEnrollments = await Progress.countDocuments();

    res.status(200).json(new ApiResponse(200, {
        totalUsers,
        totalInstructors,
        totalCourses,
        totalEnrollments
    }, 'Admin dashboard data fetched'));
});
