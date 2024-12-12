import { Statuscode } from "../utils/constants.js";
import { JsonGenerate } from "../utils/helpers.js";
import Jwt from 'jsonwebtoken';
import { JWT_TOKEN_SECRET } from "../utils/constants.js";
import Signup from "../models/Signup.js";
import bcrypt from 'bcrypt';

const UpdatePasswordController = async (req, res) => {
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
            return res.status(Statuscode.forbidden).json(
                JsonGenerate(Statuscode.forbidden, "Forbidden Access/Operation not allowed.")
            );
        }

        const user = await Signup.findById(decoded.userId);
        if (!user) {
            return res.status(Statuscode.not_found).json(
                JsonGenerate(Statuscode.not_found, "User not found.")
            );
        }

        const { old_password, new_password } = req.body;

        const isOldPasswordValid = await bcrypt.compare(old_password, user.password);
        if (!isOldPasswordValid) {
            return res.status(Statuscode.bad_request).json(
                JsonGenerate(Statuscode.bad_request, "old password is wrong")
            );
        }

        const hashedNewPassword = await bcrypt.hash(new_password, 10);
        user.password = hashedNewPassword;
        await user.save();

        return res.status(Statuscode.password_sucess).send()
    } catch (error) {
        return res.status(Statuscode.bad_request).json(
            JsonGenerate(Statuscode.bad_request, "Bad Request")
        );
    }
};

export default UpdatePasswordController;
