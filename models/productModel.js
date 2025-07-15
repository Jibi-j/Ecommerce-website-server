const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
   title: {
      type: String,
      required: [true, 'Product title is required']
   },
   description: {
      type: String
   },
   price: {
      type: Number,
      required: [true, 'Price is required']
   },
   stock: {
      type: Number,
      required: true,
      default: 0
   },
   category: {
      type: String,
      default: null
   },
   image: {
      type: String
   },
   sizes: {
      type: [String],
      enum: ['S', 'M', 'L', 'XL'],
      default: undefined
   },
   rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
   },
   sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
   }
}, {
   timestamps: true

})
module.exports = mongoose.model('Product', productSchema)