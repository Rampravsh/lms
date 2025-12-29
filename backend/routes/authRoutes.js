const express = require('express');
const { register, verifyOTP, login, logout, resendOTP, getMe, getAllUsers, updateProfile, changePassword } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/verify-otp', verifyOTP);
router.post('/login', login);
router.post('/logout', logout);
router.post('/resend-otp', resendOTP);
router.get('/me', protect, getMe);
router.get('/users', protect, getAllUsers);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, changePassword);

module.exports = router;
