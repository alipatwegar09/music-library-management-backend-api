import mongoose from "mongoose";

const TrackSchema = new mongoose.Schema({
    track_id: { type: String, required: true, unique: true },
    artist_id: { type: String, required: true, unique: true },
    album_id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    duration: { type: Number, default: 0 },
    hidden: { type: Boolean, default: false },
});

const Track = mongoose.model("Track", TrackSchema);

export default Track;
