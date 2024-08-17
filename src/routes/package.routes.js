import {Router} from "express";
import { addPackages, getPackages } from "../controllers/package.controller.js";
import {upload} from "../middlewares/multer.middleware.js"

const router = Router();

router.route("/add").post(
    upload.fields([
        {
            name: "packageImage",
            maxCount: 1
        }
    ]),
    addPackages
);
router.route("/getPackages").get(getPackages);

export default router;