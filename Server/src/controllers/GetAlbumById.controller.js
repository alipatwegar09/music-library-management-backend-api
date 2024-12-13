import { Statuscode } from "../utils/constants.js";
import { JsonGenerate } from "../utils/helpers.js";
import Jwt from 'jsonwebtoken';
import { JWT_TOKEN_SECRET } from "../utils/constants.js";
import Album from "../models/Album.js";

const GetAlbumControllerById = async (req, res) => {
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

        const { album_id } = req.params;
        const album = await Album.findOne({ album_id });
        if (!album) {
            return res.status(Statuscode.not_found).json(
                JsonGenerate(Statuscode.not_found, "Album not found.")
            );
        }

        const { name, year, hidden } = album;

        return res.json(
            JsonGenerate(Statuscode.success, "Album retrieved successfully", {
                album_id,
                name,
                year,
                hidden,
            })
        );
    } catch (error) {
        console.error("Error retrieving Album:", error.message);
        return res.status(Statuscode.bad_request).json(
            JsonGenerate(Statuscode.bad_request, "An error occurred while retrieving the Album.")
        );
    }
};

export default GetAlbumControllerById;
