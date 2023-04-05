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
    attribute:[{
        type: String,
    }],
    val:[{
        type: String,
    }],
    price: {
        type: String,
    },
    domain: {
        type: String,
    },
    address: {
        type: mongoose.Types.ObjectId,
        ref: 'address'
    },
    img:[{
        type: String,
    }]    
},{
    timestamps:true
})

module.exports = mongoose.model('item', itemSchema)