import { Statuscode } from "../utils/constants.js";
import { JsonGenerate } from "../utils/helpers.js";
import Jwt from 'jsonwebtoken';
import { JWT_TOKEN_SECRET } from "../utils/constants.js";
import Signup from "../models/Signup.js";
import Track from "../models/Track.js";

const updateTrack = async (req, res) => {
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
                JsonGenerate(Statuscode.unauthorized, "Bad Request")
            );
        }

        const loggedInUser = await Signup.findById(decoded.userId);
        if (!loggedInUser || loggedInUser.role == 'Viewer') {
            return res.json(
                JsonGenerate(Statuscode.forbidden, "Forbidden Access. You must be an admin.")
            );
        }
        const { track_id } = req.params;
        const track = await Track.findOne({ track_id });

        if (!track) {
            return res.json(
                JsonGenerate(Statuscode.not_found, "Track not found")
            );
        }
        const { name, duration, hidden } = req.body;
        if (name) track.name = name;
        if (duration !== undefined) track.duration = duration;
        if (hidden !== undefined) track.hidden = hidden;

        await track.save();

        return res.json(
            JsonGenerate(Statuscode.success, "Track updated successfully")
        );
    } catch (error) {
        console.error("Error updating Track:", error.message);
        return res.json(
            JsonGenerate(Statuscode.bad_request, "Bad Request while updating the Track")
        );
    }
};

export default updateTrack;
