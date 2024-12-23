import axios from 'axios'
const CloudinaryFileUpload = async(file) => {
    // we create form data objct and append file to it
const  formData= new FormData();
formData.append("file",file);
// our prest created on cloudinery to upload file 
formData.append("upload_preset","User_Avatar");
// const cloudName=meta.env.VITE_CLOUDINARY_CLOUD_NAME;
try {
    // we send form data to cloudinary in that api  
    const {data}=await axios.post(`https://api.cloudinary.com/v1_1/dvhpnalvq/image/upload`,formData)
    return {url:data?.secure_url}
} catch (error) {
    console.log(error)
}
}
export default CloudinaryFileUpload
