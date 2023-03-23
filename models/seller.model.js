const mongoose = require('mongoose')

const sellerSchema = new mongoose.Schema({
    products: [{
        type: mongoose.Types.ObjectId,
        ref: 'item'
    }],
    messages: [{
        type: mongoose.Types.ObjectId,
        ref: 'message'
    }],
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'user'
    }
})

module.exports = mongoose.model('seller', sellerSchema)