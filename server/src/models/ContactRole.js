const mongoose = require('mongoose');

const ContactRoleSchema = new mongoose.Schema({
    opportunityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Opportunity', required: true },
    contactId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact' }, // Optional if using free text name mock
    contactName: { type: String },
    role: { type: String },
    isPrimary: { type: Boolean, default: false }
});

module.exports = mongoose.model('ContactRole', ContactRoleSchema);
