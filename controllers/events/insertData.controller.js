import { asyncHandler } from "../../lib/AsyncHandler.js";
import Event from "../../models/event.model.js";
import Ren from "../../models/rendetails.model.js";
import Data from "./data.js";

export const insertDataController = asyncHandler(async (req, res) => {
    // for (let item in Data) {
    //     console.log(item);
    //     await Event.findOneAndUpdate(
    //         { eventName: Data[item].title },
    //         {
    //             format: Data[item].format,
    //             rules: Data[item].rules,
    //             judgeCriteria: Data[item].judgeCriteria,
    //         },
    //     );
    // }

    await Ren.create({
        totalParticipants: 0,
        renIdSuffix: 1500,
    });
    res.send("done");
});
