const AssignmentRule = require('../models/AssignmentRule');
const Lead = require('../models/Lead');

exports.getRules = async (req, res) => {
    try {
        const rules = await AssignmentRule.find().populate('assignedTo', 'name email').sort({ priority: 1 });
        res.json(rules);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createRule = async (req, res) => {
    try {
        const rule = new AssignmentRule(req.body);
        const savedRule = await rule.save();
        res.status(201).json(savedRule);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.updateRule = async (req, res) => {
    try {
        const updatedRule = await AssignmentRule.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedRule);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteRule = async (req, res) => {
    try {
        await AssignmentRule.findByIdAndDelete(req.params.id);
        res.json({ message: 'Rule deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Helper function to process rules for a lead
exports.processAssignmentRules = async (leadData) => {
    const rules = await AssignmentRule.find({ isActive: true }).sort({ priority: 1 });

    for (const rule of rules) {
        const fieldVal = leadData[rule.criteriaField]?.toString().toLowerCase() || '';
        const matchVal = rule.criteriaValue.toLowerCase();

        let match = false;
        if (rule.criteriaOperator === 'equals' && fieldVal === matchVal) match = true;
        if (rule.criteriaOperator === 'contains' && fieldVal.includes(matchVal)) match = true;
        if (rule.criteriaOperator === 'starts_with' && fieldVal.startsWith(matchVal)) match = true;

        if (match) {
            return rule.assignedTo;
        }
    }
    return null; // No match
};
