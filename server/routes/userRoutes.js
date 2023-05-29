import express from "express";
import {
    registerUser,
    authUser,
    updateUserProfile,
    allUsers,
    allArtists,
} from "../controllers/userController.js";
import { admin } from "../middlewares/authMiddleware.js";

const userRoutes = express.Router();

userRoutes.route("/register").post(registerUser);
userRoutes.route("/login").post(authUser);
userRoutes.route("/profile").put(updateUserProfile);
userRoutes.route("/").get(admin, allUsers);
userRoutes.route("/admin/artists").get(admin, allArtists);

export default userRoutes;
