const Order = require("../models/Order");
const Product = require("../models/Product");
const Notification = require("../models/Notification");
const User = require("../models/User");
// ===============================
// CREATE NEW ORDER
// ===============================

const createOrder = async (req, res) => {
   
    const session = await Order.startSession();

    try {

        let createdOrder;

        await session.withTransaction(async () => {

            const {
                orderId,
                customer,
                items,
                deliveryDate,
                deliveryAddress,
                specialInstructions,
                paymentMethod,
                paymentStatus,
                paymentId,
                razorpayOrderId,
                razorpaySignature,
                subtotal,
                discount,
                deliveryCharge,
                total
            } = req.body;


            // ===============================
            // BASIC VALIDATION
            // ===============================

            if (
                !orderId ||
                !customer ||
                !customer.firstName ||
                !customer.email ||
                !customer.phone ||
                !items ||
                items.length === 0 ||
                !deliveryDate ||
                !deliveryAddress
            ) {
                throw new Error(
                    "Please provide all required order details"
                );
            }


            // ===============================
            // DUPLICATE ORDER CHECK
            // ===============================

            const existingOrder =
                await Order.findOne({ orderId }).session(session);

            if (existingOrder) {
                throw new Error("Order already exists");
            }


            // ===============================
            // VALIDATE STOCK
            // ===============================

            for (const item of items) {

                if (!item.productId) {
                    throw new Error(
                        `Product ID missing for ${item.name}`
                    );
                }

                if (
                    !Number.isInteger(item.quantity) ||
                    item.quantity <= 0
                ) {
                    throw new Error(
                        `Invalid quantity for ${item.name}`
                    );
                }

                const product =
                    await Product.findById(
                        item.productId
                    ).session(session);

                if (!product) {
                    throw new Error(
                        `Product not found: ${item.name}`
                    );
                }

                if (product.stock < item.quantity) {
                    throw new Error(
                        `${product.name} has only ${product.stock} item(s) available.`
                    );
                }
            }


            // ===============================
            // DECREASE STOCK
            // ===============================

         for (const item of items) {

    const updatedProduct =
        await Product.findOneAndUpdate(
            {
                _id: item.productId,
                stock: {
                    $gte: item.quantity
                }
            },
            {
                $inc: {
                    stock: -item.quantity
                }
            },
            {
                new: true,
                session
            }
        );

    if (!updatedProduct) {
        throw new Error(
            `Stock changed while placing the order for ${item.name}. Please try again.`
        );
    }
}
            // ===============================
            // SECURE CUSTOMER
            // ===============================

            const secureCustomer = {
                ...customer,
                email: req.user.email
            };


            // ===============================
            // CREATE ORDER
            // ===============================

            const orders =
                await Order.create(
                    [
                        {
                            orderId,
                            customer: secureCustomer,
                            items,
                            deliveryDate,
                            deliveryAddress,
                            specialInstructions,
                            paymentMethod,
                            paymentStatus,
                            paymentId,
                            razorpayOrderId,
                            razorpaySignature,
                            subtotal,
                            discount,
                            deliveryCharge,
                            total
                        }
                    ],
                    { session }
                );

            createdOrder = orders[0];

        });
        // ===============================
        // CREATE ORDER NOTIFICATION
        // ===============================

        await Notification.create({
            user: req.user._id,
            title: "Order Placed",
            message: `Your order ${createdOrder.orderId} has been placed successfully.`,
            type: "order_placed",
            order: createdOrder._id
        });

        // ===============================
        // SUCCESS
        // ===============================

        res.status(201).json({
            message: "Order placed successfully",
            order: createdOrder
        });


    } catch (error) {

        console.error(
            "Create order error:",
            error
        );

        const status =
            error.message === "Order already exists"
                ? 400
                : 400;

        res.status(status).json({
            message: error.message
        });

    } finally {

        await session.endSession();

    }
};


