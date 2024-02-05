import express from "express";
import { registerAdminController } from "../../controllers/auth/register.controller.js";
import { emailVerificationController } from "../../controllers/auth/emailVerification.controller.js";
import { loginController } from "../../controllers/auth/login.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { updatePasswordController } from "../../controllers/auth/updatePassword.controller.js";
import { emailAuthMiddleware } from "../../middleware/emailAuth.middleware.js";
import { generateAccessTokenController } from "../../controllers/auth/generateAccessToken.controller.js";
import { logoutController } from "../../controllers/auth/logout.controller.js";
import { forgetPasswordController } from "../../controllers/auth/forgetPassword.controller.js";

const router = express.Router();

router.post("/admin/register", registerAdminController);
router.post("/login", loginController);
router.post("/forgetpassword", forgetPasswordController);

//protected routes ------------------------------------------------------
router.post(
    "/emailverify",
    authMiddleware,
    emailAuthMiddleware,
    emailVerificationController,
);
router.post("/logout", authMiddleware, logoutController);
router.post(
    "/updatepassword",
    authMiddleware,
    emailAuthMiddleware,
    updatePasswordController,
);
router.post("/generateaccesstoken", generateAccessTokenController);
//--------------------------------------------------------------------------

export default router;
