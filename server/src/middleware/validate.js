const Joi = require('joi');

const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = error.details.map(detail => detail.message);
            return res.status(400).json({
                title: 'Validation Failed',
                errors
            });
        }
        next();
    };
};

const schemas = {
    lead: Joi.object({
        name: Joi.string().required().min(2).max(100),
        company: Joi.string().required().min(2).max(100),
        email: Joi.string().email().allow(''),
        phone: Joi.string().allow(''),
        value: Joi.number().min(0),
        status: Joi.string().valid('New', 'Contacted', 'Qualified', 'Converted', 'Unqualified'),
        source: Joi.string().valid('Website', 'Referral', 'Cold Call', 'Event', 'Other'),
        industry: Joi.string().allow(''),
        annualRevenue: Joi.number().min(0),
        title: Joi.string().allow(''),
        score: Joi.number().min(0).max(100),
        isDeleted: Joi.boolean()
    }),

    opportunity: Joi.object({
        title: Joi.string().required().min(3).max(100),
        value: Joi.number().min(0),
        stage: Joi.string().valid('Prospecting', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'),
        closeDate: Joi.date().iso().allow(null),
        priority: Joi.string().valid('Low', 'Medium', 'High'),
        probability: Joi.number().min(0).max(100),
        accountId: Joi.string().hex().length(24).allow(null),
        isDeleted: Joi.boolean()
    }),

    opportunityUpdate: Joi.object({
        title: Joi.string().min(3).max(100),
        value: Joi.number().min(0),
        stage: Joi.string().valid('Prospecting', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'),
        closeDate: Joi.date().iso().allow(null),
        priority: Joi.string().valid('Low', 'Medium', 'High'),
        probability: Joi.number().min(0).max(100),
        accountId: Joi.string().hex().length(24).allow(null),
        isDeleted: Joi.boolean()
    }).min(1)
};

module.exports = { validate, schemas };
