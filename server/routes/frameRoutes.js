import express from "express";
import asyncHandler from "express-async-handler";
import { admin, protect } from "../middlewares/authMiddleware.js";
import FrameImage from "../modals/frameModel.js";
import Category from "../modals/categoryModel.js";
import User from "../modals/userModal.js";
const frameRoutes = express.Router();

// GET all frame images with sort and pagination for users
// GET all approved frame images with sort and pagination for users
frameRoutes.get(
    "/",
    asyncHandler(async (req, res) => {
        const pageSize = 9;
        const page = Number(req.query.pageNumber) || 1;
        const keyword = { approved: true }; // Only fetch approved frames

        if (req.query.category) {
            const categories = await Category.find({
                name: { $in: req.query.category.split(",") },
            });
            keyword.category = { $in: categories.map((category) => category._id) };
        }

        if (req.query.keyword) {
            keyword.title = {
                $regex: req.query.keyword,
                $options: "i",
            };
        }
        const count = await FrameImage.countDocuments(keyword);
        const frames = await FrameImage.find(keyword)
            .populate("category")
            .limit(pageSize)
            .skip(pageSize * (page - 1))
            .sort({ _id: -1 });



        res.json({
            frames,
            page,
            pages: Math.ceil(count / pageSize),

        });
    })
);

// GET all frames of users
frameRoutes.get(
    "/all/:id",
    asyncHandler(async (req, res) => {
        const frames = await FrameImage.find({ user: req.params.id }).populate('category');

        res.json({
            frames,
        });
    })
);

// Get all unapproved frames for admin
frameRoutes.get(
    "/admin/unapproved",
    asyncHandler(async (req, res) => {
        const unapprovedFrames = await FrameImage.find({}).populate('user category')
            .sort({ createdAt: -1 })
            .limit(50); // Adjust the limit as per your requirement

        res.json(unapprovedFrames);
    })
);


// GET single frame
frameRoutes.get(
    "/:id",
    asyncHandler(async (req, res) => {
        const frame = await FrameImage.findById(req.params.id)
            .populate("user")
            .populate("category");
        if (frame) {
            res.json(frame);
        } else {
            res.status(404);
            throw new Error("Frame Not Found!");
        }
    })
);

// Create single frame --Admin
frameRoutes.post(
    "/admin/create",
    asyncHandler(async (req, res) => {
        const {
            title,
            description,
            price,
            image,
            multiLayer,

            category,
            user,
        } = req.body;



        const frame = new FrameImage({
            title,
            description,
            image,
            price,
            multiLayer,
            patch: true,
            category,
            user,
            approved: true, // Changed "true" to true
        });

        if (frame) {
            const createFrame = await frame.save();

            // Add frame to artist's frames array
            const updatedUser = await User.findOneAndUpdate(
                { _id: user }, // Assuming "user" is the artist's ID
                { $push: { frames: createFrame._id } },
                { new: true }
            );

            if (updatedUser) {
                res.status(201).json(createFrame);
            } else {
                res.status(404);
                throw new Error("Artist Not Found");
            }
        } else {
            res.status(400);
            throw new Error("Invalid Data!");
        }

    })
);

// Approve single frame --Admin
frameRoutes.put(
    "/admin/approve/:id",

    asyncHandler(async (req, res) => {
        const frame = await FrameImage.findById(req.params.id);

        if (frame) {
            frame.approved = true;
            const approvedFrame = await frame.save();

            res.json(approvedFrame);
        } else {
            res.status(404);
            throw new Error("Frame Not Found");
        }
    })
);

// DELETE single frame for artist
frameRoutes.delete(
    "/user/:id",
    asyncHandler(async (req, res) => {
        const frameId = req.params.id;

        const frame = await FrameImage.findById(frameId);
        if (frame) {
            const userId = frame.user;

            // Remove frame from artist's frames array
            const user = await User.findByIdAndUpdate(
                userId,
                { $pull: { frames: frameId } },
                { new: true }
            );

            if (user) {
                await frame.remove();
                res.json({ message: "Frame Removed" });
            } else {
                res.status(404);
                throw new Error("Artist Not Found");
            }
        } else {
            res.status(404);
            throw new Error("Frame Not Found");
        }
    })
);


// EDIT single frame for artist
frameRoutes.put(
    "/user/:id",
    asyncHandler(async (req, res) => {
        const { title, description, image, price, multiLayer, category } =
            req.body;
        const updatedFrame = await FrameImage.findByIdAndUpdate(
            req.params.id,
            {
                title,
                description,
                image,
                price,
                multiLayer,

                category,
            },
            { new: true }
        );

        if (updatedFrame) {
            res.json(updatedFrame);
        } else {
            res.status(404);
            throw new Error("Frame Not Found");
        }
    })
);

// Create single frame for artist
frameRoutes.post(
    "/user/create",
    asyncHandler(async (req, res) => {
        const { title,
            description,
            price,
            image,
            multiLayer,

            category,
            user, } =
            req.body;


        const frame = new FrameImage({
            title,
            description,
            image,
            price,
            multiLayer,
            user,
            category,
        });
        if (frame) {
            const createFrame = await frame.save();

            // Add frame to artist's frames array
            const userUpdate = await User.findOneAndUpdate(
                { _id: user },
                { $push: { frames: createFrame._id } },
                { new: true }
            );

            if (userUpdate) {
                res.status(201).json(createFrame);
            } else {
                res.status(404);
                throw new Error("Artist Not Found");
            }
        } else {
            res.status(400);
            throw new Error("Invalid Data!");
        }

    })
);

export default frameRoutes;
