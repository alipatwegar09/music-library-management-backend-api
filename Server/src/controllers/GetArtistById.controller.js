import { Statuscode } from "../utils/constants.js";
import { JsonGenerate } from "../utils/helpers.js"; 
import Jwt from 'jsonwebtoken'; 
import { JWT_TOKEN_SECRET } from "../utils/constants.js"; 
import Artist from "../models/Artist.js"; 

const GetArtistControllerById = async (req, res) => {
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

        const { artist_id } = req.params;
        const artist = await Artist.findOne({ artist_id });
        if (!artist) {
            return res.status(Statuscode.not_found).json(
                JsonGenerate(Statuscode.not_found, "Artist not found.")
            );
        }

        const {  name, grammy, hidden } = artist;

        return res.json(
            JsonGenerate(Statuscode.success, "Artist retrieved successfully", {
                artist_id,
                name,
                grammy,
                hidden,
            })
        );
    } catch (error) {
        console.error("Error retrieving artist:", error.message);
        return res.status(Statuscode.bad_request).json(
            JsonGenerate(Statuscode.bad_request, "An error occurred while retrieving the artist.")
        );
    }
};

export default GetArtistControllerById;
