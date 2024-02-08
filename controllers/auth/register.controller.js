import ejs from "ejs";
import { ApiError } from "../../lib/ApiError.js";
import { ApiResponse } from "../../lib/ApiResponse.js";
import { asyncHandler } from "../../lib/AsyncHandler.js";
import { HashPassword } from "../../lib/HashPassword.js";
import { createEmailVerificationToken } from "../../lib/JwtToken.js";
import User from "../../models/user.model.js";
import { sendMailService } from "../../services/mail/mail.services.js";
import path from "path";

const isValidEmail = (email) => {
    // Regular expression to match emails ending with "@mnnit.ac.in"
    const regex = /@mnnit\.ac\.in$/;
    return regex.test(email);
};

export const registerAdminController = asyncHandler(async (req, res) => {
    //input validation-------------------------------------------
    const requiredFields = [
        "username",
        "email",
        "password",
        "mobile",
        "gender",
        "isMnnitStudent",
    ];
    const missingFields = requiredFields.filter(
        (field) => !(field in req.body),
    );
    //check for missing field
    if (missingFields.length > 0) {
        const error = `Missing required fields: ${missingFields.join(", ")}`;
        throw new ApiError(400, error);
    }

    let { username, email, password, mobile, gender, isMnnitStudent } =
        req.body;

    // Validate data types
    if (
        typeof username !== "string" ||
        typeof email !== "string" ||
        typeof password !== "string" ||
        typeof mobile !== "string" ||
        typeof gender !== "string" ||
        typeof isMnnitStudent !== "boolean"
    ) {
        const error =
            "All fields must be of type string , isMnnitStudent (boolean).";
        throw new ApiError(400, error);
    }

    //check for userName
    const trimmedUsername = username.replace(/\s/g, "");
    if (trimmedUsername.length < 6) {
        const error = "Username must have at least 6 characters.";
        throw new ApiError(400, error);
    }

    //check for email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        const error = "Invalid email format.";
        throw new ApiError(400, error);
    }

    // Password complexity validation
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/;
    if (!password.match(passwordRegex)) {
        const error =
            "Password must be at minimum eight characters, at least one letter and one number.";
        throw new ApiError(400, error);
    }

    //check for mnnit student
    if (isMnnitStudent === true) {
        if (isValidEmail(email) === false) {
            const error = "Provide a valid mnnit email Id.";
            throw new ApiError(400, error);
        }
    }
    //--------------------------------------------------------------

    //existing user check------------------------------------------
    email = email.toLowerCase();
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
        const error = "email already in use, try using login.";
        throw new ApiError(400, error);
    }
    //-------------------------------------------------------------

    //hashing password -----------------------------------------
    const hashedPassword = await HashPassword(password);
    //--------------------------------------------------------------

    //creating new user -----------------------------------------------
    const user = await User.create({
        username,
        email,
        password: hashedPassword,
        gender: gender,
        phone: mobile,
        isMnnitStudent: isMnnitStudent,
    });
    //-----------------------------------------------------------------

    //checking user created ------------------------------------------------
    const checkCreatedUser = user?._id;
    if (checkCreatedUser) {
        const emailToken = await createEmailVerificationToken(user._id);
        console.log(emailToken);
        const link = process.env.FRONTEND_SERVER + "verify/" + emailToken;

        //generating email template -------------------------------------------------
        const __dirname = path.resolve();
        const filepath = path.join(
            __dirname,
            "./templates/mail/verificationEmail.template.ejs",
        );
        const html = await ejs.renderFile(filepath, {
            username: username,
            link: link,
        });
        //---------------------------------------------------------------------------

        sendMailService(user.email, "email Verification", html);
        const message =
            "User Created Successfully , a verification link has been sent to your email";
        res.status(201).json(new ApiResponse(201, message));
    } else {
        throw new ApiError(500, "Some Error Occured");
    }
});
