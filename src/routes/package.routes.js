import {Router} from "express";
import {addPackages, 
        getAllPackages,
        updatePackage,
        deletePackage} from "../controllers/package.controller.js";
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
router.route("/getAll").get(getAllPackages);

router.route("/update").patch(updatePackage);

router.route("/delete").delete(deletePackage);

export default router;