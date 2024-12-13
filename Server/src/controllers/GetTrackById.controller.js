import { Statuscode } from "../utils/constants.js";
import { JsonGenerate } from "../utils/helpers.js";
import Jwt from "jsonwebtoken";
import { JWT_TOKEN_SECRET } from "../utils/constants.js";
import Track from "../models/Track.js";
import Artist from "../models/Artist.js";
import Album from "../models/Album.js";

const GetTrackControllerById = async (req, res) => {
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

        const {track_id} = req.params;

        if (!track_id) {
            return res.json(
                JsonGenerate(Statuscode.bad_request, "Track ID is required.")
            );
        }

        const track = await Track.findOne({ track_id });
        console.log(track)
        if (!track) {
            return res.json(
                JsonGenerate(Statuscode.not_found, "Track not found.")
            );
        }
        const artist = await Artist.findOne({ artist_id: track.artist_id });
        const album = await Album.findOne({ album_id: track.album_id });
        console.log(artist);
        console.log(album)
        if (!artist || !album) {
            return res.json(
                JsonGenerate(Statuscode.not_found, "Associated artist or album not found.")
            );
        }

        const trackData = {
            track_id: track.track_id,
            artist_name: artist.name,
            album_name: album.name,
            name: track.name,
            duration: track.duration,
            hidden: track.hidden,
        };

        return res.json(
            JsonGenerate(Statuscode.success, "Track retrieved successfully.", trackData)
        );
    } catch (error) {
        console.error(error);
        return res.json(
            JsonGenerate(Statuscode.not_found, "Bad Request")
        );
    }
};

export default GetTrackControllerById;
