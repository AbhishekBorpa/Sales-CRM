const Lead = require('../models/Lead');
const Account = require('../models/Account');
const Contact = require('../models/Contact');
const Opportunity = require('../models/Opportunity');
const { logAction } = require('../services/auditService');

const { calculateLeadScore } = require('../services/scoringService');

const { processAssignmentRules } = require('./assignmentRuleController');

exports.getLeads = async (req, res) => {
    try {
        const leads = await Lead.find({ isDeleted: false }).sort({ createdAt: -1 });
        res.json(leads);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getLead = async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id);
        if (!lead || lead.isDeleted) {
            return res.status(404).json({ message: 'Lead not found' });
        }
        res.json(lead);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createLead = async (req, res) => {
    try {
        const score = calculateLeadScore(req.body);

        // Auto-assign based on rules
        const assignedUserId = await processAssignmentRules(req.body);
        const leadData = { ...req.body, score };

        if (assignedUserId) {
            leadData.assignedTo = assignedUserId;
        }

        const newLead = new Lead(leadData);
        const savedLead = await newLead.save();

        // Audit Log
        await logAction('Lead', savedLead._id, 'Create', 'System Admin', `Created lead: ${savedLead.name}`);

        res.status(201).json(savedLead);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.convertLead = async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id);
        if (!lead) return res.status(404).json({ message: 'Lead not found' });
        if (lead.status === 'Converted') return res.status(400).json({ message: 'Already converted' });

        // 1. Create Account
        const account = new Account({
            name: lead.company,
            industry: 'Other', // meaningful default
            website: lead.website || ''
        });
        const savedAccount = await account.save();

        // 2. Create Contact
        const contact = new Contact({
            name: lead.name,
            accountId: savedAccount._id,
            email: lead.email,
            phone: lead.phone
        });
        const savedContact = await contact.save();

        // 3. Create Opportunity
        const opportunity = new Opportunity({
            title: `${lead.company} Deal`,
            stage: 'Prospecting',
            value: lead.value,
            accountId: savedAccount._id,
            closeDate: new Date().toISOString().split('T')[0]
        });
        const savedOpp = await opportunity.save();

        // 4. Update Lead
        lead.status = 'Converted';
        await lead.save();

        // Audit Log
        await logAction('Lead', lead._id, 'Convert', 'System Admin', `Converted lead to Account: ${account.name}`);

        res.json({
            message: 'Lead converted successfully',
            account: savedAccount,
            contact: savedContact,
            opportunity: savedOpp
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteLead = async (req, res) => {
    try {
        await Lead.findByIdAndUpdate(req.params.id, { isDeleted: true });
        res.json({ message: 'Lead moved to Recycle Bin' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
