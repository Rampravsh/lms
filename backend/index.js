const dotenv = require('dotenv');
const connectDB = require('./config/connectDB');
const app = require('./app');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const PORT = process.env.PORT || 5000;

const socketIo = require('socket.io');

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Initialize Socket.io
const io = socketIo(server, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:5174",
        methods: ["GET", "POST"]
    }
});

let onlineUsers = new Map(); // userId -> socketId

io.on('connection', (socket) => {
    console.log('New client connected', socket.id);

    // User joins with their ID
    socket.on('join', (userId) => {
        onlineUsers.set(userId, socket.id);
        // Broadcast online users list
        io.emit('onlineUsers', Array.from(onlineUsers.keys()));
        console.log(`User ${userId} is online`);
    });

    // Handle Send Message
    socket.on('sendMessage', ({ senderId, receiverId, content, timestamp }) => {
        const receiverSocketId = onlineUsers.get(receiverId);

        // If receiver is online, send immediately
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('receiveMessage', {
                senderId,
                content,
                timestamp
            });
        }
        // Note: No DB persistence as per requirement.
    });

    socket.on('disconnect', () => {
        // Find userId from socketId to remove
        let disconnectedUserId;
        for (let [userId, socketId] of onlineUsers.entries()) {
            if (socketId === socket.id) {
                disconnectedUserId = userId;
                break;
            }
        }

        if (disconnectedUserId) {
            onlineUsers.delete(disconnectedUserId);
            io.emit('onlineUsers', Array.from(onlineUsers.keys()));
            console.log(`User ${disconnectedUserId} disconnected`);
        }
    });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
});
