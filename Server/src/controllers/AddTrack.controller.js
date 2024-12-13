import { Statuscode } from "../utils/constants.js";
import { JsonGenerate } from "../utils/helpers.js";
import Jwt from "jsonwebtoken";
import { JWT_TOKEN_SECRET } from "../utils/constants.js";
import Artist from "../models/Artist.js";
import Album from "../models/Album.js";
import Track from "../models/Track.js";
import crypto from "crypto";
const addTrack = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(Statuscode.unauthorized).json(
                JsonGenerate(Statuscode.unauthorized, "Unauthorized Access")
            );
        }
        let decoded;
        try {
            decoded = Jwt.verify(token, JWT_TOKEN_SECRET);
        } catch (err) {
            return res.status(Statuscode.unauthorized).json(
                JsonGenerate(Statuscode.unauthorized, "Invalid or expired token")
            );
        }

        const { artist_id, album_id, name, duration, hidden } = req.body;

        // Basic validation
        if (!artist_id || !album_id || !name || !duration || typeof hidden !== "boolean") {
            return res.status(Statuscode.bad_request).json(
                JsonGenerate(Statuscode.bad_request, "Invalid request body")
            );
        }

        // Check if artist exists
        const artist = await Artist.findOne({artist_id});
        if (!artist) {
            return res.status(Statuscode.not_found).json(
                JsonGenerate(Statuscode.not_found, "Artist not found")
            );
        }

        // Check if album exists
        const album = await Album.findOne({album_id});
        console.log(album_id)
        if (!album) {
            return res.status(Statuscode.not_found).json(
                JsonGenerate(Statuscode.not_found, "Album not found")
            );
        }

        // Create a new track document
        const newTrack = new Track({
            track_id: crypto.randomUUID(),
            artist_id,
            album_id,
            name,
            duration,
            hidden,
        });
        console.log("new track",newTrack)
        // Save the new track to the database
        await newTrack.save();

        return res.status(Statuscode.success).json(
            JsonGenerate(Statuscode.success, "Track created successfully.")
        );
    } catch (error) {
        console.error(error);
        return res.status(Statuscode.not_found).json(
            JsonGenerate(Statuscode.not_found, "Internal server error")
        );
    }
};

export default addTrack;