const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema({
    name: { type: String, required: true },
    company: { type: String, required: true },
    status: { type: String, default: 'New', enum: ['New', 'Contacted', 'Qualified', 'Converted', 'Unqualified'] },
    value: { type: Number, default: 0 },
    email: { type: String },
    phone: { type: String },
    title: { type: String },
    industry: { type: String, enum: ['Technology', 'Finance', 'Healthcare', 'Retail', 'Other'], default: 'Other' },
    source: { type: String, enum: ['Website', 'Referral', 'Cold Call', 'Event', 'Other'], default: 'Other' },
    annualRevenue: { type: Number, default: 0 },
    score: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Lead', LeadSchema);
