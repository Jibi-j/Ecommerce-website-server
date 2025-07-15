const express = require('express')
const router = express.Router()

const userRouter = require('./userRoutes')
const adminRouter = require('./adminRoutes')
const sellerRouter = require('./sellerRoutes')
const cartRoutes = require('./cartRoutes');
const reviewRoutes = require('./reviewRoutes')
const productRoutes = require('./productRoutes');
const paymentRoutes = require('./paymentRoutes'); 
const orderRoutes = require('./orderRoutes');
// /api/user
router.use('/user',userRouter)

// /api/admin
router.use('/admin',adminRouter)

// / seller
router.use('/seller',sellerRouter)

// api/cart
router.use('/cart', cartRoutes)

//api /review
router.use('/review',reviewRoutes)

//productRouter
router.use('/products', productRoutes)

router.use('/payment', paymentRoutes);

router.use('/order', orderRoutes);
module.exports = router