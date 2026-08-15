const express = require("express");
const mongoose = require("mongoose");

const Review = require("../models/Review");
const Product = require("../models/Product");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const router = express.Router();

/*
========================================
CUSTOMER - CREATE REVIEW
========================================
*/

router.post("/", async (req, res) => {

    try {

        const {
            customer,
            product,
            rating,
            comment
        } = req.body;

        if (!customer || !product || !rating || !comment) {
            return res.status(400).json({
                message: "All review fields are required"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(customer)) {
            return res.status(400).json({
                message: "Invalid customer ID"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(product)) {
            return res.status(400).json({
                message: "Invalid product ID"
            });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                message: "Rating must be between 1 and 5"
            });
        }

        const review = await Review.create({
            customer,
            product,
            rating,
            comment,
            status: "Pending"
        });

        res.status(201).json({
            message: "Review submitted successfully",
            review
        });

    } catch (error) {

        console.error("Create review error:", error);

        res.status(500).json({
            message: "Unable to submit review"
        });
    }
});


/*
========================================
GET APPROVED REVIEWS FOR PRODUCT
========================================
*/

router.get("/product/:productId", async (req, res) => {

    try {

        const { productId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                message: "Invalid product ID"
            });
        }

        const reviews = await Review.find({
            product: productId,
            status: "Approved"
        })
        .populate("customer", "name")
        .sort({ createdAt: -1 });

        res.json(reviews);

    } catch (error) {

        console.error("Get product reviews error:", error);

        res.status(500).json({
            message: "Unable to load reviews"
        });
    }
});

/*
========================================
ADMIN - GET ALL REVIEWS
========================================
*/

router.get(
    "/admin/all",
    protect,
    adminOnly,
    async (req, res) => {

    try {

        const reviews = await Review.find()
            .populate("customer", "name email")
            .populate("product", "name image")
            .sort({ createdAt: -1 });

        res.json(reviews);

    } catch (error) {

        console.error("Admin get reviews error:", error);

        res.status(500).json({
            message: "Unable to load reviews"
        });
    }
});


/*
========================================
ADMIN - UPDATE REVIEW STATUS
========================================
*/

router.put(
    "/admin/:reviewId/status",
    protect,
    adminOnly,
    async (req, res) => {

    try {

        const { reviewId } = req.params;
        const { status } = req.body;

        if (!mongoose.Types.ObjectId.isValid(reviewId)) {
            return res.status(400).json({
                message: "Invalid review ID"
            });
        }

        if (!["Pending", "Approved", "Hidden"].includes(status)) {
            return res.status(400).json({
                message: "Invalid review status"
            });
        }

        const review = await Review.findByIdAndUpdate(
            reviewId,
            { status },
            { new: true }
        );

        if (!review) {
            return res.status(404).json({
                message: "Review not found"
            });
        }

        res.json({
            message: "Review status updated successfully",
            review
        });

    } catch (error) {

        console.error("Update review status error:", error);

        res.status(500).json({
            message: "Unable to update review status"
        });
    }
});


/*
========================================
ADMIN - DELETE REVIEW
========================================
*/

router.delete(
    "/admin/:reviewId",
    protect,
    adminOnly,
    async (req, res) => {

    try {

        const { reviewId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(reviewId)) {
            return res.status(400).json({
                message: "Invalid review ID"
            });
        }

        const review = await Review.findByIdAndDelete(reviewId);

        if (!review) {
            return res.status(404).json({
                message: "Review not found"
            });
        }

        res.json({
            message: "Review deleted successfully"
        });

    } catch (error) {

        console.error("Delete review error:", error);

        res.status(500).json({
            message: "Unable to delete review"
        });
    }
});
module.exports = router;