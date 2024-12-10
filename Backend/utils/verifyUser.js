import { errorHandler } from "./error.js";
import jwt from "jsonwebtoken";
export const verifyUser = (req, res, next) => {
   // here we get the token 
    const token= req.cookies.access_token;
    if(!token) return next(errorHandler(401, "you are not authenticated"));
    jwt.verify(token, process.env.jwt_secret, (err, user) => {
        if(err) return next(errorHandler(403, "Forbidden"));
        req.user= user; // here we send the user data in the request object so that we can use it in the next middleware 
        // basically we send user id 
        next();
    }
    );
};