import { Statuscode } from "../utils/constants.js";
import { JsonGenerate } from "../utils/helpers.js";
import Jwt from "jsonwebtoken";
import { JWT_TOKEN_SECRET } from "../utils/constants.js";
import Artist from "../models/Artist.js";
import Album from "../models/Album.js";
import Track from "../models/Track.js";
import crypto from "crypto";
import Signup from "../models/Signup.js";
const addTrack = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.json(
                JsonGenerate(Statuscode.unauthorized, "Unauthorized Access")
            );
        }
        let decoded;
        try {
            decoded = Jwt.verify(token, JWT_TOKEN_SECRET);
        } catch (err) {
            return res.json(
                JsonGenerate(Statuscode.unauthorized, "Invalid or expired token")
            );
        }
        const loggedInUser = await Signup.findById(decoded.userId);
        if (!loggedInUser || loggedInUser.role == 'Viewer' || loggedInUser.role == 'Editor') {
            return res.json(
                JsonGenerate(Statuscode.forbidden, "Forbidden Access/Operation not allowed.")
            );
        }
        const { artist_id, album_id, name, duration, hidden } = req.body;

        // Basic validation
        if (!artist_id || !album_id || !name || !duration || typeof hidden !== "boolean") {
            return res.json(
                JsonGenerate(Statuscode.bad_request, "Invalid request body")
            );
        }

        // Check if artist exists
        const artist = await Artist.findOne({artist_id});
        if (!artist) {
            return res.json(
                JsonGenerate(Statuscode.not_found, "Artist not found")
            );
        }

        // Check if album exists
        const album = await Album.findOne({album_id});
        console.log(album_id)
        if (!album) {
            return res.json(
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

        return res.json(
            JsonGenerate(Statuscode.success, "Track created successfully.")
        );
    } catch (error) {
        console.error(error);
        return res.json(
            JsonGenerate(Statuscode.not_found, "Bad Request")
        );
    }
};

export default addTrack;