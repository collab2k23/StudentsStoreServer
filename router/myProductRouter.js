const express = require('express')
const { myProducts } = require('../controller/myProductCtrl')
const { authUser, isUserVerified } = require('../middleware/authUser')
const router = express.Router()

router.post('/all', authUser, myProducts)

module.exports = router