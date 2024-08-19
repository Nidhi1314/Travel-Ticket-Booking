import express from "express";
import { createPayment, getPaymentDetails, getUserPayments, refundPayment } from "../controllers/payment.controller.js";
import { protect } from "../middleware/authMiddleware.js"; // Assuming you have authentication middleware

const router = express.Router();

router.route("/").post(protect, createPayment);
router.route("/:paymentId").get(protect, getPaymentDetails);
router.route("/user/payments").get(protect, getUserPayments);
router.route("/:paymentId/refund").post(protect, refundPayment);

export default router;
