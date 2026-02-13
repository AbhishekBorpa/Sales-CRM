const mongoose = require('mongoose');

const QuoteSchema = new mongoose.Schema({
    name: { type: String, required: true },
    opportunityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Opportunity' },
    amount: { type: Number, default: 0 },
    status: { type: String, enum: ['Draft', 'Presented', 'Accepted', 'Rejected'], default: 'Draft' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Quote', QuoteSchema);
