const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authSeller = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const seller = await User.findById(decoded.id);
    if (!seller || seller.role !== 'seller') {
      return res.status(403).json({ message: 'Access denied' });
    }

    req.user = seller;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = { authSeller };
