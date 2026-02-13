const Lead = require('../models/Lead');
const Opportunity = require('../models/Opportunity');
const Account = require('../models/Account');

exports.getDeletedItems = async (req, res) => {
    try {
        const deletedLeads = await Lead.find({ isDeleted: true }).lean();
        const deletedOpps = await Opportunity.find({ isDeleted: true }).lean();
        const deletedAccounts = await Account.find({ isDeleted: true }).lean();

        // Tag them for front-end identification
        const items = [
            ...deletedLeads.map(l => ({ ...l, type: 'Lead' })),
            ...deletedOpps.map(o => ({ ...o, type: 'Opportunity' })),
            ...deletedAccounts.map(a => ({ ...a, type: 'Account' }))
        ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        res.json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.restoreItem = async (req, res) => {
    try {
        const { id, type } = req.body;
        let model;
        if (type === 'Lead') model = Lead;
        else if (type === 'Opportunity') model = Opportunity;
        else if (type === 'Account') model = Account;

        if (!model) return res.status(400).json({ message: 'Invalid type' });

        await model.findByIdAndUpdate(id, { isDeleted: false });
        res.json({ message: 'Record restored successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.permanentDelete = async (req, res) => {
    try {
        const { id, type } = req.body;
        let model;
        if (type === 'Lead') model = Lead;
        else if (type === 'Opportunity') model = Opportunity;
        else if (type === 'Account') model = Account;

        if (!model) return res.status(400).json({ message: 'Invalid type' });

        await model.findByIdAndDelete(id);
        res.json({ message: 'Record permanently deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
