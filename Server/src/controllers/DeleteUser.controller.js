import { Statuscode } from "../utils/constants.js";
import { JsonGenerate } from "../utils/helpers.js";
import Jwt from 'jsonwebtoken';
import { JWT_TOKEN_SECRET } from "../utils/constants.js";
import Signup from "../models/Signup.js";

const DeleteUserController = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(Statuscode.unauthorized).json(
                JsonGenerate(Statuscode.unauthorized, "Unauthorized Access")
            );
        }

        let decoded;
        try {
            decoded = Jwt.verify(token, JWT_TOKEN_SECRET);
        } catch (err) {
            return res.status(Statuscode.unauthorized).json(
                JsonGenerate(Statuscode.unauthorized, "Unauthorized Access")
            );
        }
        const loggedInUser = await Signup.findById(decoded.userId);
        if (!loggedInUser || loggedInUser.role !== 'Admin') {
            return res.status(Statuscode.forbidden).json(
                JsonGenerate(Statuscode.forbidden, "Forbidden Access/Operation not allowed.")
            );
        }

        const { user_id } = req.params;

        const userToDelete = await Signup.findById(user_id);
        if (!userToDelete) {
            return res.status(Statuscode.not_found).json(
                JsonGenerate(Statuscode.not_found, "User not found.")
            );
        }
        await Signup.findByIdAndDelete(user_id);

        return res.status(Statuscode.success).json(
            JsonGenerate(Statuscode.success, "User deleted successfully.")
        );
    } catch (error) {
        return res.status(Statuscode.not_found).json(
            JsonGenerate(Statuscode.not_found, "User not found.")
        );
    }
};

export default DeleteUserController;
