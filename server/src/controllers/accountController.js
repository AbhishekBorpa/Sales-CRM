const Account = require('../models/Account');

exports.getAccounts = async (req, res) => {
    try {
        const { search, industry } = req.query;
        let query = { isDeleted: false };

        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }
        if (industry) {
            query.industry = industry;
        }

        const accounts = await Account.find(query).sort({ createdAt: -1 });
        res.json(accounts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getAccountById = async (req, res) => {
    try {
        const account = await Account.findOne({ _id: req.params.id, isDeleted: false });
        if (!account) return res.status(404).json({ message: 'Account not found' });
        res.json(account);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createAccount = async (req, res) => {
    try {
        const newAccount = new Account(req.body);
        const savedAccount = await newAccount.save();
        res.status(201).json(savedAccount);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.updateAccount = async (req, res) => {
    try {
        const updatedAccount = await Account.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedAccount);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteAccount = async (req, res) => {
    try {
        await Account.findByIdAndUpdate(req.params.id, { isDeleted: true });
        res.json({ message: 'Account deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
