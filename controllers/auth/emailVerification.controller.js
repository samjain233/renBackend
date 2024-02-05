import { ApiError } from "../../lib/ApiError.js";
import { asyncHandler } from "../../lib/AsyncHandler.js";
import User from "../../models/user.model.js";
import { ApiResponse } from "../../lib/ApiResponse.js";
import { REN_ID_PREFIX } from "../../constants/constants.js";
import Ren from "../../models/rendetails.model.js";
import { createAccessToken, createRefreshToken } from "../../lib/JwtToken.js";

export const emailVerificationController = asyncHandler(async (req, res) => {
    const user = req.user;
    if (user.isVerified === true) {
        const error = "Email is already verified.";
        throw new ApiError(404, error);
    }

    //incrementing user in database ----------------------------------------

    const REN_GLOBAL_ID = process.env.REN_MONGOOSE_ID;
    const userNo = await Ren.findByIdAndUpdate(
        REN_GLOBAL_ID,
        { $inc: { renIdSuffix: 1, totalParticipants: 1 } },
        { new: true },
    );
    //------------------------------------------------------------------------

    const randDigit = Math.round(Math.random() * 10);

    //setting verification status to true
    const updatedUser = await User.findByIdAndUpdate(
        user._id,
        {
            isVerified: true,
            renId: REN_ID_PREFIX + randDigit + userNo.renIdSuffix,
        },
        { new: true },
    );
    if (updatedUser.isVerified !== true) {
        const error = "Unable to verify email.";
        throw new ApiError(404, error);
    }

    //generating auth token --------------------------------------------
    const userId = user._id;
    const accessToken = await createAccessToken(userId);
    const refreshToken = await createRefreshToken(userId);
    //---------------------------------------------------------------

    //saving refresh token in db----------------------------------------
    const updatedRefreshTokenUser = await User.findByIdAndUpdate(
        userId,
        { refresh: refreshToken },
        { new: true },
    );
    if (updatedRefreshTokenUser.refresh !== refreshToken) {
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
