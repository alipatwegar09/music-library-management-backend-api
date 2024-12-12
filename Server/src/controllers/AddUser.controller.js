import { Statuscode } from "../utils/constants.js";
import { JsonGenerate } from "../utils/helpers.js";
import Jwt from 'jsonwebtoken';
import { JWT_TOKEN_SECRET } from "../utils/constants.js";
import Signup from "../models/Signup.js";
import bcrypt from 'bcrypt';
const AddUserController = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(Statuscode.unauthorized).json(
                JsonGenerate(Statuscode.unauthorized, "No token provided, please log in")
            );
        }

        // Verify the token and decode it
        let decoded;
        try {
            decoded = Jwt.verify(token, JWT_TOKEN_SECRET);
        } catch (err) {
            return res.status(Statuscode.unauthorized).json(
                JsonGenerate(Statuscode.unauthorized, "Invalid or expired token, please log in again")
            );
        }

        // Check if the user role is Admin
        const loggedInUser = await Signup.findById(decoded.userId);
        
        if (!loggedInUser || loggedInUser.role !== 'Admin') {
            return res.status(Statuscode.forbidden).json(
                JsonGenerate(Statuscode.forbidden, "Forbidden Access/Operation not allowed.")
            );
        }

        const { email, password, role } = req.body;

        // Validate role
        if (role === 'Admin') {
            return res.status(Statuscode.bad_request).json(
                JsonGenerate(Statuscode.bad_request, "Cannot create a user with the admin role.")
            );
        }

        // Check if user already exists
        const existingUser = await Signup.findOne({ email });
        console.log('existingUser', existingUser)
        if (existingUser) {
            return res.status(Statuscode.unprocessable).json(
                JsonGenerate(Statuscode.unprocessable, "Email already exists.")
            );
        }

        // Create the new user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new Signup({
            email:email,
            password: hashedPassword,
            role: role,
        });
        console.log('new User',newUser)
        await newUser.save();

        return res.status(Statuscode.success).json(
            JsonGenerate(Statuscode.success, "User created successfully.")
        );
    } catch (error) {
        return res.status(Statuscode.bad_request).json(
            JsonGenerate(Statuscode.bad_request, "An error occurred while creating the user")
        );
    }
};

export default AddUserController;
