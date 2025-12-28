const express = require('express');
const { register, verifyOTP, login, logout, resendOTP } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/verify-otp', verifyOTP);
router.post('/login', login);
router.post('/logout', logout);
router.post('/resend-otp', resendOTP);

module.exports = router;
