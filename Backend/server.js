import express from "express";
const app= express();
// one thing bydafault we did not allow to send any jason data to server,
// to send data we need to use middleware of jason 
app.use(express.json());

// import cookies parser to get the information from cookies
import cookieParser from "cookie-parser";

// create a mongodb connection
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config()
 mongoose.connect(process.env.Mongodb).then(() => {
    console.log("Connected to MongoDB");
 }).catch((error) => {
    console.log(error);
 });

 //cookie parser
 app.use(cookieParser());
// app.use(express.urlencoded({ extended: false }));
 // import user routes to use them
 import Userrouter from "./Routes/user.routes.js";
 app.use("/api", Userrouter);

// import auth router to perform user authentication
import Authrouter from "./Routes/auth.routes.js";
app.use("/api", Authrouter);

// import listing router to create listing
import Listingrouter from "./Routes/listing.routes.js";
app.use("/api", Listingrouter);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});


// create a middleware for error handling 
app.use((err, req, res,next)=>{
   const statusCode= err.status || 500;
   const message= err.message || "internal server error";
   return res.status(statusCode).json({
      success:false,
      statusCode,
      message
   });
});