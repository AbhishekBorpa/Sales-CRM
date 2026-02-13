const mongoose = require('mongoose');

const EmailTemplateSchema = new mongoose.Schema({
    name: { type: String, required: true },
    subject: { type: String, required: true },
    body: { type: String, required: true }, // HTML or plain text
    category: { type: String, enum: ['Prospecting', 'Follow-up', 'Thank You', 'Meeting', 'Closing', 'Other'], default: 'Other' },
    isActive: { type: Boolean, default: true },
    createdBy: { type: String, default: 'System Admin' },
    createdAt: { type: Date, default: Date.now },
    lastUsed: { type: Date }
});

module.exports = mongoose.model('EmailTemplate', EmailTemplateSchema);
