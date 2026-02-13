const Case = require('../models/Case');

exports.getCases = async (req, res) => {
    try {
        const filters = {};
        if (req.query.status) filters.status = req.query.status;
        if (req.query.accountId) filters.accountId = req.query.accountId;

        const cases = await Case.find(filters)
            .populate('accountId', 'name')
            .populate('contactId', 'name')
            .sort({ createdAt: -1 });
        res.json(cases);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createCase = async (req, res) => {
    try {
        const newCase = new Case(req.body);
        const savedCase = await newCase.save();
        res.status(201).json(savedCase);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.updateCase = async (req, res) => {
    try {
        const updatedCase = await Case.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedCase);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteCase = async (req, res) => {
    try {
        await Case.findByIdAndDelete(req.params.id);
        res.json({ message: 'Case deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
