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

// Sanitize CLIENT_URL to ensure it has a protocol
let clientUrl = process.env.CLIENT_URL;
if (clientUrl && !clientUrl.startsWith('http')) {
    clientUrl = `https://${clientUrl}`;
}

app.use(cors({
    origin: clientUrl || 'http://localhost:5173',
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
