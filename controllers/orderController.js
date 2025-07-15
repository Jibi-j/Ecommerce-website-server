const Order = require('../models/orderModel');

const createOrder = async (req, res) => {
  try {
    const { products, totalAmount, address } = req.body;
    const userId = req.user._id;

    if (!products || !products.length) {
      return res.status(400).json({ message: 'No products found' });
    }

    
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);

    const existingOrder = await Order.findOne({
      userId,
      totalAmount,
      createdAt: { $gte: oneMinuteAgo },
      'products.0.productId': products[0]?.productId, 
    });

    if (existingOrder) {
      return res.status(200).json({
        success: true,
        message: 'Duplicate order avoided',
        order: existingOrder,
      });
    }

    const newOrder = new Order({
      userId,
      products,
      totalAmount,
      address,
      paymentStatus: 'paid',
      status: 'Processing',
      verifiedByAdmin: false,
    });

    await newOrder.save();
    res.status(201).json({ success: true, message: 'Order placed', order: newOrder });
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ success: false, message: 'Failed to create order' });
  }
};


//get orders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).populate('products.productId');
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
};

module.exports = { createOrder, getMyOrders };
