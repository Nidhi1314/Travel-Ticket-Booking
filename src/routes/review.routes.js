import {Router} from "express";
import {createReview,
        getPackageReviews,
        updateReview,
        deleteReview} from "../controllers/review.controller.js";

const router = Router();

router.route("/create").post(createReview);

router.route("/getPackageReview").get(getPackageReviews);

router.route("/update").patch(updateReview);

router.route("/delete").delete(deleteReview);

export default router;