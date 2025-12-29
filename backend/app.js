const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/errorMiddleware');

// Route files
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173', // Adjust as needed
    credentials: true
}));

// Mount routers
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Error Handler
app.use(errorHandler);

module.exports = app;
