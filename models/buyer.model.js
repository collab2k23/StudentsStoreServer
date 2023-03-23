const mongoose = require('mongoose');

const buyerSchema = new mongoose.Schema({
    orders: [{
        type: mongoose.Types.ObjectId,
        ref: 'product'
    }],
    messages: [{
        type: mongoose.Types.ObjectId,
        ref: 'message'
    }],
    cart: [{
        type: mongoose.Types.ObjectId,
        ref: 'product'
    }],
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'user'
    }
});

module.exports = mongoose.model('buyer', buyerSchema)