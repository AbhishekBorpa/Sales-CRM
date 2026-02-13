const Lead = require('../models/Lead');
const Opportunity = require('../models/Opportunity');

exports.getDashboardStats = async (req, res) => {
    try {
        // Parallel execution for performance
        const [
            totalLeads,
            totalOpportunities,
            opportunities
        ] = await Promise.all([
            Lead.countDocuments({ isDeleted: false }),
            Opportunity.countDocuments({ isDeleted: false }),
            Opportunity.find({ isDeleted: false }).select('value stage')
        ]);

        const totalPipelineValue = opportunities.reduce((sum, opp) => sum + (opp.value || 0), 0);
        const closedWonValue = opportunities
            .filter(opp => opp.stage === 'Closed Won')
            .reduce((sum, opp) => sum + (opp.value || 0), 0);
        const activeDeals = opportunities.filter(opp => !['Closed Won', 'Closed Lost'].includes(opp.stage)).length;

        res.json({
            totalLeads,
            totalOpportunities,
            totalPipelineValue,
            closedWonValue,
            activeDeals
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getSalesPipeline = async (req, res) => {
    try {
        const pipeline = await Opportunity.aggregate([
            { $match: { isDeleted: false } },
            {
                $group: {
                    _id: '$stage',
                    value: { $sum: '$value' },
                    count: { $sum: 1 }
                }
            }
        ]);

        // Ensure all stages are present even if count is 0
        const stages = ['Prospecting', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won'];
        const formattedPipeline = stages.map(stage => {
            const found = pipeline.find(p => p._id === stage);
            return {
                name: stage,
                value: found ? found.value : 0,
                count: found ? found.count : 1 // Avoid 0 height bars if wanted, or just 0
            };
        });

        res.json(formattedPipeline);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getLeadSources = async (req, res) => {
    try {
        const sources = await Lead.aggregate([
            { $match: { isDeleted: false } },
            {
                $group: {
                    _id: '$source',
                    value: { $sum: 1 }
                }
            }
        ]);

        const formattedSources = sources.map(s => ({
            name: s._id || 'Unknown',
            value: s.value
        }));

        res.json(formattedSources);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
