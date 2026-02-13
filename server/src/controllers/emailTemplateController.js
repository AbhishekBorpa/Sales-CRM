const EmailTemplate = require('../models/EmailTemplate');

exports.getTemplates = async (req, res) => {
    try {
        const templates = await EmailTemplate.find().sort({ createdAt: -1 });
        res.json(templates);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createTemplate = async (req, res) => {
    try {
        const template = new EmailTemplate(req.body);
        const savedTemplate = await template.save();
        res.status(201).json(savedTemplate);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.updateTemplate = async (req, res) => {
    try {
        const template = await EmailTemplate.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(template);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteTemplate = async (req, res) => {
    try {
        await EmailTemplate.findByIdAndDelete(req.params.id);
        res.json({ message: 'Template deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.previewTemplate = async (req, res) => {
    try {
        const template = await EmailTemplate.findById(req.params.id);
        if (!template) return res.status(404).json({ message: 'Template not found' });

        // Simple merge field replacement ({{lead.name}} etc.)
        let preview = template.body;
        const Lead = require('../models/Lead');

        if (req.query.leadId) {
            const lead = await Lead.findById(req.query.leadId);
            if (lead) {
                preview = preview.replace(/\{\{lead\.name\}\}/g, lead.name || '');
                preview = preview.replace(/\{\{lead\.company\}\}/g, lead.company || '');
                preview = preview.replace(/\{\{lead\.email\}\}/g, lead.email || '');
            }
        }

        res.json({ subject: template.subject, body: preview });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
