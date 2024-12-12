import mongoose from "mongoose";

const ArtistSchema = new mongoose.Schema({
    artist_id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    grammy: { type: Number, default: 0 },
    hidden: { type: Boolean, default: false },
});

const Artist = mongoose.model("Artist", ArtistSchema);

export default Artist;
