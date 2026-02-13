const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    dueDate: { type: String },
    priority: { type: String, enum: ['Normal', 'High', 'Low'], default: 'Normal' },
    status: { type: String, enum: ['Open', 'Completed'], default: 'Open' },
    relatedTo: { type: String }, // Can be flexible or ref
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', TaskSchema);
