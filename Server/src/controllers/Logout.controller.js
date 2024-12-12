import { Statuscode } from "../utils/constants.js";
import { JsonGenerate } from "../utils/helpers.js";
import Jwt from 'jsonwebtoken';
import { JWT_TOKEN_SECRET } from "../utils/constants.js";

const LogoutController = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.json(
                JsonGenerate(Statuscode.bad_request, "Bad request")
            );
        }

        try {
            Jwt.verify(token, JWT_TOKEN_SECRET);
        } catch (err) {
            return res.json(
                JsonGenerate(Statuscode.bad_request, "Bad request")
            );
        }
        return res.json(
            JsonGenerate(Statuscode.logout_success, "User Logged out Successful")
        );
    } catch (error) {
        return res.json(
            JsonGenerate(Statuscode.bad_request, "Bad request")
        );
    }
}

export default LogoutController;