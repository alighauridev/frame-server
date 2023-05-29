import express from "express";

import {
    approveArtwork,
    categorizeArtwork,
    createArtwork,
    createArtworkAdmin,
    deleteArtwork,
    getAllApprovedArtworksForUser,
    getAllArtworkByArtist,
    getAllUnapprovedArtworks,
    getArtworkById,
    updateArtwork,
} from "../controllers/artworkController.js";
import { admin } from "../middlewares/authMiddleware.js";
const router = express.Router();

// Create artwork
router.post("/artwork/create", createArtwork);
router.post("/artwork/admin/create", createArtworkAdmin);
router.get("/artwork/:id", getArtworkById);

// Update artwork
router.put("/artwork/:id", updateArtwork);

// Delete artwork
router.delete("/artwork/:id", deleteArtwork);
router.get("/artwork/:id/all", getAllArtworkByArtist);

// Get all artwork
router.get("/artwork", getAllApprovedArtworksForUser);
router.get("/artwork/admin/unapproved", getAllUnapprovedArtworks);

// Categorize artwork
router.put("/artwork/:id/categorize", categorizeArtwork);

// Approve artwork
router.put("/artwork/admin/:id/approve", approveArtwork);

export default router;
