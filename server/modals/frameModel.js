import mongoose from "mongoose";

const frameImageSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserInfo",
    },

    image: {
        type: String,
        required: true,
    },

    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },

    price: {
        type: Number,
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
    },
    patch: {
        type: Boolean,
        default: false
    },

    multiLayer: {
        type: Boolean,
        default: false,
    },
    approved: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const FrameImage = mongoose.model("FrameImage", frameImageSchema);

export default FrameImage;
