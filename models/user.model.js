const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        maxLength:25,
        trim: true,
        required: true
    },
    lastName:{
        type: String,
        maxLength:25,
        trim: true,
        required: true
    },
    username:{
        type: String,
        maxLength:25,
        trim: true,
        unique: true,
        required: true
    },
    password:{
        type: String,
        maxLength:1000,
        required: true
    },
    avatar:{
        type: String,
        default: 'https://www.nicepng.com/png/full/73-730154_open-default-profile-picture-png.png'
    },
    address:{
        type: mongoose.Types.ObjectId,
        ref: 'address'
    },
    email:{
        type: String,
        maxLength: 70,
        unique: true
    },
    phoneno:{
        type: String,
        maxLength: 15,
        unique: true
    },
    buyer:{
        type: mongoose.Types.ObjectId,
        ref: 'buyer'
    },
    seller:{
        type: mongoose.Types.ObjectId,
        ref: 'seller'
    },
    securityQuestion: {
        type: String,
        maxLength:100,
        default: null
    },
    securityKey:{
        type: String,
        maxLength:100,
        default: ''
    }
},{
    timestamps: true,
})

module.exports = mongoose.model('user', userSchema);