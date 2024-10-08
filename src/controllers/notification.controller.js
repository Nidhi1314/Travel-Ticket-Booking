import { Notification } from "../models/notification.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendEmail } from "../utils/email.js";

export const createNotification = asyncHandler(async (req, res) => {
    const { user, message, type } = req.body;

    if (!user || !message) {
        throw new ApiError(400, "User and message are required");
    }

    const notification = await Notification.create({
        user,
        message,
        type,
    });

    await sendEmail({
        email: user.email, 
        subject: "New Notification",
        message: `You have a new notification: ${message}`,
        html: `<p>You have a new notification: ${message}</p>`, 
    });

    res.status(201).json(notification);
});

export const getNotifications = asyncHandler(async (req, res) => {
    const notifications = await Notification.find({ user: req.user._id })
        .sort({ createdAt: -1 }) 
        .exec();

    res.status(200).json("notifications");
});

export const markAsRead = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const notification = await Notification.findById(id);

    if (!notification) {
        throw new ApiError(404, "Notification not found");
    }

    if (notification.user.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You do not have permission to mark this notification as read");
    }

    notification.isRead = true;
    await notification.save();

    res.status(200).json(notification);
});

export const deleteNotification = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const notification = await Notification.findById(id);

    if (!notification) {
        throw new ApiError(404, "Notification not found");
    }

    if (notification.user.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You do not have permission to delete this notification");
    }

    await notification.deleteOne();

    res.status(200).json({ message: "Notification deleted successfully" });
});
