const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    image: String,
    category: String,
    stockQuantity: { type: Number, default: 0 }
});

module.exports = mongoose.model('Product', productSchema); 