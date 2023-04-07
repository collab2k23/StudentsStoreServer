const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
require('dotenv').config()
const mongoose = require('mongoose')
const multer = require('multer')

const storage = (loc)=>multer.diskStorage({
    destination: function (req, file, cb){
        cb(null,'uploads/'+loc)
    },
    filename: function (req, file, cb){
        const ext = file.mimetype.split('/')[1]
        cb(null,`${file.fieldname}-${Date.now()}.${ext}`)
    }
})

const uploadProfile = multer({
    storage: storage('profile'),
    limits: {
        fileSize: 1024*1024*5
    },
    fileFilter: (req, file, cb) =>{
        if( file.mimetype==='image/png' || file.mimetype==='image/jpeg' || file.mimetype==='image/jpg'){
            cb(null, true)
        }else{
            cb(new Error('Invalid file type'))
        }
    }
})

const uploadProduct = multer({
    storage: storage('products'),
    limits: {
        fileSize: 1024*1024*5
    },
    fileFilter: (req, file, cb) =>{
        if( file.mimetype==='image/png' || file.mimetype==='image/jpeg' || file.mimetype==='image/jpg'){
            cb(null, true)
        }else{
            cb(new Error('Invalid file type'))
        }
    }
})

const authRoutes = require('./router/authRouter')
const productRoutes = require('./router/productRouter')
const myProductsRoutes = require('./router/myProductRouter')
const { authUser, isUserVerified } = require('./middleware/authUser')
const { profileUpload } = require('./controller/authCtrl')
const { newProduct } = require('./controller/myProductCtrl')

const app = express()

app.use(express.json())
app.use(cors())
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: true }));
app.use('/imgs',express.static('./uploads'))

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true})

app.use('/api', authRoutes)
app.use('/product', productRoutes)
app.use('/myproducts', myProductsRoutes)

app.post('/upload/profile', authUser, isUserVerified, uploadProfile.single('profile'), profileUpload)
app.post('/opload/newProduct', authUser, isUserVerified, uploadProduct.array('product'), newProduct)

app.listen(process.env.PORT, () => console.log('Server: ' + process.env.PORT)) 