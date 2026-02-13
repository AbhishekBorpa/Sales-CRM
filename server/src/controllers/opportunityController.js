const Opportunity = require('../models/Opportunity');
const ContactRole = require('../models/ContactRole');
const OpportunityLineItem = require('../models/OpportunityLineItem');

exports.getOpportunities = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
        const query = { isDeleted: false };

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } }
            ];
        }

        const count = await Opportunity.countDocuments(query);
        const opps = await Opportunity.find(query)
            .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        res.json({
            opportunities: opps,
            totalPages: Math.ceil(count / limit),
            currentPage: Number(page),
            totalOpportunities: count
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getOpportunityById = async (req, res) => {
    try {
        const opp = await Opportunity.findById(req.params.id)
            .populate('accountId', 'name website industry'); // Populate account details

        if (!opp) return res.status(404).json({ message: 'Opportunity not found' });
        res.json(opp);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createOpportunity = async (req, res) => {
    try {
        const map = {
            'Prospecting': 10, 'Qualification': 30, 'Proposal': 60,
            'Negotiation': 80, 'Closed Won': 100
        };
        const probability = map[req.body.stage] || 10;

        const newOpp = new Opportunity({ ...req.body, probability });
        const savedOpp = await newOpp.save();
        res.status(201).json(savedOpp);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.updateOpportunity = async (req, res) => {
    try {
        const opp = await Opportunity.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(opp);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Opportunity Related Items
exports.getContactRoles = async (req, res) => {
    try {
        const roles = await ContactRole.find({ opportunityId: req.query.opportunityId });
        res.json(roles);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.addContactRole = async (req, res) => {
    try {
        const role = new ContactRole(req.body);
        const saved = await role.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getLineItems = async (req, res) => {
    try {
        const items = await OpportunityLineItem.find({ opportunityId: req.query.opportunityId });
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.addLineItem = async (req, res) => {
    try {
        const item = new OpportunityLineItem(req.body);
        const saved = await item.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteOpportunity = async (req, res) => {
    try {
        await Opportunity.findByIdAndUpdate(req.params.id, { isDeleted: true });
        res.json({ message: 'Opportunity moved to Recycle Bin' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

