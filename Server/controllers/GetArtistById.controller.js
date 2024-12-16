import { Statuscode } from "../utils/constants.js";
import { JsonGenerate } from "../utils/helpers.js"; 
import Jwt from 'jsonwebtoken'; 
import { JWT_TOKEN_SECRET } from "../utils/constants.js"; 
import Artist from "../models/Artist.js"; 
import Signup from "../models/Signup.js";

const GetArtistControllerById = async (req, res) => {
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
        if (!loggedInUser) {
            return res.json(
                JsonGenerate(Statuscode.forbidden, "Forbidden Access/Operation not allowed.")
            );
        }

        const { artist_id } = req.params;
        const artist = await Artist.findOne({ artist_id });
        if (!artist) {
            return res.json(
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
        return res.json(
            JsonGenerate(Statuscode.bad_request, "Bad Request while retrieving the artist.")
        );
    }
};

export default GetArtistControllerById;
