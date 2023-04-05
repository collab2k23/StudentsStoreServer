const Items = require('../models/item.model')

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
    newItem.save()
}

let removeProduct = async (req, res) => {
    let { id } = req.body
    let item = await Items.deleteOne({ _id : id})
}

module.exports = { myProducts, newProduct, removeProduct }