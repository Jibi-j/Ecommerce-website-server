const express = require('express');
const router = express.Router();
const authUser = require('../middlewares/authUser');

const {addToCart,removeFromCart,getCart,clearCart,} = require('../controllers/cartController');

router.use(authUser);

//add to cart
router.post('/add', addToCart);

//remove cart
router.delete('/remove/:productId', removeFromCart);

//get cart
router.get('/get', getCart);

//clear cart
router.delete('/clear', clearCart);

module.exports = router;
