import { ApiError } from "../../lib/ApiError.js";
import { ApiResponse } from "../../lib/ApiResponse.js";
import { asyncHandler } from "../../lib/AsyncHandler.js";
import Event from "../../models/event.model.js";

export const getEventDetailsController = asyncHandler(async (req, res) => {
    const eventId = req.params.eventid;
    if (!eventId) {
        const error = "event Id is not provided";
        throw new ApiError(200, error);
    }
    const EventData = await Event.findOne({ route: eventId });
    res.status(200).json(
        new ApiResponse(200, "event data fetch successfull", EventData),
    );
});
