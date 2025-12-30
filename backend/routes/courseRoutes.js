const express = require('express');
const {
    getAllCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
    addVideo,
    getMyCourses
} = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();




router.get('/my-courses', protect, authorize('instructor', 'admin'), getMyCourses);

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
