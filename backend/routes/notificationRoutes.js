const express = require("express");
const router = express.Router();

const Notification = require("../models/Notification");
const { protect } = require("../middleware/authMiddleware");


// GET CURRENT USER NOTIFICATIONS
router.get("/", protect, async (req, res) => {
    try {

        const notifications = await Notification.find({
            user: req.user._id
        })
        .sort({ createdAt: -1 })
        .limit(30);

        res.status(200).json(notifications);

    } catch (error) {

        console.error(
            "Get notifications error:",
            error
        );

        res.status(500).json({
            message: "Unable to load notifications"
        });

    }
});


// MARK ALL AS READ
router.put("/read-all", protect, async (req, res) => {
    try {

        await Notification.updateMany(
            {
                user: req.user._id,
                isRead: false
            },
            {
                $set: {
                    isRead: true
                }
            }
        );

        res.status(200).json({
            message: "Notifications marked as read"
        });

    } catch (error) {

        console.error(
            "Mark all notifications error:",
            error
        );

        res.status(500).json({
            message: "Unable to mark notifications as read"
        });

    }
});


// MARK ONE AS READ
router.put("/:id/read", protect, async (req, res) => {
    try {

        const notification =
            await Notification.findOneAndUpdate(
                {
                    _id: req.params.id,
                    user: req.user._id
                },
                {
                    $set: {
                        isRead: true
                    }
                },
                {
                    new: true
                }
            );

        if (!notification) {
            return res.status(404).json({
                message: "Notification not found"
            });
        }

        res.status(200).json(notification);

    } catch (error) {

        console.error(
            "Mark notification error:",
            error
        );

        res.status(500).json({
            message: "Unable to mark notification as read"
        });

    }
});


module.exports = router;