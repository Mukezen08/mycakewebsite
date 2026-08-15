const Coupon = require("../models/Coupon");


// =====================================
// ADMIN - GET ALL COUPONS
// =====================================

const getAllCouponsAdmin = async (req, res) => {

    try {

        const coupons = await Coupon.find()
            .sort({ createdAt: -1 });

        res.status(200).json(coupons);

    } catch (error) {

        console.error(
            "Get coupons error:",
            error
        );

        res.status(500).json({
            message: "Unable to load coupons"
        });

    }
};


// =====================================
// ADMIN - CREATE COUPON
// =====================================

const createCoupon = async (req, res) => {

    try {

        const {
            code,
            discountType,
            discountValue,
            minimumOrderAmount,
            maximumDiscount,
            usageLimit,
            expiresAt,
            active
        } = req.body;


        if (
            !code ||
            !discountType ||
            discountValue === undefined
        ) {

            return res.status(400).json({
                message:
                    "Code, discount type and discount value are required"
            });

        }


        const normalizedCode =
            code.trim().toUpperCase();


        // Check duplicate coupon

        const existingCoupon =
            await Coupon.findOne({
                code: normalizedCode
            });

        if (existingCoupon) {

            return res.status(400).json({
                message: "Coupon code already exists"
            });

        }


        // Validate discount

        if (
            !Number.isFinite(Number(discountValue)) ||
            Number(discountValue) <= 0
        ) {

            return res.status(400).json({
                message:
                    "Discount value must be greater than 0"
            });

        }


        // Percentage cannot exceed 100

        if (
            discountType === "percentage" &&
            Number(discountValue) > 100
        ) {

            return res.status(400).json({
                message:
                    "Percentage discount cannot exceed 100"
            });

        }


        const coupon = await Coupon.create({

            code: normalizedCode,

            discountType,

            discountValue:
                Number(discountValue),

            minimumOrderAmount:
                Number(minimumOrderAmount || 0),

            maximumDiscount:
                maximumDiscount === "" ||
                maximumDiscount === null ||
                maximumDiscount === undefined
                    ? null
                    : Number(maximumDiscount),

            usageLimit:
                usageLimit === "" ||
                usageLimit === null ||
                usageLimit === undefined
                    ? null
                    : Number(usageLimit),

            expiresAt:
                expiresAt || null,

            active:
                active !== false

        });


        res.status(201).json({

            message:
                "Coupon created successfully",

            coupon

        });


    } catch (error) {

        console.error(
            "Create coupon error:",
            error
        );

        res.status(500).json({
            message: error.message
        });

    }
};


// =====================================
// ADMIN - UPDATE COUPON
// =====================================

// =====================================
// ADMIN - UPDATE COUPON
// =====================================

const updateCoupon = async (req, res) => {

    try {

        const {
            code,
            discountType,
            discountValue,
            minimumOrderAmount,
            maximumDiscount,
            usageLimit,
            expiresAt,
            active
        } = req.body;


        // Build update object only with
        // fields actually sent by frontend

        const updateData = {};


        // CODE

        if (code !== undefined) {

            updateData.code =
                code.trim().toUpperCase();

        }


        // DISCOUNT TYPE

        if (discountType !== undefined) {

            updateData.discountType =
                discountType;

        }


        // DISCOUNT VALUE

        if (discountValue !== undefined) {

            const value =
                Number(discountValue);

            if (
                !Number.isFinite(value) ||
                value <= 0
            ) {

                return res.status(400).json({
                    message:
                        "Discount value must be greater than 0"
                });

            }

            updateData.discountValue =
                value;

        }


        // PERCENTAGE VALIDATION

        if (
            updateData.discountType === "percentage" &&
            updateData.discountValue !== undefined &&
            updateData.discountValue > 100
        ) {

            return res.status(400).json({
                message:
                    "Percentage discount cannot exceed 100"
            });

        }


        // MINIMUM ORDER

        if (minimumOrderAmount !== undefined) {

            const value =
                Number(minimumOrderAmount);

            if (
                !Number.isFinite(value) ||
                value < 0
            ) {

                return res.status(400).json({
                    message:
                        "Minimum order amount is invalid"
                });

            }

            updateData.minimumOrderAmount =
                value;

        }


        // MAXIMUM DISCOUNT

        if (maximumDiscount !== undefined) {

            if (
                maximumDiscount === "" ||
                maximumDiscount === null
            ) {

                updateData.maximumDiscount = null;

            } else {

                const value =
                    Number(maximumDiscount);

                if (
                    !Number.isFinite(value) ||
                    value < 0
                ) {

                    return res.status(400).json({
                        message:
                            "Maximum discount is invalid"
                    });

                }

                updateData.maximumDiscount =
                    value;

            }

        }


        // USAGE LIMIT

        if (usageLimit !== undefined) {

            if (
                usageLimit === "" ||
                usageLimit === null
            ) {

                updateData.usageLimit = null;

            } else {

                const value =
                    Number(usageLimit);

                if (
                    !Number.isFinite(value) ||
                    value < 1
                ) {

                    return res.status(400).json({
                        message:
                            "Usage limit is invalid"
                    });

                }

                updateData.usageLimit =
                    value;

            }

        }


        // EXPIRY DATE

        if (expiresAt !== undefined) {

            updateData.expiresAt =
                expiresAt || null;

        }


        // ACTIVE / INACTIVE

        if (active !== undefined) {

            updateData.active =
                Boolean(active);

        }


        const coupon =
            await Coupon.findByIdAndUpdate(
                req.params.id,
                updateData,
                {
                    new: true,
                    runValidators: true
                }
            );


        if (!coupon) {

            return res.status(404).json({
                message:
                    "Coupon not found"
            });

        }


        res.status(200).json({

            message:
                "Coupon updated successfully",

            coupon

        });


    } catch (error) {

        console.error(
            "Update coupon error:",
            error
        );

        res.status(500).json({
            message:
                error.message
        });

    }

};


