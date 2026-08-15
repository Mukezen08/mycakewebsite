const express = require("express");

const router = express.Router();

const {
    protect,
    adminOnly
} = require("../middleware/authMiddleware");

const {
    getAllCouponsAdmin,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    validateCoupon
} = require("../controllers/couponController");

// =====================================
// CUSTOMER - VALIDATE COUPON
// =====================================

router.post(
    "/validate",
    validateCoupon
);
// =====================================
// ADMIN - GET ALL COUPONS
// =====================================

router.get(
    "/admin/all",
    protect,
    adminOnly,
    getAllCouponsAdmin
);


// =====================================
// ADMIN - CREATE COUPON
// =====================================

router.post(
    "/",
    protect,
    adminOnly,
    createCoupon
);


// =====================================
// ADMIN - UPDATE COUPON
// =====================================

router.put(
    "/:id",
    protect,
    adminOnly,
    updateCoupon
);


// =====================================
// ADMIN - DELETE COUPON
// =====================================

router.delete(
    "/:id",
    protect,
    adminOnly,
    deleteCoupon
);


module.exports = router;