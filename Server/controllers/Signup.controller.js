import { validationResult } from "express-validator";
import { JWT_TOKEN_SECRET, Statuscode } from "../utils/constants.js";
import { JsonGenerate } from "../utils/helpers.js";
import Signup from "../models/Signup.js";
import bcrypt from 'bcrypt';
import Jwt from 'jsonwebtoken'
const SignupController = async(req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => err.msg).join(", ");
    return res.json(
      JsonGenerate(Statuscode.bad_request, `Bad Request, Reason: ${errorMessages}`)
    );
  }
  const { email, password,role } = req.body;

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);
  const emailExist=await Signup.findOne({
    email:email
  })

  if(emailExist){
    return res.json(
      JsonGenerate(Statuscode.unprocessable, "Email Already Exists")
    );
  }
  try {
    const result = await Signup.create({
      email: email,
      password: hashPassword,
      role:role,
    })
    const token = Jwt.sign({userId:result._id},JWT_TOKEN_SECRET)
    return res.json(
      JsonGenerate(Statuscode.success, "User Created Successfully")
    );
  }
  catch (error) {
    console.log(error)
  }

};

export default SignupController;
