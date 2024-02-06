import path from "path";
import ejs from "ejs";
import { ApiError } from "../../lib/ApiError.js";
import { ApiResponse } from "../../lib/ApiResponse.js";
import { asyncHandler } from "../../lib/AsyncHandler.js";
import { createEmailVerificationToken } from "../../lib/JwtToken.js";
import User from "../../models/user.model.js";
import { sendMailService } from "../../services/mail/mail.services.js";

export const forgetPasswordController = asyncHandler(async (req, res) => {
    //input validation-------------------------------------------
    const requiredFields = ["email"];
    const missingFields = requiredFields.filter(
        (field) => !(field in req.body),
    );
    //check for missing field
    if (missingFields.length > 0) {
        const error = `Missing required fields: ${missingFields.join(", ")}`;
        throw new ApiError(400, error);
    }

    let { email } = req.body;
    // Validate data types
    if (typeof email !== "string") {
        const error = "email field must be of type string.";
        throw new ApiError(400, error);
    }

    //check for email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        const error = "Invalid email format.";
        throw new ApiError(400, error);
    }
    //--------------------------------------------------------------

    //check if user exists ----------------------------------------
    email = email.toLowerCase();
    const user = await User.findOne(
        { email },
        { _id: 1, email: 1, isVerified: 1 },
    );
    if (!user) {
        const error = "User doesn't exists.";
        throw new ApiError(400, error);
    }
    //---------------------------------------------------------------

    //check for verified email ID -----------------------------------
    if (!user.isVerified) {
        const error = "User not verified.";
        throw new ApiError(400, error);
    }
    //----------------------------------------------------------------

    const userId = user._id;
    //generating email token -----------------------------------------
    const emailToken = await createEmailVerificationToken(userId);
    //----------------------------------------------------------------

    //generating mail ------------------------------------------------

    //generating email template -------------------------------------------------
    const __dirname = path.resolve();
    const link = process.env.FRONTEND_SERVER + "updatepassword/" + emailToken;
    const filepath = path.join(
        __dirname,
        "./templates/mail/forgetPasswordEmail.template.ejs",
    );
    const html = await ejs.renderFile(filepath, {
        link: link,
    });
    //---------------------------------------------------------------------------
    sendMailService(user.email, "forgot password", html);
    //----------------------------------------------------------------

    res.status(200).json(
        new ApiResponse(200, "recovery email has been sent to your email"),
    );
});
