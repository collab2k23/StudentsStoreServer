const jwt = require('jsonwebtoken')
const User = require('../models/user.model')

const authUser = async (req, res, next) => {
    const token = req.headers['x-access-token']
    if(!token) return res.status(200).json({ status:'fail', msg:'Login Again' })
    jwt.verify(token, process.env.TOKEN_KEY, async (err, user)=>{
        if(err) return res.status(200).json({ status: 'fail', msg:'Login Again' })
        const fUser = await User.findOne({ email: user.email, username: user.username }).populate('address')
        if(!fUser) return res.status(200).json({ status: 'fail', status: 'Login Again' })
        req.user = { ...fUser._doc, password: '' }
        next()
    })
}

module.exports = { authUser }