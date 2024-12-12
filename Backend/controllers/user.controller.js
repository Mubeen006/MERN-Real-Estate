// here we write main functionality of user authentication
import user from "../db/model/user.model.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import uploadOnCloudinary from "../utils/cloudinary.upload.js";

//Signup controller
export const signup = async (req, res, next) => {
  const data = req.body;
  const hashedpassword = await bcrypt.hash(data.password, 10);
  data.password = hashedpassword;
  const newuser = new user(data);
  try {
    await newuser.save();
    res.status(201).json("user created successfully");
  } catch (error) {
    // this is the mdidelweare for error handling ,
    // Location :: this middle ware is createed in our server file
    next(errorHandler(500, "something went wrong"));
  }
};

// login controller
export const login = async (req, res, next) => {
  const data = req.body;
  try {
    const validuser = await user.findOne({ email: data.email });
    //                          this is custom errot which we crete in utils/error.js
    if (!validuser) return next(errorHandler(404, "user not found"));
    const validpassword = bcrypt.compareSync(data.password, validuser.password);
    if (!validpassword) return next(errorHandler(404, "invalid credentials"));
    // here we remove password
    const { password: pass, ...rest } = validuser._doc;
    // here we create token
    const token = jwt.sign({ _id: validuser._id }, process.env.jwt_secret);
    // save token in localstorage cookie
    //      name     token   security    , expires:24*60*60*1000
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

// signin with goole controller
export const googlelogin = async (req, res, next) => {
  // find if user already exist in our database
  const validuser = await user.findOne({ email: req.body.email });
  try {
    if (validuser) {
      // then we rigister user and give token
      const token = jwt.sign({ _id: validuser._id }, process.env.jwt_secret);
      const { password: pass, ...rest } = validuser._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
    // if user is not exist then we create new user
    else {
      // as we know goodle di not give us password ,but password is require to create user
      // so we create dummy password          0-9 a-z     last 8 character
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedpassword = await bcrypt.hash(generatedPassword, 10);
      // as user name is like "Muhammad Mubeen" we can not save it as it is , so we spit it base of " " then join it base of ""
      const newuser = new user({
        username:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedpassword,
        avatar: req.body.photo,
      });
      await newuser.save();
      const token = jwt.sign({ _id: newuser._id }, process.env.jwt_secret);
      const { password: pass, ...rest } = newuser._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

// Update user controller
export const updateUser = async (req, res, next) => {
  // we chack here that is user id match to params id
  if (req.user._id !== req.params.id)
    return next(errorHandler(401, "you can update only your account"));
  try {
    const updateData = {};
    //upload image on cloudinary
    if (req.file && req.file.path) {
      const result = await uploadOnCloudinary(req.file.path);
      updateData.avatar = result.secure_url;
    }

    if (req.body.password) {
      updateData.password = bcrypt.hashSync(req.body.password, 10);
    }
    if (req.body.username) updateData.username = req.body.username;
    if (req.body.email) updateData.email = req.body.email;
    const updateduser = await user.findByIdAndUpdate(
      req.params.id /*set method is used to check
            that which fields are changed and only update that fields data in db */,
      // {$set: req.body},// this mehod is not good for security
      {
        $set: {
          ...updateData,
        //   username: req.body.username,
        //   email: req.body.email,
        //   password: req.body.password,
        //   avatar: result.secure_url,
        },
      },
      // new true is used to return updated data if not use we can get old data
      { new: true }
    );
    if (!updateduser) return next(errorHandler(404, "User not found."));
    // here we remove password before send it as in response
    const { password: pass, ...rest } = updateduser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

// Delete user controller
export const deleteUser = async (req, res, next) => {
  if (req.user._id !== req.params.id)
    return next(errorHandler(401, "you can delete only your account"));
  try {
    await user.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token");
    res.status(200).json("user deleted successfully");
  } catch (error) {
    next(error);
  }
};
