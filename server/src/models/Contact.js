const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
    email: { type: String },
    phone: { type: String },
    title: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Contact', ContactSchema);