// =====================================
// ADMIN - DELETE COUPON
// =====================================

const deleteCoupon = async (req, res) => {

    try {

        const coupon =
            await Coupon.findByIdAndDelete(
                req.params.id
            );


        if (!coupon) {

            return res.status(404).json({
                message: "Coupon not found"
            });

        }


        res.status(200).json({

            message:
                "Coupon deleted successfully"

        });


    } catch (error) {

        console.error(
            "Delete coupon error:",
            error
        );

        res.status(500).json({
            message: error.message
        });

    }
};
// =====================================
// CUSTOMER - VALIDATE COUPON
// =====================================

const validateCoupon = async (req, res) => {

    try {

        const {
            code,
            orderAmount
        } = req.body;


        // -------------------------
        // BASIC VALIDATION
        // -------------------------

        if (!code) {

            return res.status(400).json({
                message: "Coupon code is required"
            });

        }


        const amount = Number(orderAmount);


        if (
            !Number.isFinite(amount) ||
            amount <= 0
        ) {

            return res.status(400).json({
                message: "Invalid order amount"
            });

        }


        // -------------------------
        // FIND COUPON
        // -------------------------

        const coupon =
            await Coupon.findOne({
                code: code.trim().toUpperCase()
            });


        if (!coupon) {

            return res.status(404).json({
                message: "Invalid coupon code"
            });

        }


        // -------------------------
        // CHECK ACTIVE
        // -------------------------

        if (!coupon.active) {

            return res.status(400).json({
                message: "This coupon is inactive"
            });

        }


        // -------------------------
        // CHECK EXPIRY
        // -------------------------

        if (
            coupon.expiresAt &&
            new Date(coupon.expiresAt) <= new Date()
        ) {

            return res.status(400).json({
                message: "This coupon has expired"
            });

        }


        // -------------------------
        // CHECK USAGE LIMIT
        // -------------------------

        if (
            coupon.usageLimit !== null &&
            coupon.usageLimit !== undefined &&
            coupon.usedCount >= coupon.usageLimit
        ) {

            return res.status(400).json({
                message: "This coupon usage limit has been reached"
            });

        }


        // -------------------------
        // CHECK MINIMUM ORDER
        // -------------------------

        if (
            amount < coupon.minimumOrderAmount
        ) {

            return res.status(400).json({
                message:
                    `Minimum order amount is ₹${coupon.minimumOrderAmount}`
            });

        }


        // -------------------------
        // CALCULATE DISCOUNT
        // -------------------------

        let discountAmount = 0;


        if (
            coupon.discountType === "percentage"
        ) {

            discountAmount =
                (amount * coupon.discountValue) / 100;

        } else {

            discountAmount =
                coupon.discountValue;

        }


        // -------------------------
        // MAXIMUM DISCOUNT
        // -------------------------

        if (
            coupon.maximumDiscount !== null &&
            coupon.maximumDiscount !== undefined
        ) {

            discountAmount =
                Math.min(
                    discountAmount,
                    coupon.maximumDiscount
                );

        }


        // Discount cannot exceed order amount

        discountAmount =
            Math.min(
                discountAmount,
                amount
            );


        // Round to 2 decimals

        discountAmount =
            Math.round(
                discountAmount * 100
            ) / 100;


        const finalAmount =
            Math.max(
                0,
                amount - discountAmount
            );


        // -------------------------
        // RESPONSE
        // -------------------------

        res.status(200).json({

            message: "Coupon applied successfully",

            coupon: {
                id: coupon._id,
                code: coupon.code,
                discountType: coupon.discountType,
                discountValue: coupon.discountValue
            },

            orderAmount: amount,

            discountAmount,

            finalAmount

        });


    } catch (error) {

        console.error(
            "Validate coupon error:",
            error
        );

        res.status(500).json({
            message:
                "Unable to validate coupon"
        });

    }

};

module.exports = {

    getAllCouponsAdmin,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    validateCoupon

};