const express = require('express');
const {
    getAllCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
    addModule,
    addLesson
} = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
    .get(getAllCourses)
    .post(protect, authorize('instructor', 'admin'), createCourse);

router.route('/:id')
    .get(getCourseById)
    .put(protect, authorize('instructor', 'admin'), updateCourse)
    .delete(protect, authorize('instructor', 'admin'), deleteCourse);

router.post('/:id/modules', protect, authorize('instructor', 'admin'), addModule);
router.post('/modules/:moduleId/lessons', protect, authorize('instructor', 'admin'), addLesson);

module.exports = router;
