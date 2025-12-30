const User = require('../models/User');
const OTP = require('../models/OTP');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const sendEmail = require('../utils/sendEmail');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        throw new ApiError(400, 'User already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role,
        isVerified: false // Force verification
    });

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await OTP.create({
        email,
        otp
    });

    // Send OTP Email
    try {
        await sendEmail({
            email: user.email,
            subject: 'LMS Account Verification OTP',
            message: `Your OTP for account verification is: ${otp}. It expires in 5 minutes.`
        });
    } catch (error) {
        console.error("Email send error (proceeding anyway):", error);
        // Fallback: If email fails (e.g. Render blocking SMTP), auto-verify user so they can login
        user.isVerified = true;
        await user.save();

        // Generate Token & Auto-Login
        const token = generateToken(user._id);
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        });

        return res.status(200).json(
            new ApiResponse(200, {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token
            }, 'User registered and logged in (Email failed).')
        );
    }

    res.status(201).json(
        new ApiResponse(201, { userId: user._id }, 'User registered. Please verify your email.')
    );
});

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
exports.verifyOTP = asyncHandler(async (req, res, next) => {
    const { email, otp } = req.body;

    const otpRecord = await OTP.findOne({ email, otp });

    if (!otpRecord) {
        throw new ApiError(400, 'Invalid or expired OTP');
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    user.isVerified = true;
    await user.save();

    // Delete OTP after usage
    await OTP.deleteOne({ _id: otpRecord._id });

    // Generate Token
    const token = generateToken(user._id);

    // Set cookie
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    res.status(200).json(
        new ApiResponse(200, {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token
        }, 'Email verified successfully')
    );
});

// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
// @access  Public
exports.resendOTP = asyncHandler(async (req, res, next) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    if (user.isVerified) {
        throw new ApiError(400, 'User is already verified');
    }

    // Check if an OTP already exists to prevent spamming (optional, but good practice)
    // For now, we'll just overwrite/create new one.
    // Ideally, we should check if one was sent recently. 
    // Since we have TTL, we can just create a new one.

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Delete existing OTP if any (to avoid multiple valid OTPs)
    await OTP.deleteOne({ email });

    await OTP.create({
        email,
        otp
    });

    // Send OTP Email
    try {
        await sendEmail({
            email: user.email,
            subject: 'LMS Account Verification OTP (Resend)',
            message: `Your new OTP for account verification is: ${otp}. It expires in 10 minutes.`
        });
    } catch (error) {
        throw new ApiError(500, 'Email could not be sent. Please try again.');
    }

    res.status(200).json(new ApiResponse(200, {}, 'OTP resent successfully'));
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password, role } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(401, 'Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new ApiError(401, 'Invalid credentials');
    }

    // Check Role
    if (role && user.role !== role) {
        throw new ApiError(401, `Access denied: You are not authorized as a ${role}`);
    }

    if (!user.isVerified) {
        throw new ApiError(401, 'Please verify your email first');
    }

    // Generate Token
    const token = generateToken(user._id);

    // Set cookie
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    // Update session expiry if needed (optional based on schema)
    user.sessionExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await user.save();

    res.status(200).json(
        new ApiResponse(200, {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token
        }, 'Logged in successfully')
    );
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Public
exports.logout = asyncHandler(async (req, res, next) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0)
    });

    res.status(200).json(new ApiResponse(200, {}, 'Logged out successfully'));
});
// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json(
        new ApiResponse(200, {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            bio: user.bio,
            notifications: user.notifications
        }, 'User details fetched successfully')
    );
});

// @desc    Get all users (for chat contacts)
// @route   GET /api/auth/users
// @access  Private
exports.getAllUsers = asyncHandler(async (req, res, next) => {
    // Fetch all users except the current one
    const users = await User.find({ _id: { $ne: req.user.id } }).select('-password');

    res.status(200).json(
        new ApiResponse(200, users, 'Users fetched successfully')
    );
});
// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    user.name = req.body.name || user.name;
    user.bio = req.body.bio || user.bio;
    user.avatar = req.body.avatar || user.avatar;

    if (req.body.notifications) {
        user.notifications = { ...user.notifications, ...req.body.notifications };
    }

    // Email update could require re-verification, let's keep it simple for now or disallow
    // if (req.body.email && req.body.email !== user.email) { ... }

    await user.save();

    res.status(200).json(
        new ApiResponse(200, {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            bio: user.bio,
            notifications: user.notifications
        }, 'Profile updated successfully')
    );
});

// @desc    Change password
// @route   PUT /api/auth/password
// @access  Private
exports.changePassword = asyncHandler(async (req, res, next) => {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
        throw new ApiError(400, 'Invalid current password');
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.status(200).json(new ApiResponse(200, {}, 'Password changed successfully'));
});
