const User = require("../models/User");
const Order = require("../models/Order");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters"
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({
      email: normalizedEmail
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      phone: phone || ""
    });

    res.status(201).json({
      message: "Registration successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Register error:", error);

    res.status(500).json({
      message: "Registration failed"
    });
  }
};


// LOGIN
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({
      email: normalizedEmail
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const passwordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Login failed"
    });
  }
};

// ===============================
// ADMIN - GET ALL CUSTOMERS
// ===============================
// ===============================
// ADMIN - GET ALL CUSTOMERS
// ===============================
const getAllCustomersAdmin = async (req, res) => {
    try {

        const customers = await User.find({
            role: "customer"
        })
        .select("-password")
        .lean();

        const Order = require("../models/Order");

        const customersWithStats = await Promise.all(
            customers.map(async (customer) => {

                const orders = await Order.find({
                    "customer.email": customer.email
                }).lean();

                const totalOrders = orders.length;

                const totalSpent = orders.reduce(
                    (sum, order) => {
                        return sum + (Number(order.total) || 0);
                    },
                    0
                );

                return {
                    ...customer,
                    totalOrders,
                    totalSpent
                };

            })
        );

        res.status(200).json(customersWithStats);

    } catch (error) {

        console.error(
            "Admin get customers error:",
            error
        );

        res.status(500).json({
            message: "Unable to load customers"
        });

    }
};
module.exports = {
    registerUser,   
    loginUser,
    getAllCustomersAdmin
};