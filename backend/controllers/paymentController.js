const crypto = require("crypto");
const Razorpay = require("razorpay");

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

const createRazorpayOrder = async (req, res) => {
    console.log("===== CREATE RAZORPAY ORDER CALLED =====");
    console.log("Request body:", req.body);

    try {
        const { amount } = req.body;

        if (!amount) {
            console.log("Amount missing");

            return res.status(400).json({
                message: "Amount is required"
            });
        }

        const options = {
            amount: Math.round(Number(amount) * 100),
            currency: "INR",
            receipt: "receipt_" + Date.now()
        };

        console.log("Creating Razorpay order:", options);

        const order = await razorpay.orders.create(options);

        console.log("Razorpay order created:", order.id);

        return res.status(200).json(order);

    } catch (error) {
        console.error("RAZORPAY CREATE ORDER ERROR:", error);

        return res.status(500).json({
            message: error.message || "Unable to create Razorpay order"
        });
    }
};
const verifyPayment = async (req, res) => {

    console.log("===== VERIFY PAYMENT CALLED =====");
    console.log(req.body);

    try {

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;

        const generatedSignature = crypto
            .createHmac(
                "sha256",
                process.env.RAZORPAY_KEY_SECRET
            )
            .update(
                razorpay_order_id + "|" + razorpay_payment_id
            )
            .digest("hex");
console.log("Received Signature:", razorpay_signature);
console.log("Generated Signature:", generatedSignature);

if (generatedSignature !== razorpay_signature) {

    console.log("Signature Mismatch");

    return res.status(400).json({
        success: false,
        message: "Payment verification failed"
    });

}

        return res.status(200).json({
            success: true,
            message: "Payment verified successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Payment verification error"
        });

    }

};

module.exports = {
    createRazorpayOrder,
    verifyPayment
};