import mongoose from "mongoose";

const AlbumSchema = new mongoose.Schema({
    album_id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    year: { type: Number, default: new Date().getFullYear() },
    hidden: { type: Boolean, default: false },
});

const Album = mongoose.model("Album", AlbumSchema);

export default Album;
