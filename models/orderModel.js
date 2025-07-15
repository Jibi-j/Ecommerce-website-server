const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: Number
    }
  ],
  totalAmount: Number,
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid'],
    default: 'pending'
  },
  status: {
    type: String,
    enum: ['Processing', "Verified", 'Shipped', 'Delivered'],
    default: 'Processing'
  },
  address: {
  city: String,
  state: String,
  phoneNumber: String,
  pinCode: String
},
verifiedByAdmin: {
   type: Boolean, 
   default: false },

}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
