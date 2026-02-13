const Quote = require('../models/Quote');

exports.getQuotes = async (req, res) => {
    try {
        const quotes = await Quote.find().sort({ createdAt: -1 });
        res.json(quotes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createQuote = async (req, res) => {
    try {
        const quote = new Quote(req.body);
        const saved = await quote.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
