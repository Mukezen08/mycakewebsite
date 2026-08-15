const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
    createRazorpayOrder,
    verifyPayment
} = require("../controllers/paymentController");

// Create Razorpay order
router.post(
    "/create-order",
    protect,
    createRazorpayOrder
);

// Verify Razorpay payment
router.post(
    "/verify-payment",
    protect,
    verifyPayment
);

module.exports = router;