const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authAdmin = async (req, res, next) => {
  try {
    let token = req.headers.authorization?.split(" ")[1];
    if (!token) token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const admin = await User.findById(decoded.id);

    if (!admin || admin.role !== "admin" || admin.email !== "admin123@gmail.com") {
      return res.status(403).json({ message: "Forbidden: Only specific admin allowed" });
    }

    req.user = admin;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authAdmin;


