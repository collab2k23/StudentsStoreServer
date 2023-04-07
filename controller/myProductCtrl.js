const Items = require('../models/item.model')
const searchProd = require('../models/methods/search.model');

let myProducts = async(req,res)=>{
    const myproducts = await Items.find({ seller: req.user.seller })
    return res.status(200).json({ status:'ok', myproducts, msg:'' })
}

let newProduct = async(req,res)=>{
    const { title, description, attribute, val, price, domain } = req.body
    const newItem = new Items({
        seller: req.user.seller,
        title, 
        description, 
        attribute, 
        val, 
        price, 
        domain,
        address: req.user.address
    })

    const keywords = title.split(' ')
    keywords.forEach(async(key) => {
        const newKey = new searchProd({
            keyword: key,
            product: newItem
        })
        await newKey.save()
    });

    newItem.save()
    return res.status(200).json({ status: 'ok', newItem })
}

let removeProduct = async (req, res) => {
    let { id } = req.body
    let item = await Items.findById(id)
    await searchProd.deleteMany({ product: item })
    await Items.deleteOne({ _id : id})
    return res.status(200).json({ status: 'ok' })
}

module.exports = { myProducts, newProduct, removeProduct }