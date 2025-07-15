const express = require('express')
const router = express.Router();
const authUser = require('../middlewares/authUser')
const { createCheckoutSession,verifyCheckoutSession } = require('../controllers/paymentController')

router.post('/create-checkout-session',authUser,createCheckoutSession)
router.get('/verify-checkout-session', authUser, verifyCheckoutSession)

module.exports = router;