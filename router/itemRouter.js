const express = require('express')
const { explore } = require('../controller/itemsCtrl')
const { authUser } = require('../middleware/authUser')
const router = express.Router()

router.post('/explore', authUser, explore)

module.exports = router