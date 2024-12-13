import { JWT_TOKEN_SECRET, Statuscode } from "../utils/constants.js";
import { JsonGenerate } from "../utils/helpers.js";
import Jwt from 'jsonwebtoken'
import Signup from "../models/Signup.js";
import Album from "../models/Album.js";
const getAlbums = async (req, res) => {
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

        const query = {};
        const albums = await Album.find(query)
            .skip(offset)
            .limit(limit)
            .select('album_id name year hidden');
        return res.json(
            JsonGenerate(Statuscode.success, "Albums retreived successfully.", albums)
        );
    } catch (error) {
        return res.json(
            JsonGenerate(Statuscode.bad_request, "An error occurred")
        );
    }
};

export default getAlbums;
