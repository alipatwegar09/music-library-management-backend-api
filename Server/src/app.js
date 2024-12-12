import express from "express"
import apiRoute from "./routes/api.js";
import { DB_CONNECT } from "./utils/constants.js";
import mongoose from "mongoose";
import Signup from "./models/Signup.js";
import { checkTokenBlacklist } from "./controllers/Logout.controller.js";
const app=express();

mongoose.connect(DB_CONNECT, {
},).then(() => {
    console.log("Database connected");
}).catch(error => {
    console.log(error);
});

const PORT = 8000;
app.use(express.json())
app.use(checkTokenBlacklist);
app.use('/api/',apiRoute)
app.listen(PORT,()=> console.log("server running"))