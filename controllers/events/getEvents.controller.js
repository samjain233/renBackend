import { ApiResponse } from "../../lib/ApiResponse.js";
import { asyncHandler } from "../../lib/AsyncHandler.js";
import Event from "../../models/event.model.js";
// import { events } from "./events.js"; remove this file later

export const getEventsController = asyncHandler(async (req, res) => {
    const eventShortDetails = await Event.find({}).select({
        eventName: 1,
        description: 1,
        route: 1,
        svg: 1,
    });
    res.status(200).json(
        new ApiResponse(
            200,
            "event details fetch successfully",
            eventShortDetails,
        ),
    );
});
