import express from "express";
import {
    getAllUsers,
    getUserById,
    deleteUser,
    getAllPackages,
    getPackageById,
    deletePackage,
} from "../controllers/admin.controller.js";
import { verifyJWT, admin } from "../middlewares/auth.middleware.js"; // Assuming you have an admin middleware

const router = express.Router();

router.route("/users").get(verifyJWT, admin, getAllUsers);
router.route("/users/:id").get(verifyJWT, admin, getUserById).delete(verifyJWT, admin, deleteUser);

router.route("/packages").get(verifyJWT, admin, getAllPackages);
router.route("/packages/:id").get(verifyJWT, admin, getPackageById).delete(verifyJWT, admin, deletePackage);

export default router;
