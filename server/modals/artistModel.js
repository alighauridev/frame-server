import mongoose from "mongoose";

const artistSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

});

const Artist = mongoose.model("ArtistInfo", artistSchema);
export default Artist;
