import { JWT_TOKEN_SECRET, Statuscode } from "../utils/constants.js";
import { JsonGenerate } from "../utils/helpers.js";
import Jwt from 'jsonwebtoken'
import Signup from "../models/Signup.js";
import Track from "../models/Track.js";
import Artist from "../models/Artist.js";
import Album from "../models/Album.js";
const getAllTracks = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.json(
                JsonGenerate(Statuscode.bad_request, "No token provided, please log in")
            );
        }

        let decoded;
        try {
            decoded = Jwt.verify(token, JWT_TOKEN_SECRET);
        } catch (err) {
            return res.json(
                JsonGenerate(Statuscode.bad_request, "Invalid or expired token, please log in again")
            );
        }
        const loggedInUser = await Signup.findById(decoded.userId);

        if (!loggedInUser) {
            return res.json(
                JsonGenerate(Statuscode.unauthorized, "Unauthorized Access")
            );
        }

        const limit = parseInt(req.query.limit) || 5;
        const offset = parseInt(req.query.offset) || 0;
        const artist_id = req.query.artist_id || null;
        const album_id = req.query.album_id || null;
        const hidden = req.query.hidden === 'true';

        const filters = {};
        if (artist_id) filters.artist_id = artist_id;
        if (album_id) filters.album_id = album_id;
        if (req.query.hidden !== undefined) filters.hidden = hidden;
        const tracks = await Track.find(filters)
            .skip(offset)
            .limit(limit);
            
        if (!tracks.length) {
            return res.status(404).json({
                status: 404,
                message: "No tracks found",
                data: [],
                error: null,
            });
        }
        const enrichedTracks = await Promise.all(
            tracks.map(async (track) => {
                const artist = await Artist.findOne({ artist_id: track.artist_id });
                const album = await Album.findOne({ album_id: track.album_id });

                return {
                    track_id: track._id,
                    artist_name: artist ? artist.name : "Unknown Artist",
                    album_name: album ? album.name : "Unknown Album",
                    name: track.name,
                    duration: track.duration,
                    hidden: track.hidden,
                };
            })
        );

        return res.json(
            JsonGenerate(Statuscode.success, "Albums retreived successfully.", enrichedTracks)
        );
    } catch (error) {
        console.error(error);
        return res.json(
            JsonGenerate(Statuscode.bad_request, "An error occurred")
        );
    }
};

export default getAllTracks;