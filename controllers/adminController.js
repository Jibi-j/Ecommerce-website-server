const User = require('../models/userModel')
const Product = require('../models/productModel');
const Order = require('../models/orderModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const createToken = require('../utils/generateToken');

//login
const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await User.findOne({ email });

    // Check if admin exists and has 'admin' role
    if (!admin || admin.role !== "admin") {
      return res.status(401).json({ message: "Admin not found or unauthorized" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Generate token
    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Render requires this
      sameSite: "None", // Important for cross-origin cookies
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    // Send admin details (without password)
    const { password: _, ...adminData } = admin.toObject();

    res.status(200).json({
      message: "Admin login successful",
      admin: adminData,
      token,
    });

  } catch (error) {
    console.error("Admin Login Error:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};


//logout
const adminLogout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "None",
      secure: true, 
    });

    return res.status(200).json({
      success: true,
      message: "Admin logged out successfully",
    });
  } catch (error) {
    console.error("Logout Error:", error);
    return res.status(500).json({
      success: false,
      error: "Something went wrong",
    });
  }
};


 //delete
 const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};

//get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); 
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};


//Get Products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('sellerId', 'name email');
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

//delete prodcut
const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    const deleted = await Product.findByIdAndDelete(productId);
    if (!deleted) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
};

//all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email")
      .populate("products.productId", "title image price");

    res.status(200).json({ success: true, orders });
  } catch (err) {
    console.error("Admin getAllOrders error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
};

const verifyOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.status === "Verified") {
      return res.status(400).json({ success: false, message: "Order already verified" });
    }

    order.status = "Verified";
    order.verifiedByAdmin = true;

    await order.save();

    res.status(200).json({ success: true, message: "Order verified", order });
  } catch (err) {
    console.error("Admin verifyOrder error:", err);
    res.status(500).json({ success: false, message: "Order verification failed" });
  }
};


module.exports = { adminLogin, adminLogout,deleteUser, getAllUsers,getAllProducts, deleteProduct, getAllOrders, verifyOrder};