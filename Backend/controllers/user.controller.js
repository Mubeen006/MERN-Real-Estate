// here we write main functionality of user authentication
import user from "../db/model/user.model.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async(req, res, next) => {
    const data= req.body;
    const hashedpassword= await bcrypt.hash(data.password, 10);
    data.password= hashedpassword;
    const newuser= new user(data);
    try{
        await newuser.save();
    res.status(201).json("user created successfully");
    }
    catch(error){
        // this is the mdidelweare for error handling , 
        // Location :: this middle ware is createed in our server file 
        next(errorHandler(500, "something went wrong"));
    }
};

export const login= async(req, res, next) => {
    const data= req.body;
    try {
        const validuser= await user.findOne({email: data.email});
        //                          this is custom errot which we crete in utils/error.js
        if(!validuser) return next(errorHandler(404, "user not found"));
        const validpassword= bcrypt.compareSync(data.password, validuser.password);
        if (!validpassword) return next(errorHandler(404, "invalid credentials"));
        // here we remove password
        const {password:pass, ...rest}= validuser._doc; 
        // here we create token
        const token= jwt.sign({_id: validuser._id}, process.env.jwt_secret);
        // save token in localstorage cookie
                //      name     token   security    , expires:24*60*60*1000 
        res.cookie("access_token",token, {httpOnly:true}).status(200).json(rest);
    } catch (error) {  
        next(error);
    }

}