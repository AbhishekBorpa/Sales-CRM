const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    code: { type: String },
    price: { type: Number, required: true },
    description: { type: String },
    isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model('Product', ProductSchema);
