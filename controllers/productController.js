const Product = require('../models/productModel');

// Get all products 
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('sellerId', 'name email');
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch products', error: error.message });
  }
};

// Get product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('sellerId', 'name email');
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching product', error: error.message });
  }
};


// Get products by category
const getProductsByCategory = async (req, res) => {
  try {
    const categoryParam = req.params.category.toLowerCase();
    const products = await Product.find({ category: categoryParam });
    
    if (!products.length) {
      return res.status(404).json({ success: false, message: 'No products found in this category' });
    }
    
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching products by category',
      error: error.message,
    });
  }
};


module.exports = {getAllProducts,getProductById,getProductsByCategory};
