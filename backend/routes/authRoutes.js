const express = require('express');
const { register, verifyOTP, login, logout } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/verify-otp', verifyOTP);
router.post('/login', login);
router.post('/logout', logout);

module.exports = router;
