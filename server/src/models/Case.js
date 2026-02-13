const mongoose = require('mongoose');

const CaseSchema = new mongoose.Schema({
    subject: { type: String, required: true },
    description: { type: String },
    status: {
        type: String,
        enum: ['New', 'Working', 'Escalated', 'Closed'],
        default: 'New'
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Critical'],
        default: 'Medium'
    },
    accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
    contactId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact' },
    createdAt: { type: Date, default: Date.now },
    closedAt: { type: Date }
});

module.exports = mongoose.model('Case', CaseSchema);
