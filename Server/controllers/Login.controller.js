import { validationResult } from "express-validator"
import Signup from "../models/Signup.js";
import bcrypt from 'bcrypt';
import Jwt from 'jsonwebtoken'
import { JWT_TOKEN_SECRET, Statuscode } from "../utils/constants.js";
import { JsonGenerate } from "../utils/helpers.js";
const LoginController = async (req, res) => {
    const errors=validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(err => err.msg).join(", ");
        return res.json(
            JsonGenerate(Statuscode.bad_request, `Bad Request, Reason: ${errorMessages}`)
        );
    }
    if(errors.isEmpty()){
        const {email,password}=req.body;

        const user=await Signup.findOne({email:email})
        if(!user){
            return res.json(
                JsonGenerate(Statuscode.not_found, "User not found")
            );
        }
        const verified = bcrypt.compareSync(password, user.password)
        if (!verified) {
            return res.json(
                JsonGenerate(Statuscode.not_found, "User not found")
            );
        }

        const token = Jwt.sign({ userId: user._id }, JWT_TOKEN_SECRET)
        return res.json(
            JsonGenerate(Statuscode.success_done, "login Successfull", { token: token })
        );
    }
    
}

export default LoginController