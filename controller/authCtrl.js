const mongoose = require('mongoose')
const User = require('../models/user.model')
const Address = require('../models/address.model')
const Seller = require('../models/seller.model')
const Buyer = require('../models/buyer.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')

let Register = async( req, res )=>{
    try{
        const errors = validationResult(req)
        if(!errors.isEmpty()) return res.status(200).send({ status:'error', msg: 'Invalid Email'})
        const { firstName,lastName,username,password,email,phoneno,address,city,pincode,district,state } = req.body
        console.log(req.body)
        let user = await User.findOne({ email })
        if( user ) return res.status(200).send({ status:'error', msg: 'Email already in use'})
        user = await User.findOne({ username })
        if( user ) return res.status(200).json({ status:'error', msg: 'Username already in use'})
        user = await User.findOne({ phoneno })
        if( user ) return res.status(200).json({ status:'error', msg: 'Phoneno already in use'})

        bcrypt.genSalt(10 , function(err, salt) {
            bcrypt.hash(password, salt, function(err, hash) {
                const newUser = new User({
                    firstName,lastName,username,password:hash,email,phoneno
                })  
                const newAddress = new Address({
                    address,
                    city,
                    pincode,
                    district,
                    state,
                    user: newUser
                })              
                const seller = new Seller({
                    products: [],
                    messages: [],
                    user: newUser
                })
                const buyer = new Buyer({
                    orders: [],
                    messages: [],
                    cart: [],
                    user: newUser
                })

                newUser.buyer = buyer
                newUser.seller = seller
                newUser.address = newAddress

                const token = jwt.sign({ email, username }, process.env.TOKEN_KEY)
                
                newUser.save()
                buyer.save()
                seller.save()
                newAddress.save()
                res.json({ status:'ok', token })
            });
        });

    }catch( err){
        console.log(err)
        return res.status(500).json({ msg: err.message });
    }
}

let Login = async( req, res )=>{
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email: email })
        if (!user) return res.status(200).send({ status:'error', msg: 'no email found' })
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch) return res.status(200).send({ status:'error', msg: 'Incorrect Password' })

        const token = jwt.sign({ email, username: user.username }, process.env.TOKEN_KEY) 
        res.status(200).send({ status:'ok', token })
    }catch( err){
        console.log(err)
        return res.status(500).json({ msg: err.message });
    }
}

let userDetails = async ( req, res )=>{
    try{
        const { 
            firstName, 
            lastName, 
            username, 
            seller,
            buyer,
            address 
        } = req.user

        const userData = {
            firstName, 
            lastName, 
            username, 
            city: address.city, 
            state: address.state, 
            seller: seller, 
            buyer: buyer,
            address: address._id
        }

        res.json({ status:'ok', user:userData })
    }catch( err ){
        
        console.log(err)
        response.status(500).json({ msg: err.message });
    }
} 

module.exports = { Register, Login, userDetails };