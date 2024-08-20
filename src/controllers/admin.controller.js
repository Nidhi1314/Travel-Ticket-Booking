import { User } from "../models/user.model.js";
import { Package } from "../models/package.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select("-password"); 
    res.status(200).json(users);
});

export const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    res.status(200).json(user);
});

export const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    await user.deleteOne();
    res.status(200).json({ message: "User deleted successfully" });
});

export const getAllPackages = asyncHandler(async (req, res) => {
    const packages = await Package.find({});
    res.status(200).json(packages);
});

export const getPackageById = asyncHandler(async (req, res) => {
    const _package = await Package.findById(req.params.id);

    if (!_package) {
        throw new ApiError(404, "Package not found");
    }

    res.status(200).json(_package);
});

export const deletePackage = asyncHandler(async (req, res) => {
    const _package = await Package.findById(req.params.id);

    if (!_package) {
        throw new ApiError(404, "Package not found");
    }

    await _package.deleteOne();
    res.status(200).json({ message: "Package deleted successfully" });
});
