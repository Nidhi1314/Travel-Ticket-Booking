// middleware/adminMiddleware.js

import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";

// Middleware to check if the user is an admin
export const adminMiddleware = async (req, res, next) => {
    const user = await User.findById(req.user._id);

    if (!user || user.role !== 'admin') {
        return next(new ApiError(403, "Access denied, Admins only"));
    }

    next();
};
