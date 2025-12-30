const Course = require('../models/Course');
const Video = require('../models/Video');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
exports.getAllCourses = asyncHandler(async (req, res, next) => {
    const courses = await Course.find({ isPublished: true })
        .populate('instructor', 'name avatar')
        .select('-studentsEnrolled'); // Exclude heavy fields for list view

    res.status(200).json(new ApiResponse(200, courses, 'Courses fetched successfully'));
});

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
exports.getCourseById = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id)
        .populate('instructor', 'name avatar')
        .populate({
            path: 'videos',
            options: { sort: { order: 1 } }
        });

    if (!course) {
        throw new ApiError(404, 'Course not found');
    }

    res.status(200).json(new ApiResponse(200, course, 'Course fetched successfully'));
});

// @desc    Get logged in user's courses
// @route   GET /api/courses/my-courses
// @access  Private (Instructor/Admin)
exports.getMyCourses = asyncHandler(async (req, res, next) => {
    const courses = await Course.find({ instructor: req.user.id })
        .populate('instructor', 'name avatar')
        .sort({ createdAt: -1 });

    res.status(200).json(new ApiResponse(200, courses, 'My courses fetched successfully'));
});

// @desc    Create new course
// @route   POST /api/courses
// @access  Private (Instructor/Admin)
exports.createCourse = asyncHandler(async (req, res, next) => {
    req.body.instructor = req.user.id;
    const course = await Course.create(req.body);
    res.status(201).json(new ApiResponse(201, course, 'Course created successfully'));
});

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private (Instructor/Admin)
exports.updateCourse = asyncHandler(async (req, res, next) => {
    let course = await Course.findById(req.params.id);

    if (!course) {
        throw new ApiError(404, 'Course not found');
    }

    if (course.instructor.toString() !== req.user.id) {
        throw new ApiError(403, 'Not authorized to update this course');
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json(new ApiResponse(200, course, 'Course updated successfully'));
});

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private (Instructor/Admin)
exports.deleteCourse = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id);

    if (!course) {
        throw new ApiError(404, 'Course not found');
    }

    if (course.instructor.toString() !== req.user.id) {
        throw new ApiError(403, 'Not authorized to delete this course');
    }

    await course.deleteOne();
    // Use Video model here, assuming it's imported as Video
    await Video.deleteMany({ course: req.params.id });

    res.status(200).json(new ApiResponse(200, {}, 'Course deleted successfully'));
});

// @desc    Add Video to Course
// @route   POST /api/courses/:id/videos
// @access  Private (Instructor/Admin)
exports.addVideo = asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id);
    if (!course) throw new ApiError(404, 'Course not found');

    if (course.instructor.toString() !== req.user.id) {
        throw new ApiError(403, 'Not authorized to add videos to this course');
    }

    const video = await Video.create({
        ...req.body,
        course: course._id
    });

    course.videos.push(video._id);
    await course.save();

    res.status(201).json(new ApiResponse(201, video, 'Video added successfully'));
});

// @desc    Enroll in a course
// @route   POST /api/courses/:id/enroll
// @access  Private (Student)
exports.enrollCourse = asyncHandler(async (req, res) => {
    const courseId = req.params.id;
    const userId = req.user._id;

    // 1. Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
        throw new ApiError(404, 'Course not found');
    }

    // 2. Check if already enrolled
    const user = await require('../models/User').findById(userId); // Validating user exists/refreshing
    if (user.enrolledCourses.includes(courseId)) {
        return res.status(400).json(new ApiResponse(400, null, 'Already enrolled'));
    }

    // 3. Enroll User
    // Add to User's enrolledCourses
    user.enrolledCourses.push(courseId);
    await user.save();

    // Add to Course's studentsEnrolled
    if (!course.studentsEnrolled.includes(userId)) {
        course.studentsEnrolled.push(userId);
        await course.save();
    }

    // 4. Create Initial Progress Record
    const Progress = require('../models/Progress');
    const existingProgress = await Progress.findOne({ user: userId, course: courseId });
    if (!existingProgress) {
        await Progress.create({
            user: userId,
            course: courseId,
            completedVideos: [],
            totalLectures: course.videos.length, // Capture total at enrollment
            lecturesCompleted: 0,
            completionPercentage: 0,
            timeSpent: 0,
            lastAccessed: Date.now()
        });
    }

    res.status(200).json(new ApiResponse(200, {}, 'Enrolled successfully'));
});

// @desc    Mark video as completed (Update Progress)
// @route   POST /api/courses/:id/videos/:videoId/complete
// @access  Private (Student)
exports.markVideoCompleted = asyncHandler(async (req, res) => {
    const { id: courseId, videoId } = req.params;
    const userId = req.user._id;

    // 1. Get Video to know duration
    const video = await Video.findById(videoId);
    if (!video) throw new ApiError(404, 'Video not found');

    // 2. Find Progress
    const Progress = require('../models/Progress');
    let progress = await Progress.findOne({ user: userId, course: courseId });

    if (!progress) {
        // Should exist if enrolled, but fail-safe create
        // We need totalLectures too
        const course = await Course.findById(courseId);
        progress = await Progress.create({
            user: userId,
            course: courseId,
            completedVideos: [],
            totalLectures: course ? course.videos.length : 0,
            lecturesCompleted: 0,
            timeSpent: 0
        });
    }

    // 3. Update Progress if not already completed
    if (!progress.completedVideos.includes(videoId)) {
        progress.completedVideos.push(videoId);
        progress.lecturesCompleted = progress.completedVideos.length;
        progress.timeSpent += (video.duration || 0);

        // Calculate Percentage
        // If totalLectures is 0 (legacy data), try to update it using course
        if (progress.totalLectures === 0) {
            const course = await Course.findById(courseId);
            if (course) progress.totalLectures = course.videos.length;
        }

        if (progress.totalLectures > 0) {
            progress.completionPercentage = Math.round((progress.lecturesCompleted / progress.totalLectures) * 100);
        } else {
            progress.completionPercentage = 0;
        }
    }

    // Always update lastAccessed
    progress.lastAccessed = Date.now();
    await progress.save();

    res.status(200).json(new ApiResponse(200, progress, 'Progress updated'));
});
