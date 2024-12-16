import {check} from "express-validator";

export const SignupSchema=[
    check('email','email is required').exists().isEmail(),
    check('password',' password is required').exists().isLength({min:1, max:100}).trim()
]