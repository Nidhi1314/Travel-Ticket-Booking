import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Payment } from "../models/payment.model.js";
import { Booking } from "../models/booking.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { processPayment, processRefund } from "../utils/paymentGateway.js";

const createPayment = asyncHandler(async (req, res) => {
    const { bookingId, paymentMethod } = req.body;
    const userId = req.user._id;

    if (!bookingId || !paymentMethod) {
        throw new ApiError(400, "Booking ID and payment method are required");
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
        throw new ApiError(404, "Booking not found");
    }

    if (booking.user.toString() !== userId.toString()) {
        throw new ApiError(403, "You are not authorized to make a payment for this booking");
    }

    const amount = booking.totalPrice;

    try {
        const transactionId = await processPayment({ amount, paymentMethod });

        const payment = await Payment.create({
            booking: bookingId,
            user: userId,
            amount,
            paymentMethod,
            paymentStatus: "completed",
            transactionId,
        });

        return res.status(201).json(new ApiResponse(201, payment, "Payment processed successfully"));
    } catch (error) {
        throw new ApiError(500, "Error processing payment: " + error.message);
    }
});

const getPaymentDetails = asyncHandler(async (req, res) => {
    const { paymentId } = req.params;

    if (!paymentId) {
        throw new ApiError(400, "Payment ID is required");
    }

    const payment = await Payment.findById(paymentId).populate("booking user", "-password");

    if (!payment) {
        throw new ApiError(404, "Payment not found");
    }

    return res.status(200).json(new ApiResponse(200, payment, "Payment details fetched successfully"));
});

const getUserPayments = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const payments = await Payment.find({ user: userId }).populate("booking", "package");

    return res.status(200).json(new ApiResponse(200, payments, "User payments fetched successfully"));
});

const refundPayment = asyncHandler(async (req, res) => {
    const { paymentId } = req.params;

    if (!paymentId) {
        throw new ApiError(400, "Payment ID is required");
    }

    const payment = await Payment.findById(paymentId);
    if (!payment) {
        throw new ApiError(404, "Payment not found");
    }

    if (payment.refundStatus === "completed") {
        throw new ApiError(400, "Payment has already been refunded");
    }

    try {
        const refundSuccess = await processRefund(payment.transactionId);

        if (!refundSuccess) {
            throw new ApiError(500, "Refund processing failed");
        }

        payment.refundStatus = "completed";
        await payment.save();

        return res.status(200).json(new ApiResponse(200, payment, "Payment refunded successfully"));
    } catch (error) {
        throw new ApiError(500, "Error processing refund: " + error.message);
    }
});

export {
    createPayment,
    getPaymentDetails,
    getUserPayments,
    refundPayment
};
