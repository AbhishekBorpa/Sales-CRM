const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    content: { type: String, required: true },
    author: { type: String, default: 'You' }, // In a real app, this would be User ObjectId
    type: { type: String, enum: ['Post', 'Call', 'Email', 'Meeting', 'Note'], default: 'Post' },
    relatedRecordId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Polymorphic link to Lead/Opp/etc
    relatedModel: { type: String, enum: ['Lead', 'Opportunity', 'Account', 'Case'], required: true },
    likes: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', PostSchema);
