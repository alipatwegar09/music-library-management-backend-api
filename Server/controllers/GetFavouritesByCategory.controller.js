import Signup from "../models/Signup.js";
import { JWT_TOKEN_SECRET, Statuscode } from "../utils/constants.js";
import Jwt from 'jsonwebtoken';
import { JsonGenerate } from "../utils/helpers.js";
import Artist from "../models/Artist.js";
import Album from "../models/Album.js";
import Track from "../models/Track.js";

const getFavoritesByCategory = async (req, res) => {
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
                JsonGenerate(Statuscode.bad_request, "Bad Request")
            );
        }

        const category = req.params.category;
        const validCategories = ['artist', 'album', 'track'];

        if (!validCategories.includes(category)) {
            return res.json(
                JsonGenerate(Statuscode.bad_request, "Invalid category. Must be 'artist', 'album', or 'track'.")
            );
        }
        const limit = parseInt(req.query.limit) || 5;
        const offset = parseInt(req.query.offset) || 0;


        const user = await Signup.findById(decoded.userId);
        if (!user) {
            return res.json(
                JsonGenerate(Statuscode.forbidden, "Forbidden Access/Operation not allowed.")
            );
        }

        let favorites = user.favorites.filter(fav => fav.category === category);
        const paginatedFavorites = favorites.slice(offset, offset + limit);
        if (paginatedFavorites.length === 0) {
            return res.json(
                JsonGenerate(Statuscode.not_found, "Bad Request")
            );
        }

        const favoritesResponse = await Promise.all(paginatedFavorites.map(async (fav) => {
            let relatedItem;
            if (category === 'artist') {
                relatedItem = await Artist.findOne({artist_id:fav.item_id});
            } else if (category === 'album') {
                relatedItem = await Album.findOne({album_id:fav.item_id});
            } else if (category === 'track') {
                relatedItem = await Track.findOne({track_id:fav.item_id});
            }
            if (!relatedItem) {
                return {
                    favorite_id: fav._id,
                    category: fav.category,
                    item_id: fav.item_id,
                    name: "Not Found",
                    created_at: fav.created_at,
                };
            }

            return {
                favorite_id: fav._id,
                category: fav.category,
                item_id: fav.item_id,
                name: relatedItem.name || "No name available",
                created_at: fav.created_at,
            };
        }));

        return res.json(
            JsonGenerate(Statuscode.success, "Favorites retrieved successfully.", favoritesResponse)
        );
    } catch (error) {
        console.error(error);
        return res.json(
            JsonGenerate(Statuscode.bad_request, "Bad Request")
        );
    }
};


export default getFavoritesByCategory;