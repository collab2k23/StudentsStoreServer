const Items = require('../models/item.model')
const searchProd = require('../models/methods/search.model');
const Seller = require('../models/seller.model');
const Address = require('../models/address.model');

let myProducts = async(req,res)=>{
    const myproducts = await Items.find({ seller: req.user.seller })
    return res.status(200).json({ status:'ok', myproducts, msg:'' })
}

let newProduct = async(req,res)=>{
    try{
        const { title, description, attribute, val, price, domain, sellerid, addressid } = req.body
        const seller = await Seller.findById(sellerid)
        const address = await Address.findById(addressid)
        const newItem = new Items({
            seller,
            title, 
            description, 
            attribute, 
            val, 
            price, 
            domain,
            address
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
    }catch(err) {
        return res.status(200).json({ status: 'error', msg: err.message})
    }
}

let removeProduct = async (req, res) => {
    let { id } = req.body
    let item = await Items.findById(id)
    await searchProd.deleteMany({ product: item })
    await Items.deleteOne({ _id : id})
    return res.status(200).json({ status: 'ok' })
}

let newProductImg = async(req,res) =>{
    const product = await Items.findByIdAndUpdate(req.body.product,{
        img: []
    })

}

module.exports = { myProducts, newProduct, removeProduct, newProductImg }