const express = require('express')
const { myProducts, newProduct, removeProduct } = require('../controller/myProductCtrl')
const { authUser } = require('../middleware/authUser')
const router = express.Router()

router.post('/all', authUser, myProducts)

router.post('/add', authUser, newProduct)

router.post('/remove', authUser, removeProduct )

module.exports = router