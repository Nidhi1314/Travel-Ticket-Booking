import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Payment } from "../models/payment.model.js";
import { Booking } from "../models/booking.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { processPayment, processRefund } from "../utils/paymentGateway.js"; // Assuming you have a payment gateway utility

// Create a Payment
const createPayment = asyncHandler(async (req, res) => {
    const { bookingId, userId, paymentMethod } = req.body;

    // Validate required fields
    if (!bookingId || !userId || !paymentMethod) {
        throw new ApiError(400, "Booking ID, user ID, and payment method are required");
    }

    // Check if the booking exists
    const booking = await Booking.findById(bookingId);
    if (!booking) {
        throw new ApiError(404, "Booking not found");
    }

    // Ensure the user is the owner of the booking
    if (booking.user.toString() !== userId.toString()) {
        throw new ApiError(403, "You are not authorized to make a payment for this booking");
    }

    // Calculate the payment amount (assuming booking has a totalPrice field)
    const amount = booking.totalPrice;

    // Process the payment via a payment gateway (mock function)
    const transactionId = await processPayment({ amount, paymentMethod });

    // Save the payment in the database
    const payment = await Payment.create({
        booking: bookingId,
        user: userId,
        amount,
        paymentMethod,
        paymentStatus: "completed",
        transactionId,
    });

    return res.status(201).json(new ApiResponse(201, payment, "Payment processed successfully"));
});

// Get Payment Details
const getPaymentDetails = asyncHandler(async (req, res) => {
    const { paymentId } = req.params;

    // Validate paymentId
    if (!paymentId) {
        throw new ApiError(400, "Payment ID is required");
    }

    // Get payment details
    const payment = await Payment.findById(paymentId).populate("booking user", "-password");

    if (!payment) {
        throw new ApiError(404, "Payment not found");
    }

    return res.status(200).json(new ApiResponse(200, payment, "Payment details fetched successfully"));
});

// Get User Payments
const getUserPayments = asyncHandler(async (req, res) => {
    const userId = req.user._id; // Assuming user ID is available through auth middleware

    // Get all payments made by the user
    const payments = await Payment.find({ user: userId }).populate("booking", "package");

    return res.status(200).json(new ApiResponse(200, payments, "User payments fetched successfully"));
});

// Refund Payment
const refundPayment = asyncHandler(async (req, res) => {
    const { paymentId } = req.params;

    // Validate paymentId
    if (!paymentId) {
        throw new ApiError(400, "Payment ID is required");
    }

    // Get payment details
    const payment = await Payment.findById(paymentId);
    if (!payment) {
        throw new ApiError(404, "Payment not found");
    }

    // Ensure the payment has not already been refunded
    if (payment.refundStatus === "completed") {
        throw new ApiError(400, "Payment has already been refunded");
    }

    // Process the refund via a payment gateway (mock function)
    const refundSuccess = await processRefund(payment.transactionId);

    if (!refundSuccess) {
        throw new ApiError(500, "Refund processing failed");
    }

    // Update the payment status
    payment.refundStatus = "completed";
    await payment.save();

    return res.status(200).json(new ApiResponse(200, payment, "Payment refunded successfully"));
});

export {
    createPayment,
    getPaymentDetails,
    getUserPayments,
    refundPayment,
};
