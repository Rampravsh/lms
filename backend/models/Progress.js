const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    completedVideos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video'
    }],
    lecturesCompleted: {
        type: Number,
        default: 0
    },
    totalLectures: {
        type: Number,
        default: 0
    },
    timeSpent: {
        type: Number, // in minutes
        default: 0
    },
    lastAccessed: {
        type: Date,
        default: Date.now
    },
    completionPercentage: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Progress', progressSchema);
