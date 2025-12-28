const mongoose = require('mongoose');
const User = require('../models/User');
const OTP = require('../models/OTP');
const Course = require('../models/Course');
const Module = require('../models/Module');
const Lesson = require('../models/Lesson');
const Progress = require('../models/Progress');
require('dotenv').config();

// Use a local DB for testing if no URI provided
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/lms-test-db';

async function testModels() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        // Clear existing data
        await Promise.all([
            User.deleteMany({}),
            OTP.deleteMany({}),
            Course.deleteMany({}),
            Module.deleteMany({}),
            Lesson.deleteMany({}),
            Progress.deleteMany({})
        ]);
        console.log('Cleared existing data');

        // 1. Create User
        const user = await User.create({
            name: 'Test User',
            email: 'test@example.com',
            password: 'hashedpassword123',
            role: 'student',
            isVerified: true
        });
        console.log('User created:', user._id);

        // 2. Create OTP
        const otp = await OTP.create({
            email: 'test@example.com',
            otp: '123456'
        });
        console.log('OTP created:', otp._id);

        // 3. Create Course
        const course = await Course.create({
            title: 'Intro to Programming',
            description: 'Learn the basics',
            instructor: user._id,
            category: 'Development',
            level: 'beginner',
            language: 'English',
            isPublished: true
        });
        console.log('Course created:', course._id);

        // 4. Create Module
        const moduleDoc = await Module.create({
            title: 'Getting Started',
            course: course._id,
            order: 1
        });
        console.log('Module created:', moduleDoc._id);

        // 5. Create Lesson
        const lesson = await Lesson.create({
            title: 'Welcome',
            content: 'Welcome to the course',
            module: moduleDoc._id,
            type: 'text'
        });
        console.log('Lesson created:', lesson._id);

        // Link Lesson to Module
        moduleDoc.lessons.push(lesson._id);
        await moduleDoc.save();
        console.log('Lesson linked to Module');

        // Link Module to Course
        course.modules.push(moduleDoc._id);
        await course.save();
        console.log('Module linked to Course');

        // 6. Create Progress
        const progress = await Progress.create({
            user: user._id,
            course: course._id,
            completedLessons: [lesson._id],
            completionPercentage: 100
        });
        console.log('Progress created:', progress._id);

        console.log('All models verified successfully!');
    } catch (error) {
        console.error('Error verifying models:', error);
    } finally {
        await mongoose.connection.close();
        console.log('Connection closed');
    }
}

testModels();
