import React from "react";
import { useState } from "react";
import CloudinaryFileUpload from "../components/cloudinaryFileUpload";
const Create_Listing = () => {
  const [images, setImages] = useState([]);
  const [formdata, setFormdata] = useState({
    imagesLink: [],
  });
  const [imageUploadError, setImageUploadError] = useState("");
  const [loading, setLoading] = useState(false);

  // creating function to upload images
  const handleUpload = async (e) => {
    if(images.length===0){
      setImageUploadError("Please upload at least one image");
    }
    else if(images.length + formdata.imagesLink.length > 6){
      setImageUploadError("You can upload a maximum of 6 images.");
    }
    else{
      try {
        setLoading(true);
        // arry to store cloud images link 
        let uploadedImages = [];
        // uploading one by one images to cloud 
        for (const image of images) {
          // calling cloudinary function
          const data = await CloudinaryFileUpload(image);
          // storing data of uploaded image like Public id and secure url in arry
          uploadedImages.push(data);
        }
        // setting uploaded images link in state
        setFormdata((prev) => ({
          ...prev,
          imagesLink:[...prev.imagesLink,...uploadedImages]
        }))
        setImages([]);
        setImageUploadError("");
      } catch (error) {
        setLoading(false);
        setImageUploadError("Image upload failed. Ensure each image is under 2MB.");
      }
      finally {
        setLoading(false);
      }
    }
  };
// deleting uploaded images from state
const handleImageDelete=(publicId)=>{
  setFormdata((prev) => ({
    ...prev,// Spread the previous state to keep all other properties unchanged
    imagesLink: prev.imagesLink.filter((image) => image.publicId !== publicId),
  }))
}
  return (
    <main className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>
      <form className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Title of the listing"
            id="listingTitle"
            required
            className="border border-[#158a7b] p-3 rounded-lg focus:outline-none focus:border-2"
          />
          <textarea
            type="text"
            placeholder="Description"
            id="description"
            required
            className="border border-[#158a7b] p-3 rounded-lg focus:outline-none focus:border-2"
          />
          <input
            type="text"
            placeholder="Address"
            id="address"
            className="border border-[#158a7b] p-3 rounded-lg focus:outline-none focus:border-2"
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input type="checkbox" id="sell" className="w-5" />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="rent" className="w-5" />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="parking" className="w-5" />
              <span>Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="furnished" className="w-5" />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="offer" className="w-5" />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2 items-center">
              <input
                type="number"
                id="bedrooms"
                min={1}
                max={10}
                className="p-1 rounded-lg focus:outline-none border border-[#158a7b] focus:border-2"
              />
              <p>Beds</p>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                id="bathrooms"
                min={1}
                max={10}
                className="p-1 rounded-lg focus:outline-none border border-[#158a7b] focus:border-2"
              />
              <p>Baths</p>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                id="regularPrice"
                min={1}
                max={10}
                className="p-1 rounded-lg focus:outline-none border border-[#158a7b] focus:border-2"
              />
              <div className="flex flex-col items-center">
                <p>Regular price</p>
                <span className="text-xs">($ / month)</span>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                id="discountedPrice"
                min={1}
                max={10}
                className="p-1 rounded-lg focus:outline-none border border-[#158a7b] focus:border-2"
              />
              <div className="flex flex-col items-center">
                <p>Discounted price</p>
                <span className="text-xs">($ / month)</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-500 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className="flex gap-3">
            <input
              onChange={(e) => setImages(e.target.files)}
              className="p-3 border border-[#158a7b] rounded"
              type="file"
              id="images"
              accept="image/*"
              multiple={true}
            />
            <button
              onClick={handleUpload}
              className="p-3 border border-[#158a7b] rounded uppercase hover:shadow-lg disabled:opacity-80"
              type="button"
              disabled={loading}
            >
              {loading ? "Uploading..." : "Upload"}
            </button>
          </div>
          <p>{imageUploadError && <span className="text-red-600 text-sm">{imageUploadError}</span>}</p>
          {
            formdata.imagesLink.map((image) => {
              return (
                <div key={image.publicId} className="flex justify-between items-center p-3 border border-[#158a7b] rounded-lg">
                  <img
                    src={image.url}
                    alt=""
                    className="w-20 h-20 object-contain"
                  />
                  <button
                  onClick={() => handleImageDelete(image.publicId)}
                    type="button"
                    className="px-3 text-red-700 rounded-lg uppercase hover:opacity-75"
                  >
                    Delete
                  </button>
                </div>
              );
            })}
          <div>
            <button
              className="uppercase bg-gradient-to-r from-[#147d6c] to-[#14a390] text-white p-3 
              rounded-lg hover:bg-gradient-to-r hover:from-[#14a390] hover:to-[#147d6c] w-full disabled:opacity-80"
            >
              Create Listing
            </button>
          </div>
        </div>
      </form>
    </main>
  );
};

export default Create_Listing;
