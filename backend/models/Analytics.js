const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
    timestamp: {
        type: Date,
        default: Date.now
    },
    path: String,
    method: String,
    userAgent: String,
    pageViews: {
        type: Number,
        default: 1
    },
    uniqueVisitors: String,
    duration: Number
});

module.exports = mongoose.model('Analytics', analyticsSchema); 