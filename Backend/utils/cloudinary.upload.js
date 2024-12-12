import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

// here we import file system of node js to manage owr server file
import fs from "fs";
// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
});
const uploadOnCloudinary = async (localFilePath) => {
  try {
    // first check is we receive local file path
    // if(!localFilePath) return null;
    // upload file to cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto", // automatically detect what type of file is passed
    });
    // return complete data , or we can extract only public url
    fs.unlinkSync(localFilePath); // Clean up local file
    return response;
  } catch (error) {
    // if error in uploading , or in path ,
    // but as we know although it is not upload to cloud , but still exist on our server
    // so we can delete to clean up our server
    fs.unlinkSync(localFilePath); // Clean up even on error
    throw error;
  }
};

export default uploadOnCloudinary;
