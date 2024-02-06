import { ApiError } from "../../lib/ApiError.js";
import { ApiResponse } from "../../lib/ApiResponse.js";
import { asyncHandler } from "../../lib/AsyncHandler.js";
import User from "../../models/user.model.js";

export const registerUserController = asyncHandler(async (req, res) => {
    const user = req.user;
    const userId = user._id;
    const { eventId } = req.body;
    if (!eventId) {
        const error = "event id is not provide.";
        throw new ApiError(400, error);
    }
    const userData = await User.findById(userId);
    const userParticipatedEvents = userData.eventsParticipated;
    if (userParticipatedEvents.includes(eventId)) {
        const error = "already registered.";
        throw new ApiError(400, error);
    }

    //saving event id in User
    await User.findByIdAndUpdate(userId, {
        $push: { eventsParticipated: eventId },
    });

    const message = "user registered successfully.";
    res.status(200).json(new ApiResponse(200, message));
});
