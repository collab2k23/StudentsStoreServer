const express = require('express')
const { myProducts } = require('../controller/myProductCtrl')
const { explore, addProduct } = require('../controller/productCtrl')
const { authUser, isUserVerified } = require('../middleware/authUser')
const router = express.Router()

router.post('/explore', authUser, explore)

router.post('/add', authUser, isUserVerified, addProduct )

router.post('/all', authUser, myProducts)

module.exports = router