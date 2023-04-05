const mongoose = require('mongoose')
const User = require('../models/user.model')
const Address = require('../models/address.model')
const Seller = require('../models/seller.model')
const Buyer = require('../models/buyer.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const otpGenerator = require('otp-generator')
const { validationResult } = require('express-validator')
const fs = require('fs')

const Sib = require('sib-api-v3-sdk')

const client = Sib.ApiClient.instance
const apiKey = client.authentications['api-key']
apiKey.apiKey = process.env.SMTP_APIKEY

const tranEmailApi = new Sib.TransactionalEmailsApi()
const sender = {
    email: 'studentstore2311@gmail.com',
    name: 'StudentStore',
}

let Register = async( req, res )=>{
    try{
        const errors = validationResult(req)
        if(!errors.isEmpty()) return res.status(200).send({ status:'error', msg: 'Invalid Email'})
        const { firstName,lastName,username,password,email,phoneno,address,city,pincode,district,state } = req.body
        console.log(req.body)
        let user = await User.findOne({ email })
        if( user ) {
            if ( !user.verified ) await User.findOneAndDelete({ email })
            return res.status(200).send({ status:'error', msg: 'Email already in use'})
        }
        user = await User.findOne({ username })
        if( user ) {
            if ( !user.verified ) await User.findOneAndDelete({ username })
            return res.status(200).send({ status:'error', msg: 'Username already in use'})
        }
        user = await User.findOne({ phoneno })
        if( user ) {
            if ( !user.verified ) await User.findOneAndDelete({ phoneno })
            return res.status(200).send({ status:'error', msg: 'Phoneno already in use'})
        }

        let otp
        try {
            otp = await createOTP(email)
        } catch (error) {
            console.log(error)
            return res.status(200).json({ status:'error', msg: 'Problem with email address' })
        }

        console.log('OTP: ' + otp)
        const fname = firstName + ' ' + otp

        bcrypt.genSalt(10 , function(err, salt) {
            bcrypt.hash(password, salt, function(err, hash) {
                const newUser = new User({
                    firstName:fname,lastName,username,password:hash,email,phoneno
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

                setTimeout(async() => {
                    const chkUser = await User.findOne({email})
                    if(!chkUser.verified){
                        await User.deleteOne({email})
                    } 
                },1000*60*5)

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
        if(!user.verified) return res.status(200).send({ status:'error', msg: 'Verify User' })

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
            address,
            avatar,
            email,
            phoneno 
        } = req.user

        const userData = {
            firstName, 
            lastName, 
            username, 
            avatar,
            email,
            phoneno,
            city: address.city, 
            state: address.state, 
            address: address.address,
            district: address.district,
            pincode: address.pincode,
            seller: seller, 
            buyer: buyer,
            addressId: address._id
        }

        res.json({ status:'ok', user:userData })
    }catch( err ){
        
        console.log(err)
        response.status(500).json({ msg: err.message });
    }
} 

let createOTP = async (email)=>{
    const otp = otpGenerator.generate(6,{ upperCaseAlphabets:false, lowerCaseAlphabets:false, specialChars:false })

    const receivers = [
        {
            email
        },
    ]

    tranEmailApi
    .sendTransacEmail({
        sender,
        to: receivers,
        subject: 'Verification OTP for StudentStore',
        textContent: `
        Your verification OTP is ${otp}
        `,
        htmlContent: `
        <h1>Verification OTP</h1>
        <strong>${otp}</strong>
                `,
        params: {
            role: 'Frontend',
        },
    })
    .then(console.log)
    .catch(console.log)
    return otp
}

let verifyUser = async (req, res) => {
    const { otp } = req.body
    if(!otp) return res.status(200).json({ status: 'error', msg: 'EnterOTP' })
    const temp = req.user.firstName.split(' ')
    if( temp.pop()!==otp ) return res.status(200).json({ status: 'error', msg: 'Incorrect OTP' })
    await User.findOneAndUpdate({ email: req.user.email }, { firstName:temp.join(' '), verified:true })
    return res.status(200).json({ status: 'ok' })
}

let profileUpload = async (req, res) => {
    console.log(req.body)
    try{
        let oldUrl = req.user.avatar
        oldUrl = oldUrl.split('/')
        oldUrl[0] = './uploads'
        try{
            fs.unlinkSync(oldUrl.join('/'), err=>{
                if(err) console.log(err)
                console.log('old profile deleted')
            })
        }catch(err){
            console.log(err.message)
        }
        avatarUrl = 'imgs/profile/'+req.file.filename
        const user = await User.findOneAndUpdate({ email: req.user.email },{ avatar: avatarUrl })
        res.json({ status:'ok', avatarUrl })
    }catch(err) {
        res.status(200).json({ status:'error', msg: err.message })
    }
}

module.exports = { Register, Login, userDetails, verifyUser, profileUpload };