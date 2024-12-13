import { Statuscode } from "../utils/constants.js";
import { JsonGenerate } from "../utils/helpers.js";
import Jwt from 'jsonwebtoken';
import { JWT_TOKEN_SECRET } from "../utils/constants.js";
import Album from "../models/Album.js";
import Signup from "../models/Signup.js";

const GetAlbumControllerById = async (req, res) => {
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
        const { album_id } = req.params;
        const album = await Album.findOne({ album_id });
        if (!album) {
            return res.json(
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
        return res.json(
            JsonGenerate(Statuscode.bad_request, "Bad Request while retrieving the Album.")
        );
    }
};

export default GetAlbumControllerById;
