import { Statuscode } from "../utils/constants.js";
import { JsonGenerate } from "../utils/helpers.js";
import Jwt from 'jsonwebtoken';
import { JWT_TOKEN_SECRET } from "../utils/constants.js";
import User from '../models/Signup.js';

const GetUsersController = async (req, res) => {
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
        const loggedInUser = await User.findById(decoded.userId);
        console.log(loggedInUser,loggedInUser.role)
        if (!loggedInUser || loggedInUser.role !== 'Admin') {
            return res.json(
                JsonGenerate(Statuscode.unauthorized, "Unauthorized Access")
            );
        }

        const limit = parseInt(req.query.limit) || 5;
        const offset = parseInt(req.query.offset) || 0;
        const role = req.query.role;
        const query = {};
        if (role) {
            query.role = role
        }
        const users = await User.find(query)
            .skip(offset)
            .limit(limit)
            .select('user_id email role created_at');

        return res.json(
            JsonGenerate(Statuscode.success, "Users retrieved successfully.", users)
        );
    } catch (error) {
        return res.json(
            JsonGenerate(Statuscode.bad_request, "An error occurred while retrieving users")
        );
    }
};

export default GetUsersController;