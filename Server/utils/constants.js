
import dotenv from 'dotenv';
dotenv.config();

export const DB_CONNECT = process.env.DB_CONNECT;

export const JWT_TOKEN_SECRET = process.env.JWT_TOKEN_SECRET;

export const Statuscode={
    success:201,
    bad_request:400,
    unprocessable:409,
    success_done:200,
    unauthorized:401,
    forbidden:403,
    not_found:404,
    password_sucess:204
}