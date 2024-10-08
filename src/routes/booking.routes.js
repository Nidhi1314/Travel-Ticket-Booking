import {Router} from "express";

import {createBooking} from "../controllers/booking.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/").post(verifyJWT, createBooking);

export default router;