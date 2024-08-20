import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Package } from "../models/package.model.js";
import { Booking } from "../models/booking.model.js";
import { Payment } from "../models/payment.model.js"; 
import { ApiResponse } from "../utils/ApiResponse.js";
import { processPayment } from "../utils/paymentGateway.js"; 

const createBooking = asyncHandler(async (req, res) => {
    const { packageId, startDate, endDate, numberOfPeople, paymentMethod } = req.body;
    const userId = req.user._id;

    if (!packageId || !userId || !startDate || !endDate || !numberOfPeople || !paymentMethod) {
        throw new ApiError(400, "All fields are required");
    }

    const travelPackage = await Package.findById(packageId);
    if (!travelPackage) {
        throw new ApiError(404, "Package not found");
    }

    const totalPrice = travelPackage.price * numberOfPeople;

    // Create the booking
    const booking = await Booking.create({
        package: packageId,
        user: userId,
        startDate,
        endDate,
        numberOfPeople,
        totalPrice,
        status: "confirmed",
    });

    let transactionId;

    try {
        transactionId = await processPayment(totalPrice, paymentMethod );
        
        if (!transactionId) {
            throw new ApiError(500, "Payment failed: No transaction ID returned");
        }

        await Payment.create({
            booking: booking._id,
            user: userId,
            amount: totalPrice, 
            paymentMethod,
            paymentStatus: "completed",
            transactionId
        });

    } catch (error) {
        await Booking.findByIdAndDelete(booking._id);
        console.error('Error processing booking:', error);
        throw new ApiError(500, "Booking failed: Payment processing error");
    }

    const createdBooking = await Booking.findById(booking._id)
        .populate('package', 'title location')
        .populate('user', 'fullName email');

    return res.status(201).json(new ApiResponse(201, createdBooking, "Booking and payment processed successfully"));
});

export { createBooking };
