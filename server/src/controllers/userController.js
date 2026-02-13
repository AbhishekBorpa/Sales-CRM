const User = require('../models/User');

// Get current user profile (Mocked single user for now or ID based)
exports.getProfile = async (req, res) => {
    try {
        // For this clone, we might just fetch the first admin user or a specific one
        // In a real app this comes from req.user set by middleware
        const user = await User.findOne();
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const user = await User.findOneAndUpdate({}, req.body, { new: true, upsert: true }); // Upsert for robustness in clone
        res.json(user);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().sort({ name: 1 });
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
