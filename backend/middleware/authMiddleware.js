const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {

    const authHeader = req.headers.authorization;

    // Check Authorization header
    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        message: "Not authorized. No token provided."
      });
    }

    // Get token
    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Find logged-in user
    const user = await User.findById(
      decoded.userId
    ).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "User not found"
      });
    }

    // Attach user to request
    req.user = user;

    next();

  } catch (error) {

    console.error("Authentication error:", error.message);

    return res.status(401).json({
      message: "Not authorized. Invalid or expired token."
    });
  }
};
const adminOnly = (req, res, next) => {

    if (req.user && req.user.role === "admin") {
        next();
        return;
    }

    return res.status(403).json({
        message: "Admin access required"
    });
};
module.exports = {
  protect,
  adminOnly
};