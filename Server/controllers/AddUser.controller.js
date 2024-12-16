import { Statuscode } from "../utils/constants.js";
import { JsonGenerate } from "../utils/helpers.js";
import Jwt from 'jsonwebtoken';
import { JWT_TOKEN_SECRET } from "../utils/constants.js";
import Signup from "../models/Signup.js";
import bcrypt from 'bcrypt';
import { validationResult } from "express-validator";
const AddUserController = async (req, res) => {
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
                JsonGenerate(Statuscode.unauthorized, "Unauthorized Access")
            );
        }

        const loggedInUser = await Signup.findById(decoded.userId);
        
        if (!loggedInUser || loggedInUser.role !== 'Admin') {
            return res.json(
                JsonGenerate(Statuscode.forbidden, "Forbidden Access/Operation not allowed.")
            );
        }
        const { email, password, role } = req.body;
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.json(
                JsonGenerate(Statuscode.bad_request, "Bad Request")
            );
        }
        if (role === 'Admin') {
            return res.json(
                JsonGenerate(Statuscode.bad_request, "Cannot create a user with the admin role.")
            );
        }
        const existingUser = await Signup.findOne({ email });
        if (existingUser) {
            return res.json(
                JsonGenerate(Statuscode.unprocessable, "Email already exists.")
            );
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new Signup({
            email:email,
            password: hashedPassword,
            role: role,
        });
        await newUser.save();

        return res.json(
            JsonGenerate(Statuscode.success, "User created successfully.")
        );
    } catch (error) {
        return res.json(
            JsonGenerate(Statuscode.bad_request, "Bad Request while creating the user")
        );
    }
};

export default AddUserController;
