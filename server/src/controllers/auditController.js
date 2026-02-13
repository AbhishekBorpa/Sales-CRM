const AuditLog = require('../models/AuditLog');

exports.getLogs = async (req, res) => {
    try {
        const { entityId, entity } = req.query;
        const query = {};
        if (entityId) query.entityId = entityId;
        if (entity) query.entity = entity;

        const logs = await AuditLog.find(query).sort({ timestamp: -1 }).limit(100);
        res.json(logs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
