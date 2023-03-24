const express = require('express')
const { Register, Login, userDetails } = require('../controller/authCtrl')
const { authUser } = require('../middleware/authUser')
const { body } = require('express-validator')
const router = express.Router()

router.post('/register',body('email').isEmail() , Register)

router.post('/login', Login)

router.post('/userDetails',  authUser ,userDetails)

module.exports = router