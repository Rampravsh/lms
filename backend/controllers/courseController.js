const Course = require('../models/Course');
const Module = require('../models/Module');
const Lesson = require('../models/Lesson');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
exports.getAllCourses = asyncHandler(async (req, res, next) => {
    const courses = await Course.find({ isPublished: true })
        .populate('instructor', 'name avatar')
        .select('-modules -studentsEnrolled'); // Exclude heavy fields for list view

    res.status(200).json(new ApiResponse(200, courses, 'Courses fetched successfully'));
});

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
exports.getCourseById = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id)
        .populate('instructor', 'name avatar')
        .populate({
            path: 'modules',
            options: { sort: { order: 1 } },
            populate: {
                path: 'lessons',
                model: 'Lesson'
            }
        });

    if (!course) {
        throw new ApiError(404, 'Course not found');
    }

    // Transform for frontend: Flatten modules' lessons into a single 'videos' array
    // The frontend expects: { id, title, duration, ... } where id is the YouTube ID
    // We assume 'videoUrl' in Lesson model stores the YouTube ID.
    const courseObj = course.toObject();

    const videos = [];
    if (courseObj.modules) {
        courseObj.modules.forEach(module => {
            if (module.lessons) {
                module.lessons.forEach(lesson => {
                    videos.push({
                        id: lesson.videoUrl, // Assuming videoUrl stores the YouTube ID
                        _id: lesson._id,     // Keep internal ID just in case
                        title: lesson.title,
                        duration: lesson.duration ? `${lesson.duration} min` : '10 min', // Format if needed
                        isFree: lesson.isFree,
                        moduleTitle: module.title
                    });
                });
            }
        });
    }

    courseObj.videos = videos;
    // We can remove modules from response if frontend doesn't need the hierarchy
    // courseObj.modules = undefined; 

    res.status(200).json(new ApiResponse(200, courseObj, 'Course fetched successfully'));
});

// @desc    Create new course
// @route   POST /api/courses
// @access  Private (Instructor/Admin)
exports.createCourse = asyncHandler(async (req, res, next) => {
    req.body.instructor = req.user.id;

    // Basic Course Creation
    const course = await Course.create(req.body);

    // If modules/lessons are provided in the request (e.g. from a JSON import)
    // We would handle them here. For now, we assume the user creates the course shell first.

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

    // Make sure user is course owner
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

    // Make sure user is course owner
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
        throw new ApiError(403, 'Not authorized to delete this course');
    }

    await course.deleteOne();

    res.status(200).json(new ApiResponse(200, {}, 'Course deleted successfully'));
});

// @desc    Add Module to Course
// @route   POST /api/courses/:id/modules
// @access  Private (Instructor)
exports.addModule = asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id);
    if (!course) throw new ApiError(404, 'Course not found');

    const moduleDoc = await Module.create({
        ...req.body,
        course: course._id
    });

    course.modules.push(moduleDoc._id);
    await course.save();

    res.status(201).json(new ApiResponse(201, moduleDoc, 'Module added'));
});

// @desc    Add Lesson to Module
// @route   POST /api/modules/:moduleId/lessons
// @access  Private (Instructor)
exports.addLesson = asyncHandler(async (req, res) => {
    const moduleDoc = await Module.findById(req.params.moduleId);
    if (!moduleDoc) throw new ApiError(404, 'Module not found');

    const lesson = await Lesson.create({
        ...req.body,
        module: moduleDoc._id
    });

    moduleDoc.lessons.push(lesson._id);
    await moduleDoc.save();

    res.status(201).json(new ApiResponse(201, lesson, 'Lesson added'));
});
