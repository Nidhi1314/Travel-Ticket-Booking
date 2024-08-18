import { User } from "../models/user.model.js";
import { Package } from "../models/package.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select("-password"); // Exclude password from the results
    res.status(200).json(users);
});

// @desc    Get a single user by ID
// @route   GET /api/admin/users/:id
// @access  Private/Admin
export const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    res.status(200).json(user);
});

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    await user.deleteOne();
    res.status(200).json({ message: "User deleted successfully" });
});

// @desc    Get all packages
// @route   GET /api/admin/packages
// @access  Private/Admin
export const getAllPackages = asyncHandler(async (req, res) => {
    const packages = await Package.find({});
    res.status(200).json(packages);
});

// @desc    Get a single package by ID
// @route   GET /api/admin/packages/:id
// @access  Private/Admin
export const getPackageById = asyncHandler(async (req, res) => {
    const _package = await Package.findById(req.params.id);

    if (!_package) {
        throw new ApiError(404, "Package not found");
    }

    res.status(200).json(_package);
});

// @desc    Delete a package
// @route   DELETE /api/admin/packages/:id
// @access  Private/Admin
export const deletePackage = asyncHandler(async (req, res) => {
    const _package = await Package.findById(req.params.id);

    if (!_package) {
        throw new ApiError(404, "Package not found");
    }

    await _package.deleteOne();
    res.status(200).json({ message: "Package deleted successfully" });
});
