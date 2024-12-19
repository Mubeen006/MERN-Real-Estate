import axios from 'axios'
const CloudinaryFileUpload = async(file) => {
const  formData= new FormData();
formData.append("file",file);
formData.append("upload_preset",meta.env.VITE_CLOUDINARY_PRESET);
const cloudName=meta.env.VITE_CLOUDINARY_CLOUD_NAME;
try {
    const {data}=await axios.post("https://api.cloudinary.com/v1_1/${cloudName}/image/upload",formData)
    return {publicId:data?.public_id,url:data?.secure_url}
} catch (error) {
    console.log(error)
}
}
export default CloudinaryFileUpload
