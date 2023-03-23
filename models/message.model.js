const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    seller: {
        type: mongoose.Types.ObjectId,
        ref: 'seller'
    },
    buyer: {
        type: mongoose.Types.ObjectId,
        ref: 'buyer'
    },
    content: {
        type: String,
    },
    date: {
        type: Date,
        default: new Date()
    }
})

module.exports = mongoose.model('message', messageSchema )