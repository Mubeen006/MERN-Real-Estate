import mongoose from "mongoose";

// create a user model to store user date in db
const userSchema = new mongoose.Schema({
    fullname:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
})

const user= mongoose.model("user",userSchema);
export default user;