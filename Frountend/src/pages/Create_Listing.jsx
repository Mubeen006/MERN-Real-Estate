import React from "react";
import { useState } from "react";
import CloudinaryFileUpload from "../components/cloudinaryFileUpload";
const Create_Listing = () => {
  const [images, setImages] = useState([]);
  const [imagesLink,setImagesLink]=useState([]);
  const [loading, setLoading] = useState(false);
   
  // creating function to upload images
  const handleUpload = async (e) => {
    try {
      let arr=[];
      setLoading(true);
      for (let i = 0; i < images.length; i++) {
        const data = await CloudinaryFileUpload(images[i]);
        arr.push(data);
      }
      setLoading(false);
      setImagesLink(arr);
    } catch (error) {
      setLoading(false);
      console.log(error)
    }
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
              onChange={(e)=>setImages(e.target.files)}
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
          {imagesLink && imagesLink.length>0 && imagesLink.map(imagesLink=>{
            return(
                <img src={imagesLink?.url} key={imagesLink?.publicId} alt="" className="w-40 h-40 object-cover" />
            ) 
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
