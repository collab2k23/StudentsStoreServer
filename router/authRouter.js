const express = require('express')
const { Register, Login, userDetails, verifyUser } = require('../controller/authCtrl')
const { authUser, isUserVerified } = require('../middleware/authUser')
const { body } = require('express-validator')
const router = express.Router()

router.post('/register', body('email').isEmail() , Register)

router.post('/verifyOTP', authUser, verifyUser)

router.post('/login', Login)

router.post('/userDetails',  authUser , isUserVerified, userDetails)

module.exports = router 