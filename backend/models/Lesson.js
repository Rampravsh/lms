const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String, // Markdown or text content
        default: ''
    },
    videoUrl: {
        type: String,
        default: ''
    },
    duration: {
        type: Number, // in minutes
        default: 0
    },
    type: {
        type: String,
        enum: ['video', 'text', 'quiz'],
        default: 'video'
    },
    module: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Module',
        required: true
    },
    isFree: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Lesson', lessonSchema);
