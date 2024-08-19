import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Package } from "../models/package.model.js";
import { Booking } from "../models/booking.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createBooking = asyncHandler(async (req, res) => {
    const { packageId, userId, startDate, numberOfPeople } = req.body;

    if (!packageId || !userId || !startDate || !numberOfPeople) {
        throw new ApiError(400, "All fields are required");
    }

    const travelPackage = await Package.findById(packageId);
    if (!travelPackage) {
        throw new ApiError(404, "Package not found");
    }


    const booking = await Booking.create({
        package: packageId,
        user: userId,
        startDate,
        numberOfPeople,
        totalPrice: travelPackage.price * numberOfPeople, 
        status: "confirmed",  
    });

    const createdBooking = await Booking.findById(booking._id)
        .populate('package', 'title location')
        .populate('user', 'fullName email');

    return res.status(201).json(new ApiResponse(201, createdBooking, "Booking created successfully"));
});

export { createBooking };
