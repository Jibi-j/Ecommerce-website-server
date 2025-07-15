const express = require("express");
const router = express.Router();
const authUser = require('../middlewares/authUser');
const { createOrder, getMyOrders } = require("../controllers/orderController");

router.post("/create", authUser, createOrder);         
router.get("/my-orders", authUser, getMyOrders);       

module.exports = router;
