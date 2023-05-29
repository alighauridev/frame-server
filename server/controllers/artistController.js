import Category from "../modals/categoryModel.js";
import Artist from "../modals/artistModel.js";
import User from "../modals/userModal.js";
import { admin } from "../middlewares/authMiddleware.js";
// Create API route to get all artists
app.get("/artists", admin, async (req, res) => {
    try {
        const artists = await Artist.find().populate("User");
        res.json(artists);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});

// Create API route to create a new artist
app.post("/artists", async (req, res) => {
    try {
        const { user } = req.body;

        // Update the user's isArtist field to true
        const updatedUser = await User.findOneAndUpdate(
            { _id: user },
            { isArtist: true },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Create a new artist document
        const artist = new Artist({
            user: updatedUser._id,
        });

        await artist.save();

        res.json(artist);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});

// Create API route to delete an artist
app.delete("/artists/:id", async (req, res) => {
    try {
        await Artist.findByIdAndDelete(req.params.id);
        res.json({ msg: "Artist deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});
