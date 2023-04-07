const Item = require('../models/item.model')

let explore = async (req, res)=>{
    const items = await Item.find().populate('address seller')
    res.json({ 
        status:'ok',
        items
    })
}

module.exports = { explore }