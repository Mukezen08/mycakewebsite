const express = require("express");

const {
    registerUser,
    loginUser,
    getAllCustomersAdmin
} = require("../controllers/authController");
const {
    protect,
    adminOnly
} = require("../middleware/authMiddleware");

const router = express.Router();

// Register new customer
router.post("/register", registerUser);

// Login customer
router.post("/login", loginUser);
// Admin - Get all customers
router.get(
    "/admin/users",
    protect,
    adminOnly,
    getAllCustomersAdmin
);

module.exports = router;