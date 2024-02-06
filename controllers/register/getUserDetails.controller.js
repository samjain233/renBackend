import { ApiResponse } from "../../lib/ApiResponse.js";
import { asyncHandler } from "../../lib/AsyncHandler.js";
import User from "../../models/user.model.js";

export const getUserDetailsController = asyncHandler(async (req, res) => {
    const user = req.user;
    const userId = user._id;

    const userDetails = await User.findById(userId).select({
        email: 1,
        username: 1,
        gender: 1,
        phone: 1,
        renId: 1,
        eventsParticipated: 1,
    });
    const message = "user details fetched successfully.";
    res.status(200).json(new ApiResponse(200, message, userDetails));
});
