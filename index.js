const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
require('dotenv').config()
const mongoose = require('mongoose')

const authRoutes = require('./router/authRouter')
const itemRoutes = require('./router/itemRouter')

const app = express()
app.use(express.json())
app.use(cors())
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: true }));
mongoose.connect(process.env.MONGODB_URI)

app.use('/api', authRoutes)
app.use('/item', itemRoutes)

app.listen(process.env.PORT, () => console.log('Server: ' + process.env.PORT))