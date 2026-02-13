const Workflow = require('../models/Workflow');
const Lead = require('../models/Lead');

exports.getWorkflows = async (req, res) => {
    try {
        const workflows = await Workflow.find().sort({ createdAt: -1 });
        res.json(workflows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createWorkflow = async (req, res) => {
    try {
        const workflow = new Workflow(req.body);
        const savedWorkflow = await workflow.save();
        res.status(201).json(savedWorkflow);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.updateWorkflow = async (req, res) => {
    try {
        const workflow = await Workflow.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(workflow);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteWorkflow = async (req, res) => {
    try {
        await Workflow.findByIdAndDelete(req.params.id);
        res.json({ message: 'Workflow deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Execute workflow for a given entity
exports.triggerWorkflow = async (entity, entityId, triggerType, changes = {}) => {
    try {
        const workflows = await Workflow.find({
            entity: entity.constructor.modelName,
            triggerType,
            isActive: true
        });

        for (const workflow of workflows) {
            // Check if conditions match
            if (workflow.triggerConditions) {
                const conditionsMet = evaluateConditions(entity, workflow.triggerConditions, changes);
                if (!conditionsMet) continue;
            }

            // Execute actions
            for (const action of workflow.actions) {
                await executeAction(action, entity);
            }

            // Update execution stats
            workflow.executionCount++;
            workflow.lastExecuted = new Date();
            await workflow.save();
        }
    } catch (error) {
        console.error('Workflow execution error:', error);
    }
};

function evaluateConditions(entity, conditions, changes) {
    if (conditions.field && conditions.value) {
        return entity[conditions.field] === conditions.value;
    }
    return true; // No conditions = always execute
}

async function executeAction(action, entity) {
    const Task = require('../models/Task');

    switch (action.type) {
        case 'createTask':
            const task = new Task({
                title: action.config.title || `Follow up on ${entity.name || entity.title}`,
                description: action.config.description || '',
                status: 'Open',
                priority: action.config.priority || 'Medium',
                dueDate: action.config.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            });
            await task.save();
            console.log('Task created:', task.title);
            break;

        case 'updateField':
            if (action.config.field && action.config.value !== undefined) {
                entity[action.config.field] = action.config.value;
                await entity.save();
                console.log('Field updated:', action.config.field, '=', action.config.value);
            }
            break;

        case 'sendEmail':
            console.log('Email would be sent:', action.config.templateId || 'default template');
            // TODO: Integrate with email service
            break;

        case 'assignTo':
            if (action.config.userId) {
                entity.assignedTo = action.config.userId;
                await entity.save();
                console.log('Assigned to:', action.config.userId);
            }
            break;

        case 'sendNotification':
            console.log('Notification:', action.config.message);
            break;

        default:
            console.log('Unknown action type:', action.type);
    }
}

module.exports.triggerWorkflow = exports.triggerWorkflow;
