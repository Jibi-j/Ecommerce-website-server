const jwt = require('jsonwebtoken');

const authUser = (req, res, next) => {
  try {
    let token = null;
    
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ success: false, message: "User not authorized, token missing" });
    }

    //  Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Attach user info
    req.user = {
      _id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (error) {
    console.error("JWT Auth Error:", error.message);
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

module.exports = authUser;

