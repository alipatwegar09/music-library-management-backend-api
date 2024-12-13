import express from "express"
import apiRoute from "./routes/api.js";
import { DB_CONNECT } from "./utils/constants.js";
import mongoose from "mongoose";
import { checkTokenBlacklist } from "./controllers/Logout.controller.js";
import dotenv from 'dotenv';
dotenv.config();
const app=express();

mongoose.connect(DB_CONNECT, {
},).then(() => {
    console.log("Database connected");
}).catch(error => {
    console.log(error);
});

// const PORT = 8000;
app.use(express.json())
app.use(checkTokenBlacklist);
app.use('/api/v1/',apiRoute)
app.listen(process.env.PORT,()=> console.log("server running"))