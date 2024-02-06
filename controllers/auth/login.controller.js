import path from "path";
import ejs from "ejs";
import { ApiError } from "../../lib/ApiError.js";
import { ApiResponse } from "../../lib/ApiResponse.js";
import { asyncHandler } from "../../lib/AsyncHandler.js";
import { VerifyPassword } from "../../lib/HashPassword.js";
import {
    createAccessToken,
    createEmailVerificationToken,
    createRefreshToken,
} from "../../lib/JwtToken.js";
import User from "../../models/user.model.js";
import { sendMailService } from "../../services/mail/mail.services.js";

export const loginController = asyncHandler(async (req, res) => {
    //input validation-------------------------------------------
    const requiredFields = ["email", "password"];
    const missingFields = requiredFields.filter(
        (field) => !(field in req.body),
    );

    //check for missing field
    if (missingFields.length > 0) {
        const error = `Missing required fields: ${missingFields.join(", ")}`;
        throw new ApiError(400, error);
    }

    let { email, password } = req.body;

    // Validate data types
    if (typeof email !== "string" || typeof password !== "string") {
        const error = "All fields must be of type string.";
        throw new ApiError(400, error);
    }

    //check for email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        const error = "Invalid email format.";
        throw new ApiError(400, error);
    }

    email = email.toLowerCase();

    //check if user exists ----------------------------------------
    const user = await User.findOne({ email });
    if (!user) {
        const error = "Invalid email or password.";
        throw new ApiError(400, error);
    }
    //---------------------------------------------------------------

    //verifying password ------------------------------------------------
    const hash = user.password;
    const verified = await VerifyPassword(password, hash);
    if (!verified) {
        const error = "Invalid email or password.";
        throw new ApiError(400, error);
    }
    //---------------------------------------------------------------

    //checking for verified email------------------------------------
    if (user.isVerified === false) {
        //sending verification link to user

        const emailToken = await createEmailVerificationToken(user._id);
        const link = process.env.FRONTEND_SERVER + "verify/" + emailToken;
        console.log(link);

        //generating email template -------------------------------------------------

        const __dirname = path.resolve();
        const filepath = path.join(
            __dirname,
            "./templates/mail/verificationEmail.template.ejs",
        );
        const html = await ejs.renderFile(filepath, {
            username: user.username,
            link: link,
        });
        //---------------------------------------------------------------------------
        sendMailService(user.email, "email Verification", html);
        const message = "Verification link has been sent to your email";
        res.status(200).json(new ApiResponse(201, message));
        return;
    }

    //generating auth token --------------------------------------------
    const userId = user._id;
    const accessToken = await createAccessToken(userId);
    const refreshToken = await createRefreshToken(userId);
    //---------------------------------------------------------------

    //saving refresh token in db----------------------------------------
    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { refresh: refreshToken },
        { new: true },
    );
    if (updatedUser.refresh !== refreshToken) {
        const error = "some error occured, unable to login.";
        throw new ApiError(400, error);
    }
    //------------------------------------------------------------------

    const message = "login successfull.";
    const data = {
        accessToken,
        refreshToken,
    };
    res.status(200).json(new ApiResponse(200, message, data));
});
