import { Statuscode } from "../utils/constants.js";
import { JsonGenerate } from "../utils/helpers.js";
import Jwt from 'jsonwebtoken';
import { JWT_TOKEN_SECRET } from "../utils/constants.js";
import Signup from "../models/Signup.js";
import Track from "../models/Track.js";

const deleteTrack = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.json(
                JsonGenerate(Statuscode.unauthorized, "No token provided, please log in")
            );
        }

        let decoded;
        try {
            decoded = Jwt.verify(token, JWT_TOKEN_SECRET);
        } catch (err) {
            return res.json(
                JsonGenerate(Statuscode.unauthorized, "Invalid or expired token, please log in again")
            );
        }

        const loggedInUser = await Signup.findById(decoded.userId);
        if (!loggedInUser || loggedInUser.role !== 'Admin') {
            return res.status(Statuscode.forbidden).json(
                JsonGenerate(Statuscode.forbidden, "Forbidden Access. You must be an admin.")
            );
        }

        const { track_id } = req.params;
        const track = await Track.findOne({ track_id });
        if (!track) {
            return res.status(Statuscode.not_found).json(
                JsonGenerate(Statuscode.not_found, "track not found")
            );
        }

        await Track.deleteOne({ track_id });
        return res.json(
            JsonGenerate(Statuscode.success, `track: ${track.name} deleted successfully`, { track_id: track.track_id })
        );
    } catch (error) {
        console.error("Error deleting track:", error.message);
        return res.json(
            JsonGenerate(Statuscode.bad_request, "An error occurred while deleting the track")
        );
    }
};

export default deleteTrack;
