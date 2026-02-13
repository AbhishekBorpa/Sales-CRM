const mongoose = require('mongoose');

const OpportunityLineItemSchema = new mongoose.Schema({
    opportunityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Opportunity', required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    productName: { type: String }, // Snapshot of name
    quantity: { type: Number, default: 1 },
    price: { type: Number, required: true }, // Snapshot of price
    totalPrice: { type: Number }
});

module.exports = mongoose.model('OpportunityLineItem', OpportunityLineItemSchema);