// ===============================
// GET ALL ORDERS
// ===============================
const getOrders = async (req, res) => {
  try {

    // Logged-in user's email comes from verified JWT
    const email = req.user.email;
 

    const orders = await Order.find({
      "customer.email": email
    }).sort({
      createdAt: -1
    });

    res.status(200).json(orders);

  } catch (error) {

    console.error("Get orders error:", error);

    res.status(500).json({
      message: error.message
    });
  }
};
// ===============================
// GET SINGLE ORDER
// ===============================
const getOrderById = async (req, res) => {
  try {

    const order = await Order.findOne({
      _id: req.params.id,
      "customer.email": req.user.email
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    res.status(200).json(order);

  } catch (error) {

    console.error("Get single order error:", error);

    res.status(500).json({
      message: error.message
    });

  }
};

// ===============================
// UPDATE ORDER STATUS
// ===============================

const updateOrderStatus = async (req, res) => {
    try {

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        const newStatus = req.body.status;

        if (!newStatus) {
            return res.status(400).json({
                message: "Order status is required"
            });
        }

        // Update order status
        order.status = newStatus;

        await order.save();

        // Find the customer who owns this order
        const customer = await User.findOne({
            email: order.customer.email
        });

        // Create notification for that customer
        if (customer) {

            await Notification.create({
                user: customer._id,
                title: "Order Status Updated",
                message: `Your order ${order.orderId} is now ${newStatus}.`,
                type: "order_status",
                order: order._id
            });

        }

        res.status(200).json({
            message: "Order status updated",
            order
        });

    } catch (error) {

        console.error(
            "Update order status error:",
            error
        );

        res.status(500).json({
            message: error.message
        });

    }
};
// ===============================
// CUSTOMER CANCEL ORDER
// ===============================
const cancelOrder = async (req, res) => {
  try {

    const order = await Order.findOne({
      _id: req.params.id,
      "customer.email": req.user.email
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    // Don't allow cancellation after dispatch
    if (
      order.status === "Out for Delivery" ||
      order.status === "Delivered"
    ) {
      return res.status(400).json({
        message: "Order can no longer be cancelled"
      });
    }

    // Already cancelled
    if (order.status === "Cancelled") {
      return res.status(400).json({
        message: "Order already cancelled"
      });
    }

    order.status = "Cancelled";

    await order.save();

    res.status(200).json({
      message: "Order cancelled successfully",
      order
    });

  } catch (error) {

    console.error("Cancel order error:", error);

    res.status(500).json({
      message: error.message
    });

  }
};

// ===============================
// DELETE ORDER
// ===============================
const deleteOrder = async (req, res) => {
  try {

    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    res.status(200).json({
      message: "Order deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};

// ===============================
// ADMIN - GET ALL CUSTOMER ORDERS
// ===============================
const getAllOrdersAdmin = async (req, res) => {
  try {

    const orders = await Order.find({})
      .sort({ createdAt: -1 });

    res.status(200).json(orders);

  } catch (error) {

    console.error("Admin get orders error:", error);

    res.status(500).json({
      message: error.message
    });

  }
};
// ===============================
// TRACK ORDER BY ORDER ID
// ===============================
const trackOrder = async (req, res) => {
  try {

    const orderId = req.params.orderId;

    let order;

    // Admin can track any order
    if (req.user.role === "admin") {

      order = await Order.findOne({
        orderId: orderId
      });

    } else {

      // Customer can track only orders belonging to their email
      order = await Order.findOne({
        orderId: orderId,
        "customer.email": req.user.email
      });

    }

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    res.status(200).json({
      orderId: order.orderId,
      items: order.items,
      status: order.status,
      deliveryDate: order.deliveryDate,
      createdAt: order.createdAt
    });

  } catch (error) {

    console.error("Track order error:", error);

    res.status(500).json({
      message: "Unable to track order"
    });
  }
};
module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  deleteOrder,
  getAllOrdersAdmin,
  trackOrder
};