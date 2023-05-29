import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserInfo",
    },

    name: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },

    frame: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FrameImage",
    },
    artwork: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "artwork",
    },
    isSold: {
        type: Boolean,
        default: false,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
});

const Inquiry = mongoose.model("Inquiry", inquirySchema);

export default Inquiry;
