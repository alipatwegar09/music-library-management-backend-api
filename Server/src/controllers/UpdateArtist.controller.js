import Artist from "../models/Artist.js";
import { Statuscode } from "../utils/constants.js";
import { JsonGenerate } from "../utils/helpers.js";
import Jwt from 'jsonwebtoken';
import { JWT_TOKEN_SECRET } from "../utils/constants.js";
import Signup from "../models/Signup.js";

const updateArtist = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(Statuscode.unauthorized).json(
                JsonGenerate(Statuscode.unauthorized, "No token provided, please log in")
            );
        }

        let decoded;
        try {
            decoded = Jwt.verify(token, JWT_TOKEN_SECRET);
        } catch (err) {
            return res.status(Statuscode.unauthorized).json(
                JsonGenerate(Statuscode.unauthorized, "Invalid or expired token, please log in again")
            );
        }

        const loggedInUser = await Signup.findById(decoded.userId);
        if (!loggedInUser || loggedInUser.role !== 'Admin') {
            return res.status(Statuscode.forbidden).json(
                JsonGenerate(Statuscode.forbidden, "Forbidden Access. You must be an admin.")
            );
        }
        const { artist_id } = req.params;
        const artist = await Artist.findOne({ artist_id });

        if (!artist) {
            return res.status(Statuscode.not_found).json(
                JsonGenerate(Statuscode.not_found, "Artist not found")
            );
        }
        const { name, grammy, hidden } = req.body;
        if (name) artist.name = name;
        if (grammy !== undefined) artist.grammy = grammy;
        if (hidden !== undefined) artist.hidden = hidden;

        await artist.save();

        return res.status(Statuscode.success).json(
            JsonGenerate(Statuscode.success, "Artist updated successfully")
        );
    } catch (error) {
        console.error("Error updating artist:", error.message);
        return res.status(Statuscode.bad_request).json(
            JsonGenerate(Statuscode.bad_request, "An error occurred while updating the artist")
        );
    }
};

export default updateArtist;
