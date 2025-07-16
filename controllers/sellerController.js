const User = require('../models/userModel');
const Order = require('../models/orderModel')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { cloudinaryInstance } = require('../config/cloudinary');
const Product = require('../models/productModel');


// register
const sellerRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if seller already exists
    const existingSeller = await User.findOne({ email });
    if (existingSeller) {
      return res.status(400).json({ message: "Seller already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new seller
    const newSeller = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'seller'
    });

    res.status(201).json({
      message: "Seller registered successfully",
      seller: {
        id: newSeller._id,
        name: newSeller.name,
        email: newSeller.email,
        role: newSeller.role
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
};


//login
const sellerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const seller = await User.findOne({ email, role: 'seller' });
    if (!seller) return res.status(404).json({ message: 'Seller not found' });

    const isMatch = await bcrypt.compare(password, seller.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: seller._id, role: seller.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '1d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'None',
      maxAge: 24 * 60 * 60 * 1000
    });


    res.json({
      message: 'Login successful',
      token,
      seller: {
        id: seller._id,
        name: seller.name,
        email: seller.email
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Login error', error: err.message });
  }
};

//profile
const sellerProfile = async (req, res) => {
  try {
    const seller = await User.findById(req.user.id).select('-password');
    if (!seller) return res.status(404).json({ message: "Seller not found" });
    res.json({ data: seller, message: "Seller profile retrieved" });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving profile", error: error.message });
  }
};
// Update Profile
const updateSellerProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      { new: true }
    ).select('-password');
    res.json({ message: 'Profile updated', data: updated });
  } catch (err) {
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
};


// logout
const sellerLogout = async (req, res) => {
  try {
    res.clearCookie("token", {
  httpOnly: true,
  sameSite: "None",
  secure: true,
});
    res.status(200).json({ success: true, message: "Seller logged out successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Logout failed", error: error.message });
  }
};

//create product
const createProduct = async (req, res) => {
  try {
    const { title, description, price, stock, category, sizes, rating } = req.body;

    if (!title || !description || !price || !stock || !category) {
      return res.status(400).json({ error: "Required fields are missing" });
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "Product image is required" });
    }

    const cloudinaryResponse = await cloudinaryInstance.uploader.upload(file.path);

    const sellerId = req.user.id;

    const newProduct = new Product({
      title,
      description,
      price,
      stock,
      category,
      rating: rating || 0,
      image: cloudinaryResponse.secure_url,
      sellerId: req.user._id,
      sizes: sizes ? JSON.parse(sizes) : undefined
    });

    await newProduct.save();

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: newProduct
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Product creation failed",
      error: error.message
    });
  }
};

//getall products

const getAllProducts = async (req, res) => {
  try {
    const sellerId = req.user._id;
    const products = await Product.find({ sellerId });

    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message,
    });
  }
};

//getproduct by id
const getproductById = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const productId = req.params.id;

    const product = await Product.findOne({ _id: productId, sellerId });

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found or not owned by you" });
    }

    res.status(200).json({ success: true, data: product });

  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching product", error: error.message });
  }
};


//update product
const updateProduct = async (req, res) => {
  try {
    const { name, description, price } = req.body;

    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, sellerId: req.user._id },
      { name, description, price },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found or unauthorized" });
    }

    res.status(200).json({ success: true, message: "Product updated successfully", product });
  } catch (error) {
    res.status(500).json({ success: false, message: "Product update failed", error: error.message });
  }
};

const getSellerOrders = async (req, res) => {
  try {
    const sellerId = req.user._id;

    const orders = await Order.find({ "products.productId": { $exists: true } })
      .populate("userId", "name email")
      .populate("products.productId", "title sellerId")
      .lean();

    const filteredOrders = orders
      .map(order => {
        const sellerProducts = order.products.filter(p => {
          return p.productId && p.productId.sellerId?.toString() === sellerId.toString();
        });

        if (sellerProducts.length > 0) {
          return {
            ...order,
            products: sellerProducts
          };
        }
        return null;
      })
      .filter(Boolean);

    res.status(200).json({ success: true, orders: filteredOrders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to get orders", error: error.message });
  }
};

module.exports = { sellerRegister, sellerLogin, sellerProfile, updateSellerProfile, sellerLogout, createProduct, getAllProducts, getproductById, updateProduct, getSellerOrders };




