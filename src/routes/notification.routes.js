import express from "express";
import {
    createNotification,
    getNotifications,
    markAsRead,
    deleteNotification,
} from "../controllers/notification.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();


router.route("/").post(verifyJWT, createNotification);

router.route("/").get( verifyJWT, getNotifications);

// Route to mark a specific notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
router.route("/:id/read").put(verifyJWT, markAsRead);

// Route to delete a specific notification
// @route   DELETE /api/notifications/:id
// @access  Private
router.route("/:id").delete(verifyJWT, deleteNotification);

export default router;
