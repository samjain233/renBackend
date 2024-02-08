import express from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { registerUserController } from "../../controllers/register/registerUser.controller.js";
import { unregisterUserController } from "../../controllers/register/unregisterUser.controller.js";
import { getUserDetailsController } from "../../controllers/register/getUserDetails.controller.js";
import { getUserDetailsWithEventLink } from "../../controllers/register/getUserDetailsWithEventLink.controller.js";

const router = express.Router();

router.post("/register", authMiddleware, registerUserController);
router.post("/unregister", authMiddleware, unregisterUserController);
router.post("/getalluserdetails", authMiddleware, getUserDetailsController);
router.post(
    "/getalluserdetailswitheventlink",
    authMiddleware,
    getUserDetailsWithEventLink,
);

export default router;
