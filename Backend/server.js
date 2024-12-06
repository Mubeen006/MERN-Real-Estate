import express from "express";
const app= express();
// one thing bydafault we did not allow to send any jason data to server,
// to send data we need to use middleware of jason 
app.use(express.json());


// create a mongodb connection
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config()
 mongoose.connect(process.env.Mongodb).then(() => {
    console.log("Connected to MongoDB");
 }).catch((error) => {
    console.log(error);
 });

 // import user routes to use them
 import Userrouter from "./Routes/user.routes.js";
 app.use("/api", Userrouter);

// import auth router to perform user authentication
import Authrouter from "./Routes/auth.routes.js";
app.use("/api", Authrouter);

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