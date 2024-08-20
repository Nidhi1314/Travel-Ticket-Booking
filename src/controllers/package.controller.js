import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Package } from "../models/package.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Add a new package
const addPackages = asyncHandler(async (req, res) => {
    let { title, description, price, duration, location, overview, about, daywisePlan } = req.body;
    console.log(req.body);

    price = Number(price);
    duration = Number(duration);

    if (
        !title || typeof title !== 'string' || title.trim() === "" ||
        !description || typeof description !== 'string' || description.trim() === "" ||
        isNaN(price) || price <= 0 ||
        isNaN(duration) || duration <= 0 ||
        !location || typeof location !== 'string' || location.trim() === ""
    ) {
        throw new ApiError(400, "All fields are required and must be non-empty strings or valid positive numbers");
    }

    if (daywisePlan && !Array.isArray(daywisePlan)) {
        throw new ApiError(400, "daywisePlan must be an array");
    }

    // Check if the package with the same title already exists
    const existingPackage = await Package.findOne({ title });
    if (existingPackage) {
        throw new ApiError(409, "Package with the same title already exists");
    }

    // Handle image uploads
    const packageImage1LocalPath = req.files?.packageImage1?.[0]?.path;
    const packageImage2LocalPath = req.files?.packageImage2?.[0]?.path;
    const packageImage3LocalPath = req.files?.packageImage3?.[0]?.path;

    const packageImage1 = packageImage1LocalPath ? await uploadOnCloudinary(packageImage1LocalPath) : null;
    const packageImage2 = packageImage2LocalPath ? await uploadOnCloudinary(packageImage2LocalPath) : null;
    const packageImage3 = packageImage3LocalPath ? await uploadOnCloudinary(packageImage3LocalPath) : null;

    // Create the package
    const _package = await Package.create({
        title,
        description,
        price,
        duration,
        location,
        packageImage1: packageImage1?.url || "",
        packageImage2: packageImage2?.url || "",
        packageImage3: packageImage3?.url || "",
        overview: overview || "",
        about: about || "",
        daywisePlan: Array.isArray(daywisePlan) ? daywisePlan : []
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
    const { id,title, description, price, duration, location, overview, about, daywisePlan } = req.body;
    console.log(req.body);

    // Handle image uploads
    const packageImage1LocalPath = req.files?.packageImage1?.[0]?.path;
    const packageImage2LocalPath = req.files?.packageImage2?.[0]?.path;
    const packageImage3LocalPath = req.files?.packageImage3?.[0]?.path;

    const packageImage1 = packageImage1LocalPath ? await uploadOnCloudinary(packageImage1LocalPath) : null;
    const packageImage2 = packageImage2LocalPath ? await uploadOnCloudinary(packageImage2LocalPath) : null;
    const packageImage3 = packageImage3LocalPath ? await uploadOnCloudinary(packageImage3LocalPath) : null;

    // Build the update object dynamically
    const updateFields = {};

    if (title) updateFields.title = title;
    if (description) updateFields.description = description;
    if (!isNaN(price)) updateFields.price = Number(price);
    if (!isNaN(duration)) updateFields.duration = Number(duration);
    if (location) updateFields.location = location;
    if (overview) updateFields.overview = overview;
    if (about) updateFields.about = about;
    if (Array.isArray(daywisePlan)) updateFields.daywisePlan = daywisePlan;
    if (packageImage1) updateFields.packageImage1 = packageImage1?.url || "";
    if (packageImage2) updateFields.packageImage2 = packageImage2?.url || "";
    if (packageImage3) updateFields.packageImage3 = packageImage3?.url || "";

    const updatedPackage = await Package.findByIdAndUpdate(
        id,
        { $set: updateFields },
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
