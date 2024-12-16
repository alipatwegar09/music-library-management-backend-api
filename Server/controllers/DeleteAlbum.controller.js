import { Statuscode } from "../utils/constants.js";
import { JsonGenerate } from "../utils/helpers.js";
import Jwt from 'jsonwebtoken';
import { JWT_TOKEN_SECRET } from "../utils/constants.js";
import Signup from "../models/Signup.js";
import Album from "../models/Album.js";

const deleteAlbum = async (req, res) => {
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

        const { album_id } = req.params;
        const album = await Album.findOne({ album_id });
        if (!album) {
            return res.json(
                JsonGenerate(Statuscode.not_found, "Album not found")
            );
        }

        await Album.deleteOne({ album_id });
        return res.json(
            JsonGenerate(Statuscode.success, `Album: ${album.name} deleted successfully`, { album_id: album.album_id })
        );
    } catch (error) {
        console.error("Error deleting album:", error.message);
        return res.json(
            JsonGenerate(Statuscode.bad_request, "Bad Request while deleting the album")
        );
    }
};

export default deleteAlbum;
