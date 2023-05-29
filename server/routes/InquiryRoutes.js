import express from "express";
import asyncHandler from "express-async-handler";
import Inquiry from "../modals/inquiryModel.js";
import FrameImage from "../modals/frameModel.js";
import User from "../modals/userModal.js";

const inquiryRoutes = express.Router();

// GET User Inquiries
inquiryRoutes.get(
    "/user/:userId",
    asyncHandler(async (req, res) => {
        const inquiries = await Inquiry.find({ user: req.params.userId }).populate(
            "frame artwork"
        );
        res.json(inquiries);
    })
);

// GET Artist Inquiries
inquiryRoutes.get(
    "/artist/:artistId",
    asyncHandler(async (req, res) => {
        const inquiries = await Inquiry.find({
            artist: req.params.artistId,
        }).populate("frame artwork");
        res.json(inquiries);
    })
);

inquiryRoutes.post(
    "/frame",
    asyncHandler(async (req, res) => {
        const {
            email,
            name,
            phone,
            message,
            frame,
            user,
        } = req.body;

        const inquiry = new Inquiry({

            email,
            name,
            phone,
            message,
            frame,
            user,

        });

        inquiry
            .save()
            .then(() => {
                res.json({ message: "Inquiry submitted successfully" });
            })
            .catch((error) => {
                console.log(error);
                res.status(500).json({ error: "Internal server error" });
            });
    })
);
inquiryRoutes.post(
    "/artwork",
    asyncHandler(async (req, res) => {
        const { name, email, message, artwork, user, phone } = req.body;

        const inquiry = new Inquiry({
            name,
            email,
            message,
            artwork,
            phone,
            user,
            artwork,
        });

        inquiry
            .save()
            .then(() => {
                res.json({ message: "Inquiry submitted successfully" });
            })
            .catch((error) => {
                console.log(error);
                res.status(500).json({ error: "Internal server error" });
            });
    })
);
inquiryRoutes.post(
    "/frame-inquiries",
    asyncHandler(async (req, res) => {
        try {
            const user = await User.findById(req.body.user).populate('frames'); // populate frames

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            // Get all frame IDs that belong to the user
            const frameIds = user.frames.map(frame => frame._id);

            // Fetch all inquiries for those frames
            const inquiries = await Inquiry.find({ frame: { $in: frameIds } }).populate('user frame');

            res.json(inquiries);
        } catch (error) {
            res.status(500).json({
                message: "An error occurred while fetching the user's inquiries",
                error: error.message,
            });
        }
    })
);
inquiryRoutes.post(
    "/art-inquiries",
    asyncHandler(async (req, res) => {
        try {
            const user = await User.findById(req.body.user).populate('artworks'); // populate frames

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            // Get all frame IDs that belong to the user
            const artIds = user.artworks.map(art => art._id);

            // Fetch all inquiries for those frames
            const inquiries = await Inquiry.find({ artwork: { $in: artIds } }).populate('user artwork');

            res.json(inquiries);
        } catch (error) {
            res.status(500).json({
                message: "An error occurred while fetching the user's inquiries",
                error: error.message,
            });
        }
    })
);


export default inquiryRoutes;
