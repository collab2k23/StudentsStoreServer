const Item = require('../models/item.model')

let explore = async (req, res)=>{
    const items = await Item.find().populate('address seller')
    res.json({ 
        status:'ok',
        items
    })
}

let addProduct = async (req, res)=>{
    const newItem = new Item({
        seller: req.user.seller,
        title: "Title of product",
        description: "desc1",
        attribute: ['a1','a2'],
        val: ['v1','v2'],
        price: '1200',
        domain: 'some domainnn',
        address: req.user.address
    })
    newItem.save()
    return res.json(newItem)
}

module.exports = { explore, addProduct }