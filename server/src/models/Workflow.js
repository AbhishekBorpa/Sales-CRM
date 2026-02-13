const mongoose = require('mongoose');

const WorkflowSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    entity: { type: String, enum: ['Lead', 'Opportunity', 'Account', 'Case'], required: true },
    triggerType: {
        type: String,
        enum: ['onCreate', 'onUpdate', 'onDelete', 'onStatusChange', 'onFieldChange'],
        required: true
    },
    triggerConditions: { type: Object }, // e.g., { field: 'status', value: 'Qualified' }
    actions: [{
        type: { type: String, enum: ['sendEmail', 'createTask', 'updateField', 'assignTo', 'sendNotification'], required: true },
        config: { type: Object } // Action-specific configuration
    }],
    isActive: { type: Boolean, default: true },
    createdBy: { type: String, default: 'System Admin' },
    createdAt: { type: Date, default: Date.now },
    executionCount: { type: Number, default: 0 },
    lastExecuted: { type: Date }
});

module.exports = mongoose.model('Workflow', WorkflowSchema);
