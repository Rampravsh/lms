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

    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
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

    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
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

    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
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
