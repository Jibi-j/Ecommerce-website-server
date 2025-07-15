 const jwt = require('jsonwebtoken');

const authUser = (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({ message: "User not authorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.user = {
      _id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authUser;
