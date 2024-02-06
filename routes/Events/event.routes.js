import express from "express";
import { getEventsController } from "../../controllers/events/getEvents.controller.js";
import { getEventDetailsController } from "../../controllers/events/getEventDetails.controller.js";
// import { insertDataController } from "../../controllers/events/insertData.controller.js";
const router = express.Router();

router.get("/", getEventsController);
// router.get("/up",insertDataController); //for updating data in database purpose
router.get("/:eventid", getEventDetailsController);




export default router;
