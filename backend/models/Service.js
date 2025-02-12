const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    duration: Number,
    image: String,
    category: String
});

module.exports = mongoose.model('Service', serviceSchema); 