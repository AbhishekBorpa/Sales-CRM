const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
    entity: { type: String, required: true }, // e.g., 'Lead', 'Opportunity'
    entityId: { type: mongoose.Schema.Types.ObjectId, required: true },
    action: { type: String, required: true }, // 'Active', 'Update', 'Delete', 'Convert'
    changedBy: { type: String, default: 'System' }, // User name or ID
    timestamp: { type: Date, default: Date.now },
    details: { type: String } // e.g., "Changed Status from New to Contacted"
});

module.exports = mongoose.model('AuditLog', AuditLogSchema);
