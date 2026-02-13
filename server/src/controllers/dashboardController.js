const Lead = require('../models/Lead');
const Opportunity = require('../models/Opportunity');
const Case = require('../models/Case');

exports.getStats = async (req, res) => {
    try {
        const totalLeads = await Lead.countDocuments();
        const activeOpps = await Opportunity.countDocuments({ stage: { $ne: 'Closed Won' } });

        // Calculate pipeline value
        const opps = await Opportunity.find();
        const pipelineValue = opps.reduce((sum, opp) => sum + (opp.value || 0), 0);

        // Calculate Revenue (Closed Won)
        const wonOpps = await Opportunity.find({ stage: 'Closed Won' });
        const totalRevenue = wonOpps.reduce((sum, opp) => sum + (opp.value || 0), 0);

        // Calculate Open Cases
        const openCases = await Case.countDocuments({ status: { $ne: 'Closed' } });

        res.json({
            totalLeads,
            activeOpps,
            pipelineValue,
            totalRevenue,
            openCases,
            conversionRate: 15 // Mock for now or calculate
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
