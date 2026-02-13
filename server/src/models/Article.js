const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, enum: ['General', 'Technical', 'Billing', 'Product'], default: 'General' },
    isPublished: { type: Boolean, default: true },
    viewCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Article', ArticleSchema);
