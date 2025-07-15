const express = require('express');
const router = express.Router();

const { adminLogin, adminLogout, deleteUser,getAllUsers, getAllProducts, deleteProduct,  getAllOrders, verifyOrder} = require('../controllers/adminController');

const authAdmin = require('../middlewares/authAdmin');

// Admin Login
router.post('/login', adminLogin);

// Admin Logout
router.post('/logout', authAdmin, adminLogout);


// Delete a User 
router.delete('/user/:id', authAdmin, deleteUser);

router.get('/users', authAdmin, getAllUsers)

router.get('/products', authAdmin, getAllProducts)

router.delete('/product/:id', authAdmin, deleteProduct)

router.get("/orders",  authAdmin, getAllOrders);
router.patch("/orders/:orderId/verify",  authAdmin, verifyOrder);

module.exports = router;




