const mongoose = require('mongoose');

const OpportunitySchema = new mongoose.Schema({
    title: { type: String, required: true },
    stage: { type: String, default: 'Prospecting' },
    value: { type: Number, default: 0 },
    closeDate: { type: String }, // Using string for YYYY-MM-DD for simplicity
    accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
    probability: { type: Number, default: 10 },
    isDeleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Opportunity', OpportunitySchema);
