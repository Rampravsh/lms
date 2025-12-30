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
    // 1. Total Students Enrolled in MY courses (Unique count)
    const myCourseIds = await Course.find({ instructor: req.user._id }).distinct('_id');
    const totalEnrollments = await Progress.countDocuments({ course: { $in: myCourseIds } });

    // Get unique student count
    const uniqueStudents = await Progress.find({ course: { $in: myCourseIds } }).distinct('user');
    const totalStudents = uniqueStudents.length;

    // 2. Active Courses (Courses with at least 1 student)
    const activeCoursesCount = await Progress.distinct('course', { course: { $in: myCourseIds } });
    const totalCourses = activeCoursesCount.length;

    // 3. Average Completion Rate (Across all my students)
    const allProgress = await Progress.find({ course: { $in: myCourseIds } }).select('completionPercentage');
    const totalCompletion = allProgress.reduce((acc, curr) => acc + (curr.completionPercentage || 0), 0);
    const avgCompletionRate = allProgress.length > 0 ? Math.round(totalCompletion / allProgress.length) : 0;

    // --- Analytics Charts Data ---

    // 4. New Enrollments Growth (Last 6 Months - Scoped to MY courses)
    const enrollmentGrowth = await Progress.aggregate([
        {
            $match: {
                course: { $in: myCourseIds }
            }
        },
        {
            $group: {
                _id: { $month: "$createdAt" },
                count: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formattedGrowth = enrollmentGrowth.map(item => ({
        subject: monthNames[item._id - 1],
        avg: item.count
    }));

    // 5. Course Popularity (Top 5 Courses by Enrollment)
    const coursePopularity = await Progress.aggregate([
        { $match: { course: { $in: myCourseIds } } },
        { $group: { _id: "$course", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
        {
            $lookup: {
                from: "courses",
                localField: "_id",
                foreignField: "_id",
                as: "courseInfo"
            }
        },
        { $unwind: "$courseInfo" },
        {
            $project: {
                subject: "$courseInfo.title",
                avg: "$count" // Reusing 'avg' for bar chart compatibility
            }
        }
    ]);

    // 6. At-Risk Students (< 40% progress)
    const atRiskDocs = await Progress.find({
        course: { $in: myCourseIds },
        completionPercentage: { $lt: 40 }
    })
        .populate('user', 'name lastSeen')
        .sort({ completionPercentage: 1 })
        .limit(5);

    const atRiskStudents = atRiskDocs.map(doc => ({
        id: doc.user._id,
        name: doc.user.name,
        risk: doc.completionPercentage === 0 ? 'Not Started' : 'Low Progress',
        lastActive: doc.user.lastSeen ? new Date(doc.user.lastSeen).toLocaleDateString() : 'Never',
        progress: doc.completionPercentage
    }));

    res.status(200).json(new ApiResponse(200, {
        totalStudents,
        totalCourses, // Actually "Active Courses"
        totalEnrollments,
        avgCompletionRate,
        enrollmentGrowth: formattedGrowth,
        coursePopularity,
        atRiskStudents
    }, 'Instructor dashboard data fetched'));
});
