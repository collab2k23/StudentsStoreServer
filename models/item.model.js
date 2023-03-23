const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema({
    seller: {
        type: mongoose.Types.ObjectId,
        ref: 'seller'
    },
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    price: {
        type: String,
    },
    domain: {
        type: String,
    },
    address: {
        type: mongoose.Types.ObjectId,
        ref: 'address'
    }    
})

module.exports = mongoose.model('item', itemSchema)