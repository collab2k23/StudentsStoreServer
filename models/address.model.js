const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    address:{
        type: String,
        maxLength:100,
        default: ''
    },
    city: {
        type: String,
        maxLength:25,
        default: ''
    },
    district: {
        type: String,
        maxLength:25,
        default: ''
    },
    pincode: {
        type: String,
        maxLength:6,
        default: ''
    },
    state: {
        type: String,
        maxLength:25,
        default: ''
    },
    user:{
        type: mongoose.Types.ObjectId,
        ref: 'user',
    }
});

module.exports = mongoose.model('address', addressSchema);