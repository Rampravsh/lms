const { register, verifyOTP, login, logout, resendOTP, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/verify-otp', verifyOTP);
router.post('/login', login);
router.post('/logout', logout);
router.post('/resend-otp', resendOTP);
router.get('/me', protect, getMe);

module.exports = router;
