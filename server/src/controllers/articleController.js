const Article = require('../models/Article');

exports.getArticles = async (req, res) => {
    try {
        const filters = { isPublished: true };
        if (req.query.category) filters.category = req.query.category;

        const articles = await Article.find(filters).sort({ viewCount: -1 });
        res.json(articles);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createArticle = async (req, res) => {
    try {
        const newArticle = new Article(req.body);
        const savedArticle = await newArticle.save();
        res.status(201).json(savedArticle);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.updateArticle = async (req, res) => {
    try {
        req.body.lastUpdated = Date.now();
        const updatedArticle = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedArticle);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteArticle = async (req, res) => {
    try {
        await Article.findByIdAndDelete(req.params.id);
        res.json({ message: 'Article deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.incrementView = async (req, res) => {
    try {
        await Article.findByIdAndUpdate(req.params.id, { $inc: { viewCount: 1 } });
        res.json({ message: 'View counted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
