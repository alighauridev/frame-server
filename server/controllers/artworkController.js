import expressAsyncHandler from "express-async-handler";
import Artwork from "../modals/artworkModel.js";
import User from "../modals/userModal.js";
import Category from "../modals/categoryModel.js";

// Upload artwork
export const createArtwork = async (req, res) => {
    try {
        const { user, image, title, description, price, category } = req.body;


        // Create new artwork document
        const newArtwork = new Artwork({
            user,
            image,
            title,
            description,
            price,
            category,
        });

        // Save artwork document
        if (newArtwork) {
            const savedArtwork = await newArtwork.save();

            // Update user's artworks array
            const userToUpdate = await User.findOneAndUpdate(
                { _id: user },
                { $push: { artworks: savedArtwork._id } },
                { new: true }
            );
            if (userToUpdate) {
                res.status(201).json(savedArtwork);

            } else {
                res.status(404);
                throw new Error("Artist Not Found");
            }
        } else {
            res.status(400);
            throw new Error("Invalid Data!");
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};
// Upload artwork
export const createArtworkAdmin = async (req, res) => {
    try {
        const { user, image, title, description, price, category } = req.body;


        // Create new artwork document
        const newArtwork = new Artwork({
            user,
            image,
            title,
            description,
            price,
            category,
            approved: "true"
        });

        // Save artwork document
        if (newArtwork) {
            const savedArtwork = await newArtwork.save();

            // Update user's artworks array
            const userToUpdate = await User.findOneAndUpdate(
                { _id: user },
                { $push: { artworks: savedArtwork._id } },
                { new: true }
            );
            if (userToUpdate) {
                res.status(201).json(savedArtwork);

            } else {
                res.status(404);
                throw new Error("Artist Not Found");
            }
        } else {
            res.status(400);
            throw new Error("Invalid Data!");
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// Edit artwork
export const updateArtwork = async (req, res) => {
    try {
        const { id } = req.params;
        const { image, title, description, price, type, material } = req.body;

        // Find artwork document and update fields
        const updatedArtwork = await Artwork.findByIdAndUpdate(
            id,
            { image, title, description, price, material },
            { new: true }
        );

        if (!updatedArtwork) {
            return res.status(404).json({ message: "Artwork not found" });
        }

        res.status(200).json(updatedArtwork);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Delete artwork
export const deleteArtwork = async (req, res) => {
    try {
        const { id } = req.params;

        // Find and delete artwork document
        const deletedArtwork = await Artwork.findByIdAndDelete(id);

        if (!deletedArtwork) {
            return res.status(404).json({ message: "Artwork not found" });
        }

        res.status(200).json(deletedArtwork);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get all artwork


export const getAllArtworkByArtist = async (req, res) => {
    try {
        // Find all artwork documents and populate the category field
        const artwork = await Artwork.find({ user: req.params.id }).populate('category');

        res.status(200).json(artwork);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get all artwork
export const getArtworkById = async (req, res) => {
    try {
        // Find all artwork documents
        const artwork = await Artwork.findById(req.params.id);

        res.status(200).json(artwork);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Categorize artwork as available/unavailable
export const categorizeArtwork = async (req, res) => {
    try {
        const { id } = req.params;
        const { available } = req.body;

        // Find artwork document and update availability
        const updatedArtwork = await Artwork.findByIdAndUpdate(
            id,
            { isAvailable: available },
            { new: true }
        );

        if (!updatedArtwork) {
            return res.status(404).json({ message: "Artwork not found" });
        }

        res.status(200).json(updatedArtwork);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Approve artwork (set approved field to true)
export const approveArtwork = async (req, res) => {
    try {
        const { id } = req.params;

        // Find artwork document and set approved field to true
        const updatedArtwork = await Artwork.findByIdAndUpdate(
            id,
            { approved: true },
            { new: true }
        );

        if (!updatedArtwork) {
            return res.status(404).json({ message: "Artwork not found" });
        }
        return res.status(200).json({ artwork: updatedArtwork });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
export const getAllApprovedArtworksForUser = expressAsyncHandler(async (req, res) => {
    const pageSize = 9;
    const page = Number(req.query.pageNumber) || 1;
    const keyword = { approved: true }; // Only fetch approved artwork

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

    const count = await Artwork.countDocuments(keyword);
    const artworks = await Artwork.find(keyword)
        .populate("category")
        .limit(pageSize)
        .skip(pageSize * (page - 1))
        .sort({ _id: -1 });

    res.json({
        artworks,
        page,
        pages: Math.ceil(count / pageSize),
    });
});
// Get all unapproved artworks
export const getAllUnapprovedArtworks = async (req, res) => {
    try {
        // Find all unapproved artwork documents
        const artwork = await Artwork.find().populate('user category')
            .sort({ createdAt: -1 })
            .limit(50); // Adjust the limit as per your requirement


        res.status(200).json(artwork);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
