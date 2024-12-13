import Album from "../models/Album.js";
import Signup from "../models/Signup.js";
import { JWT_TOKEN_SECRET, Statuscode } from "../utils/constants.js";
import { JsonGenerate } from "../utils/helpers.js";
import crypto from "crypto";
import Jwt from 'jsonwebtoken'
const addAlbum = async (req, res) => {
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
                JsonGenerate(Statuscode.unauthorized, "Invalid or expired token, please log in again")
            );
        }
        const loggedInUser = await Signup.findById(decoded.userId);
        if (!loggedInUser) {
            return res.json(
                JsonGenerate(Statuscode.forbidden, "Forbidden Access/Operation not allowed.")
            );
        }
        const { name, year, hidden } = req.body;

        if (!name || typeof name !== "string" || name.trim().length === 0) {
            return res.json(
                JsonGenerate(Statuscode.bad_request, "Name is required and must be a valid string.")
            );
        }

        const newAlbum = new Album({
            album_id: crypto.randomUUID(),
            name: name.trim(),
            year: year,
            hidden: hidden || false,
        });

        await newAlbum.save();
        return res.json(
            JsonGenerate(Statuscode.success, "Album created successfully.")
        );
    } catch (error) {
        console.error("Error adding Album:", error.message);
        return res.json(
            JsonGenerate(Statuscode.bad_request, "An error occurred while creating the Album.", error.message)
        );
    }
};

export default addAlbum;