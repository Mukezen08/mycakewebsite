const express = require("express");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const router = express.Router();

const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  deleteOrder,
  getAllOrdersAdmin,
  trackOrder
} = require("../controllers/orderController");


// Create new order
// Create new order
router.post(
    "/",
    protect,
    createOrder
);

// Get all orders
router.get("/", protect, getOrders);
// Admin - Get all customer orders
router.get("/admin/all", protect, adminOnly, getAllOrdersAdmin);
// Track order using YNB order ID
router.get("/track/:orderId", protect, trackOrder);
// Get single order
router.get("/:id", protect, getOrderById);
// Customer - Cancel own order
router.put(
  "/:id/cancel",
  protect,
  cancelOrder
);
// Update order status - ADMIN ONLY
router.put(
  "/:id/status",
  protect,
  adminOnly,
  updateOrderStatus
);

// Delete order - ADMIN ONLY
router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteOrder
);


module.exports = router;