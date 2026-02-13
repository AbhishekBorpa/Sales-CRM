const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
    parentId: { type: mongoose.Schema.Types.ObjectId, required: true },
    text: { type: String, required: true },
    createdAt: { type: String } // Storing as YYYY-MM-DD for consistency with mock
});

module.exports = mongoose.model('Note', NoteSchema);
