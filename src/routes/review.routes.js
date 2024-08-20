import {Router} from "express";
import {createReview,
        getPackageReviews,
        updateReview,
        deleteReview} from "../controllers/review.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/create").post(verifyJWT, createReview);

router.route("/getReviews").get(verifyJWT, getPackageReviews);

router.route("/update").patch(verifyJWT, updateReview);

router.route("/delete").delete(verifyJWT, deleteReview);

export default router;