const express = require('express');
const router = express.Router();
const {sellerRegister, sellerLogin, sellerProfile,updateSellerProfile, sellerLogout,createProduct,getAllProducts,getproductById,updateProduct,getSellerOrders} = require('../controllers/sellerController');
const { authSeller } = require('../middlewares/authSeller');
const upload = require('../middlewares/multer')


router.post('/register',sellerRegister)
router.post('/login', sellerLogin);


router.get('/profile', authSeller, sellerProfile);
router.patch('/updateprofile', authSeller, updateSellerProfile);
router.post('/product',authSeller,upload.single('image'),createProduct )
router.get('/products',authSeller,getAllProducts)
router.get('/product/:id',authSeller,getproductById)
router.patch("/product/:id", authSeller, updateProduct);
router.get("/orders", authSeller, getSellerOrders);
router.post('/logout', authSeller, sellerLogout);


module.exports = router;
