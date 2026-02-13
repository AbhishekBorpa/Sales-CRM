const Activity = require('../models/Activity');

exports.getActivities = async (req, res) => {
    try {
        const activities = await Activity.find({ parentId: req.query.parentId }).sort({ createdAt: -1 });
        res.json(activities);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createActivity = async (req, res) => {
    try {
        const activity = new Activity(req.body);
        const saved = await activity.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
