const Note = require('../models/Note');

exports.getNotes = async (req, res) => {
    try {
        const notes = await Note.find({ parentId: req.query.parentId }).sort({ _id: -1 }); // proxy for time
        res.json(notes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createNote = async (req, res) => {
    try {
        const newNote = new Note({
            ...req.body,
            createdAt: new Date().toISOString().split('T')[0]
        });
        const savedNote = await newNote.save();
        res.status(201).json(savedNote);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
