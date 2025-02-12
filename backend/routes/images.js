const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');
const auth = require('../middleware/auth');

// Upload image (protected route)
router.post('/upload', auth, imageController.uploadImage);

// Delete image (protected route)
router.delete('/:filename', auth, imageController.deleteImage);

module.exports = router; 