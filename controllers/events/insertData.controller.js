import { asyncHandler } from "../../lib/AsyncHandler.js";
import Event from "../../models/event.model.js";
import Ren from "../../models/rendetails.model.js";
import Data from "./data.js";

export const insertDataController = asyncHandler(async (req, res) => {
    for (let item in EventsData) {
        console.log(item);
        await Event.findOneAndUpdate(
            { eventName: EventsData[item].title },
            {
                svg: EventsData[item].svg,
                route: EventsData[item].route,
            },
        );
    }

    // await Ren.create({
    //     totalParticipants: 0,
    //     renIdSuffix: 1500,
    // });
    res.send("done");
});
