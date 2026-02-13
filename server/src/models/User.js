const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ['Admin', 'Manager', 'User'], default: 'User' },
    title: { type: String },
    phone: { type: String },
    avatar: { type: String }, // URL or Base64
    createdAt: { type: Date, default: Date.now },
    lastLogin: { type: Date }
});

module.exports = mongoose.model('User', UserSchema);
