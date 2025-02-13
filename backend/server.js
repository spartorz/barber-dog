require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const analyticsRouter = require('./routes/analytics');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend/public')));

// Analytics Middleware
app.use((req, res, next) => {
    // Basic analytics tracking
    const analytics = {
        timestamp: new Date(),
        path: req.path,
        method: req.method,
        userAgent: req.headers['user-agent']
    };
    
    // Save to database
    saveAnalytics(analytics);
    next();
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/services', require('./routes/services'));
app.use('/api/products', require('./routes/products'));
app.use('/api/analytics', analyticsRouter);

// Analytics model
const Analytics = require('./models/Analytics');

async function saveAnalytics(data) {
    try {
        await Analytics.create(data);
    } catch (error) {
        console.error('Analytics Error:', error);
    }
}

// Error handling should be last
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/public/index.html'));
    });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app; 