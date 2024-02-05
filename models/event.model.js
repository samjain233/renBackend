import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    eventName: {
        type: String,
        required: true,
    },
    imagePath: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    date: {
        type: String,
    },
    format: [],
    rules: [],
    judgeCriteria: [],
});

const Event = mongoose.model("Event", eventSchema);
export default Event;