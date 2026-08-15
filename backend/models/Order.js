const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: String
    },

    name: {
      type: String,
      required: true
    },

    price: {
      type: Number,
      required: true
    },

    image: {
      type: String
    },

    quantity: {
      type: Number,
      required: true,
      default: 1
    }
  },
  {
    _id: false
  }
);

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true
    },

    customer: {
      firstName: {
        type: String,
        required: true
      },

      lastName: {
        type: String,
        default: ""
      },

      email: {
        type: String,
        required: true
      },

      phone: {
        type: String,
        required: true
      }
    },

    items: {
      type: [orderItemSchema],
      required: true
    },

    deliveryDate: {
      type: String,
      required: true
    },

    deliveryAddress: {
      type: String,
      required: true
    },

    specialInstructions: {
      type: String,
      default: ""
    },

    paymentMethod: {
      type: String,
      enum: ["upi", "card", "cod"],
      default: "upi"
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "COD"],
      default: "Pending"
    },
paymentId: {
  type: String,
  default: ""
},

razorpayOrderId: {
  type: String,
  default: ""
},

razorpaySignature: {
  type: String,
  default: ""
},
    subtotal: {
      type: Number,
      required: true
    },

    discount: {
      type: Number,
      default: 0
    },

    deliveryCharge: {
      type: Number,
      default: 50
    },

    total: {
      type: Number,
      required: true
    },

    status: {
      type: String,
      enum: [
        "Confirmed",
        "Preparing",
        "Out for Delivery",
        "Delivered",
        "Cancelled"
      ],
      default: "Confirmed"
    }
  },
  {
    timestamps: true    
  }
);

module.exports = mongoose.model("Order", orderSchema);