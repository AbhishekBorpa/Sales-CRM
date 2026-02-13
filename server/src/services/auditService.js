const AuditLog = require('../models/AuditLog');

const logAction = async (entity, entityId, action, changedBy, details) => {
    try {
        await AuditLog.create({
            entity,
            entityId,
            action,
            changedBy: changedBy || 'System Admin', // Fallback for clone
            details
        });
    } catch (error) {
        console.error('Audit Log Failed:', error);
    }
};

module.exports = { logAction };
