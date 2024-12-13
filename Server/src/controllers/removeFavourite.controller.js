import Signup from "../models/Signup.js";
import { JWT_TOKEN_SECRET, Statuscode } from "../utils/constants.js";
import { JsonGenerate } from "../utils/helpers.js";
import Jwt from 'jsonwebtoken';

const removeFavorite = async (req, res) => {
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

        const { id: favoriteId } = req.params;

        const user = await Signup.findById(decoded.userId);
        if (!user) {
            return res.json(
                JsonGenerate(Statuscode.forbidden, "Forbidden Access/Operation not allowed.")
            );
        }

        const favoriteIndex = user.favorites.findIndex(fav => fav._id.toString() === favoriteId);
        if (favoriteIndex === -1) {
            return res.json(
                JsonGenerate(Statuscode.not_found, "Bad Request")
            );
        }

        user.favorites.splice(favoriteIndex, 1);
        await user.save();
        return res.json(
            JsonGenerate(Statuscode.success, "Favorite removed successfully.")
        );
    } catch (error) {
        console.error(error);
        return res.json(
            JsonGenerate(Statuscode.not_found, "Bad Request")
        );
    }
};

export default removeFavorite;
