import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Review } from "../models/review.model.js";
import { Package } from "../models/package.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createReview = asyncHandler(async (req, res) => {
    const { packageId, userId, rating, content } = req.body;

    if (!packageId || !userId || !rating || !content) {
        throw new ApiError(400, "All fields are required");
    }

    const travelPackage = await Package.findById(packageId);
    if (!travelPackage) {
        throw new ApiError(404, "Package not found");
    }

    const existingReview = await Review.findOne({ package: packageId, user: userId });
    if (existingReview) {
        throw new ApiError(409, "You have already reviewed this package");
    }

    const review = await Review.create({
        package: packageId,
        user: userId,
        rating,
        content,
    });

    return res.status(201).json(new ApiResponse(201, review, "Review created successfully"));
});

const getPackageReviews = asyncHandler(async (req, res) => {
    const { packageId } = req.body;

    if (!packageId) {
        throw new ApiError(400, "Package ID is required");
    }

    const travelPackage = await Package.findById(packageId);
    if (!travelPackage) {
        throw new ApiError(404, "Package not found");
    }

    const reviews = await Review.find({ package: packageId }).populate("user", "fullName");

    return res.status(200).json(new ApiResponse(200, reviews, "Reviews fetched successfully"));
});

const updateReview = asyncHandler(async (req, res) => {
    const { reviewId, rating, comment } = req.body;
    const userId = req.user._id;

    console.log(req.body);

    if (!rating || !comment) {
        throw new ApiError(400, "Rating and comment are required");
    }

    const review = await Review.findById(reviewId);
    if (!review) {
        throw new ApiError(404, "Review not found");
    }

    if (review.user.toString() !== userId.toString()) {
        throw new ApiError(403, "You are not authorized to update this review");
    }

    review.rating = rating;
    review.comment = comment;
    await review.save();
    console.log(review);

    return res.status(200).json(new ApiResponse(200, review, "Review updated successfully"));
});

const deleteReview = asyncHandler(async (req, res) => {
    const { reviewId } = req.body;
    const userId = req.user._id;  // Assuming you have user authentication middleware

    const review = await Review.findById(reviewId);
    if (!review) {
        throw new ApiError(404, "Review not found");
    }

    if (review.user.toString() !== userId.toString()) {
        throw new ApiError(403, "You are not authorized to delete this review");
    }

    await review.deleteOne();

    return res.status(200).json(new ApiResponse(200, null, "Review deleted successfully"));
});

export {
    createReview,
    getPackageReviews,
    updateReview,
    deleteReview,
};
