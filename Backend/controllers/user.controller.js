// here we write main functionality of user authentication
import user from "../db/model/user.model.js";
import bcrypt from "bcryptjs";
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
        next(error);
    }
}