const express = require('express');
const router = express.Router();
const Analytics = require('../models/Analytics');
const auth = require('../middleware/auth');

// Get analytics data (protected route)
router.get('/', auth, async (req, res) => {
    try {
        const analytics = await Analytics.aggregate([
            {
                $group: {
                    _id: '$path',
                    pageViews: { $sum: '$pageViews' },
                    uniqueVisitors: { $addToSet: '$uniqueVisitors' },
                    avgDuration: { $avg: '$duration' }
                }
            }
        ]);
        
        res.json(analytics);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 