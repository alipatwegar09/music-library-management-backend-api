import Album from "../models/Album.js";
import Artist from "../models/Artist.js";
import Signup from "../models/Signup.js";
import Track from "../models/Track.js";
import { JWT_TOKEN_SECRET, Statuscode } from "../utils/constants.js";
import { JsonGenerate } from "../utils/helpers.js";
import Jwt from 'jsonwebtoken';
const addFavorite = async (req, res) => {
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

        const { category, item_id } = req.body;

        if (!category || !item_id) {
            return res.json(
                JsonGenerate(Statuscode.not_found, "Bad Request")
            );
        }

        if (!['artist', 'album', 'track'].includes(category)) {
            return res.json(
                JsonGenerate(Statuscode.not_found, "Bad Request")
            );
        }

        let itemExists = false;
        switch (category) {
            case 'artist':
                itemExists = await Artist.exists({ artist_id: item_id });
                break;
            case 'album':
                itemExists = await Album.exists({ album_id: item_id });
                break;
            case 'track':
                itemExists = await Track.exists({ track_id: item_id });
                break;
        }

        if (!itemExists) {

            return res.json(
                JsonGenerate(Statuscode.not_found, "Bad Request")
            );
        }

        const user = await Signup.findById(decoded.userId);
        if (!user) {
            return res.json(
                JsonGenerate(Statuscode.forbidden, "Forbidden Access/Operation not allowed.")
            );
        }

        if (user.favorites.some(fav => fav.category === category && fav.item_id === item_id)) {
            return res.json(
                JsonGenerate(Statuscode.bad_request, "Bad Request")
            );
        }

        user.favorites.push({ category, item_id, created_at: Date.now() });
        await user.save();

        return res.json(
            JsonGenerate(Statuscode.success, "Favourites added successfully.")
        );
    } catch (error) {
        console.error(error);
        return res.json(
            JsonGenerate(Statuscode.not_found, "Bad Request")
        );
    }
};

export default addFavorite;