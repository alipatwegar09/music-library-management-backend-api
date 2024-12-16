import Artist from "../models/Artist.js";
import Signup from "../models/Signup.js";
import { JWT_TOKEN_SECRET, Statuscode } from "../utils/constants.js";
import { JsonGenerate } from "../utils/helpers.js";
import crypto from "crypto";
import Jwt from 'jsonwebtoken'
const addArtist = async (req, res) => {
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
        if (!loggedInUser || loggedInUser.role == 'Viewer' || loggedInUser.role == 'Editor') {
            return res.json(
                JsonGenerate(Statuscode.forbidden, "Forbidden Access/Operation not allowed.")
            );
        }
        const { name, grammy, hidden } = req.body;

        if (!name || typeof name !== "string" || name.trim().length === 0) {
            return res.json(
                JsonGenerate(Statuscode.bad_request, "Name is required and must be a valid string.")
            );
        }

        if (grammy !== undefined && (isNaN(grammy) || grammy < 0)) {
            return res.json(
                JsonGenerate(Statuscode.bad_request, "Grammy count must be a non-negative number.")
            );
        }

        if (hidden !== undefined && typeof hidden !== "boolean") {
            return res.json(
                JsonGenerate(Statuscode.bad_request, "Hidden must be a boolean value.")
            );
        }

        const newArtist = new Artist({
            artist_id: crypto.randomUUID(),
            name: name.trim(),
            grammy: grammy || 0,
            hidden: hidden || false,
        });

        await newArtist.save();
        return res.json(
            JsonGenerate(Statuscode.success, "Artist created successfully.")
        );
    } catch (error) {
        console.error("Error adding artist:", error.message);
        return res.json(
            JsonGenerate(Statuscode.bad_request, "Bad Request while creating the artist.", error.message)
        );
    }
};

export default addArtist;