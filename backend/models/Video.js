const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    videoUrl: {
        type: String,
        required: true
    },
    duration: {
        type: Number, // in minutes
        default: 0
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    isFree: {
        type: Boolean,
        default: false
    },
    order: {
        type: Number
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Video', videoSchema);
