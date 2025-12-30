const express = require('express');
const {
    getAllCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
    addVideo
} = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();



router.route('/')
    .get(getAllCourses)
    .post(protect, authorize('instructor', 'admin'), createCourse);

// Specific routes first
router.post('/:id/videos', protect, authorize('instructor', 'admin'), addVideo);

// Parameterized routes last
// Parameterized routes last
router.route('/:id')
    .get(getCourseById)
    .put(protect, authorize('instructor', 'admin'), updateCourse)
    .delete(protect, authorize('instructor', 'admin'), deleteCourse);

router.post('/:id/enroll', protect, authorize('student'), require('../controllers/courseController').enrollCourse);
router.post('/:id/videos/:videoId/complete', protect, authorize('student'), require('../controllers/courseController').markVideoCompleted);

module.exports = router;
