import mongoose from "mongoose";

const renSchema = new mongoose.Schema({
    totalParticipants: {
        type: Number,
        required: true,
    },
    renIdSuffix: {
        type: Number,
        required: true,
    },
});

const Ren = mongoose.model("Ren", renSchema);
export default Ren;
