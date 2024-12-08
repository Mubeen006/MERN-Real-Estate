// here we write main functionality of user authentication
import user from "../db/model/user.model.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

//Signup controller
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

// login controller
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

};

// signin with goole controller
export const googlelogin= async(req, res, next) => {
    const validuser= await user.findOne({email: req.body.email});
    try {
        if(validuser){ 
            const  token= jwt.sign({_id: validuser._id}, process.env.jwt_secret);
            const {password:pass, ...rest}= validuser._doc;
            res.cookie("access_token", token,{httpOnly:true}).status(200).json(rest); 
        }
        else   {
            const generatedPassword= Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedpassword= await bcrypt.hash(generatedPassword, 10);
            const newuser= new user({username: req.body.name.split(" ").join("").toLowerCase()+ Math.random().toString(36).slice(-4), email: req.body.email, password: hashedpassword, avatar: req.body.photo});
            await newuser.save();
            const token= jwt.sign({_id: newuser._id}, process.env.jwt_secret);
            const {password:pass, ...rest}= newuser._doc;
            res.cookie("access_token", token,{httpOnly:true}).status(200).json(rest);
        }
    } catch (error) {
        next(error);
    }
}
// export const googlelogin= async(req, res, next) => {
//     try {
//         // find if user already exist in our database
//         const validuser= await user.findOne({email: req.body.email});
//         console.log(validuser);
//         if(validuser){
//             // then we rigister user and give token
//             const token= jwt.sign({_id: validuser._id}, process.env.jwt_secret);
//             // here we remove password berfore save it to localstorage cookie
//             const {password:pass, ...rest}= validuser._doc;
//             res.cookie("access_token", token,{httpOnly:true}).status(200).json(rest); 
//         }
//         // if user is not exist then we create new user
//         else{
//             // as we know goodle di not give us password ,but password is require to create user
//             // so we create dummy password          0-9 a-z     last 8 character                    last 16 character
//             const generatedPassword= Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
//             const hashedpassword= await bcrypt.hash(generatedPassword, 10);
//             // as user name is like "Muhammad Mubeen" we can not save it as it is , so we spit it base of " " then join it base of ""
//             const newuser= new user({username: req.body.name.split(" ").join("").toLowerCase()+ Math.random().toString(36).slice(-4), email: req.body.email, password: hashedpassword, avatar: req.body.photo});
//             await newuser.save();
//             const token= jwt.sign({_id: newuser._id}, process.env.jwt_secret);
//             const {password:pass, ...rest}= newuser._doc;
//             res.cookie("access_token", token,{httpOnly:true}).status(200).json(rest);
//         }
//     } catch (error) {  
//         next(error);
//     }
// }