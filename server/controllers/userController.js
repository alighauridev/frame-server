import User from "../modals/userModal.js";
import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error("User Already Exists");
    }
    const user = await User.create({
        name,
        email,
        password,
    });
    if (user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error("User not found or Invalid user data");
    }
});
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            artworks: user.artworks,
            frames: user.frames,
            token: generateToken(user._id),
            createdAt: user.createdAt,
        });
    } else {
        res.status(401);
        throw new Error("Invalid Email Or Passowrd!");
    }
});
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.body.user);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,

            token: generateToken(updatedUser._id),
            createdAt: updatedUser.createdAt,
        });
    } else {
        res.status(404);
        throw new Error("User Not Found");
    }
});
const allUsers = asyncHandler(async (req, res) => {
    const users = await User.find({});

    res.json(users);
});
// GET all artists Admin
const allArtists = asyncHandler(async (req, res) => {
    const artists = await User.find({ isArtist: true });
    res.json(artists);
});

export { registerUser, authUser, updateUserProfile, allUsers, allArtists };
