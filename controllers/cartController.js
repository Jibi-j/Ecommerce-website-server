const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

// Get Cart
const getCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ userId }).populate('items.productId');

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Cart retrieved successfully',
      cart,
    });
  } catch (error) {
    console.error('Error getting cart:', error.message);
    return res.status(500).json({ success: false, message: 'Error getting cart' });
  }
};

// Add to Cart
const addToCart = async (req, res) => {
  try {
    const { productId, quantity, size } = req.body;
    const userId = req.user._id;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const categoriesRequiringSize = ['Men', 'Women'];
    if (categoriesRequiringSize.includes(product.category) && !size) {
      return res.status(400).json({ success: false, message: "Size is required for clothing items" });
    }

    const itemQuantity = quantity || 1;
    const price = product.price;
    const totalprice = price * itemQuantity;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(item =>
      item.productId.toString() === productId &&
      (item.size === size || (!item.size && !size)) 
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += itemQuantity;
      cart.items[existingItemIndex].totalprice =
        cart.items[existingItemIndex].quantity * price;
    } else {
      cart.items.push({
        productId,
        quantity: itemQuantity,
        price,
        totalprice,
        ...(size && { size }) 
      });
    }

    await cart.save();

    return res
      .status(200)
      .json({ success: true, message: "Product added to cart", cart });

  } catch (error) {
    console.error("Error adding to cart:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Error adding to cart", error: error.message });
  }
};


// Remove from Cart
const removeFromCart = async (req, res) => {
  try {
    const productId = req.params.productId;
    const userId = req.user._id;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    const updatedItems = cart.items.filter(item => item.productId.toString() !== productId);

    if (updatedItems.length === cart.items.length) {
      return res.status(404).json({ success: false, message: "Product not found in cart" });
    }

    cart.items = updatedItems;
    await cart.save();

    return res.status(200).json({ success: true, message: "Product removed from cart", cart });
  } catch (error) {
    console.error("Error removing from cart:", error.message);
    return res.status(500).json({ success: false, message: "Error removing from cart", error: error.message });
  }
};

// Clear Cart
const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOneAndUpdate(
      { userId },
      { $set: { items: [] } },
      { new: true }
    );

    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    return res.status(200).json({ success: true, message: "Cart cleared successfully", cart });
  } catch (error) {
    console.error('Error clearing cart:', error.message);
    return res.status(500).json({ success: false, message: 'Error clearing cart', error: error.message });
  }
};

module.exports = { addToCart, removeFromCart, getCart, clearCart };
