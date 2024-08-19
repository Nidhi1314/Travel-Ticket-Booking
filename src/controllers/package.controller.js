import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Package } from "../models/package.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Add a new package
const addPackages = asyncHandler(async (req, res) => {
    const { title, description, price, duration, location } = req.body;
    console.log(req.body);

    // Check if all required fields are provided
    if ([title, description, price, duration, location].some(field => typeof field !== 'string' || field.trim() === "")) {
        throw new ApiError(400, "All fields are required and must be non-empty strings");
    }

    // Check if the package with the same title already exists
    const existingPackage = await Package.findOne({ title });
    if (existingPackage) {
        throw new ApiError(409, "Package with the same title already exists");
    }

    let packageImageLocalPath;
    if (req.files && Array.isArray(req.files.packageImage) && req.files.packageImage.length > 0) {
        packageImageLocalPath = req.files.packageImage[0].path;
    }

    console.log(packageImageLocalPath);

    if (!packageImageLocalPath) {
        throw new ApiError(400, "Package image is required");
    }

    // Upload the package image to Cloudinary
    const packageImage = await uploadOnCloudinary(packageImageLocalPath);

    if (!packageImage) {
        throw new ApiError(400, "Failed to upload package image to Cloudinary");
    }

    console.log("Image uploaded", packageImage);

    // Create the package
    const _package = await Package.create({
        title,
        description,
        price,
        duration,
        location,
        packageImage: packageImage?.url || ""
    });

    const createdPackage = await Package.findById(_package._id).select("-bookedBy");

    if (!createdPackage) {
        throw new ApiError(500, "Something went wrong while adding the package");
    }

    return res.status(201).json(new ApiResponse(201, createdPackage, "Package added successfully"));
});

// Get all packages
const getAllPackages = asyncHandler(async (req, res) => {
    const packages = await Package.find({});
    return res.status(200).json(new ApiResponse(200, packages, "Packages retrieved successfully"));
});

// Update an existing package
const updatePackage = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, description, price, duration, location } = req.body;

    if (!title || !description || !price || !duration || !location) {
        throw new ApiError(400, "All fields are required");
    }

    const updatedPackage = await Package.findByIdAndUpdate(
        id,
        { $set: { title, description, price, duration, location } },
        { new: true }
    ).select("");

    if (!updatedPackage) {
        throw new ApiError(404, "Package not found");
    }

    return res.status(200).json(new ApiResponse(200, updatedPackage, "Package updated successfully"));
});

// Delete a package
const deletePackage = asyncHandler(async (req, res) => {
    const { id } = req.body;

    if (!id) {
        throw new ApiError(400, "Package ID is required");
    }

    const deletedPackage = await Package.findByIdAndDelete(id);

    if (!deletedPackage) {
        throw new ApiError(404, "Package not found");
    }

    return res.status(200).json(new ApiResponse(200, null, "Package deleted successfully"));
});

export {
    addPackages,
    getAllPackages,
    updatePackage,
    deletePackage
};
