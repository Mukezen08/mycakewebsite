const dotenv = require("dotenv");
dotenv.config();

const dns = require("node:dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const authRoutes = require("./routes/authRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const couponRoutes = require("./routes/couponRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
// Connect MongoDB
connectDB();

const app = express();

// ==================== MIDDLEWARE ====================

app.use(cors());

app.use(express.json());

// ==================== ROUTES ====================

// Test Route
app.get("/", (req, res) => {
  res.send("Backend is working successfully!");
});

// APIs
app.use("/api/products", productRoutes);

app.use("/api/orders", orderRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/coupons", couponRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/reviews", reviewRoutes);

// ==================== SERVER ====================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});