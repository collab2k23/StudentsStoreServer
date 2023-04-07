const mongoose = require('mongoose')

const searchProd = new mongoose.Schema({
    keyword: {
        type: String,
    },
    product: {
        type: mongoose.Types.ObjectId,
        ref: 'item'
    }
})

module.exports = mongoose.model('searchProd', searchProd)