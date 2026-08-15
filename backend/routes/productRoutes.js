const express = require("express");

const router = express.Router();

const {
    protect,
    adminOnly
} = require("../middleware/authMiddleware");

const {
    getProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct,
    updateProductStock
} = require("../controllers/productController");


// =========================
// PUBLIC
// =========================

// Get all products
router.get("/", getProducts);

// Get single product
router.get("/:id", getProductById);


// =========================
// ADMIN ONLY
// =========================

// Add product
router.post(
    "/",
    protect,
    adminOnly,
    addProduct
);

// Update product
router.put(
    "/:id/stock",
    protect,
    adminOnly,
    updateProductStock
);
router.put(
    "/:id",
    protect,
    adminOnly,
    updateProduct
);
// Delete product
router.delete(
    "/:id",
    protect,
    adminOnly,
    deleteProduct
);


module.exports = router;