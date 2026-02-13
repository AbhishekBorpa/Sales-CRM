const mongoose = require('mongoose');

const assignmentRuleSchema = new mongoose.Schema({
    name: { type: String, required: true },
    priority: { type: Number, required: true }, // Lower runs first
    criteriaField: { type: String, required: true }, // e.g., 'city', 'industry', 'source'
    criteriaOperator: { type: String, enum: ['equals', 'contains', 'starts_with'], default: 'equals' },
    criteriaValue: { type: String, required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('AssignmentRule', assignmentRuleSchema);
