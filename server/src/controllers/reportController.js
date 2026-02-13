const Lead = require('../models/Lead');
const Opportunity = require('../models/Opportunity');
const OpportunityLineItem = require('../models/OpportunityLineItem');

exports.getPipelineStages = async (req, res) => {
    try {
        const data = await Opportunity.aggregate([
            {
                $group: {
                    _id: '$stage',
                    count: { $sum: 1 },
                    totalValue: { $sum: '$value' }
                }
            },
            {
                $addFields: {
                    sortOrder: {
                        $switch: {
                            branches: [
                                { case: { $eq: ["$_id", "Prospecting"] }, then: 1 },
                                { case: { $eq: ["$_id", "Qualification"] }, then: 2 },
                                { case: { $eq: ["$_id", "Proposal"] }, then: 3 },
                                { case: { $eq: ["$_id", "Negotiation"] }, then: 4 },
                                { case: { $eq: ["$_id", "Closed Won"] }, then: 5 },
                                { case: { $eq: ["$_id", "Closed Lost"] }, then: 6 }
                            ],
                            default: 7
                        }
                    }
                }
            },
            { $sort: { sortOrder: 1 } }
        ]);
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getRevenueByIndustry = async (req, res) => {
    try {
        const data = await Opportunity.aggregate([
            {
                $lookup: {
                    from: 'accounts',
                    localField: 'accountId',
                    foreignField: '_id',
                    as: 'account'
                }
            },
            { $unwind: '$account' }, // Flatten the account array
            {
                $group: {
                    _id: '$account.industry',
                    totalRevenue: { $sum: '$value' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { totalRevenue: -1 } }
        ]);
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getLeadsBySource = async (req, res) => {
    try {
        const data = await Lead.aggregate([
            {
                $group: {
                    _id: '$source',
                    count: { $sum: 1 },
                    avgScore: { $avg: '$score' }
                }
            },
            { $sort: { count: -1 } }
        ]);
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getSalesVelocity = async (req, res) => {
    // Mock metric for now as we need better historical tracking
    // But this shows the structure for future expansion
    try {
        const avgDays = 24; // Placeholder
        res.json({ averageDaysToClose: avgDays });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getTopSellingProducts = async (req, res) => {
    try {
        // Since we don't have OpportunityLineItem fully working with quantity yet, 
        // we will fetch mock data or rudimentary aggregation if models exist.
        // Assuming OpportunityLineItem has productId and totalPrice

        /* 
        const data = await OpportunityLineItem.aggregate([
            {
                $group: {
                    _id: '$productId',
                    totalSold: { $sum: '$quantity' },
                    revenue: { $sum: '$totalPrice' }
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            { $unwind: '$product' },
            { $sort: { revenue: -1 } },
            { $limit: 5 },
            {
                $project: {
                    name: '$product.name',
                    revenue: 1,
                    totalSold: 1
                }
            }
        ]);
        */

        // For now, return mock data to enable UI
        const mockData = [
            { name: 'Enterprise License', revenue: 125000, growth: 12 },
            { name: 'Professional Plan', revenue: 84000, growth: 8 },
            { name: 'Onboarding Package', revenue: 45000, growth: -5 },
            { name: 'Support SLA', revenue: 32000, growth: 15 },
        ];
        res.json(mockData);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
