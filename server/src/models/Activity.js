const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
    parentId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Generic ref
    type: { type: String, enum: ['Call', 'Email', 'Meeting', 'Other'], required: true },
    subject: { type: String, required: true },
    notes: { type: String },
    date: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Activity', ActivitySchema);
