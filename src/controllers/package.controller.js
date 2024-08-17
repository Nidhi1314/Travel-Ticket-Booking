import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import { Package } from "../models/package.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const addPackages = asyncHandler(async (req, res) => {

    const {title, description, price, duration, location} = req.body;
    console.log(req.body);

    // if ([title, description, price, duration, location].some((field) => typeof field !== 'string' || field.trim() === "")) {
    //     // throw new ApiError(400, "All fields are required and must be non-empty strings");
    // }

    const existingPackage = await Package.findOne({title: title});
    if (existingPackage) {
        throw new ApiError(409, "Package with the same title already exists");
    }

    let packageImageLocalPath;
    if(req.files && Array.isArray(req.files.packageImage) && req.files.packageImage.length > 0) {
        packageImageLocalPath = req.files.packageImage[0].path;
    }

    console.log(packageImageLocalPath);

    if(!packageImageLocalPath) {
        throw new ApiError(400, "Package image and thumbnail is required");
    }

    const packageImage = await uploadOnCloudinary(packageImageLocalPath);

    if(!packageImage) {
        throw new ApiError(400, "Failed to upload package image and thumbnail to cloudinary");
    }

    console.log("Image uploaded", packageImage);

    const _package = await Package.create({
        title,
        description,
        price,
        duration,
        location,
        packageImage: packageImage?.url ||""
    });

    const createdPackage = await Package.findById(_package._id).select(
        "-bookedBy"
    );

    if(!createdPackage) {
        throw new ApiError(500, "Something went wrong while adding pakcage");
    }

    return res.status(201).json(new ApiResponse(201, createdPackage, "User registered successfully"));
})

const getPackages = asyncHandler(async (req, res) => {
    const packages = await Package.find({});
    return res.status(200).json(new ApiResponse(200, packages, "Packages retrieved successfully"));
})

export {
    addPackages,
    getPackages
}