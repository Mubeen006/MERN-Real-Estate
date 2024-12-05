import express from "express";
const app= express();
// create a mongodb connection
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config()
 mongoose.connect(process.env.Mongodb).then(() => {
    console.log("Connected to MongoDB");
 }).catch((error) => {
    console.log(error);
 });

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});