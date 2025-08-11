import React from "react";
import { useState } from "react";
import CloudinaryFileUpload from "../components/cloudinaryFileUpload";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
// for country state and city
import Select from "react-select";
import { Country, State, City } from "country-state-city";
import GoogleMapLocationPicker from "../components/GoogleMapLocationPicker";
import { validateUserSession } from "../utils/auth";

const Create_Listing = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [images, setImages] = useState([]);
  const [formdata, setFormdata] = useState({
    imagesLink: [],
    title: "",
    description: "",
    country: null,
    state: null,
    city: null,
    address: "",
    postalCode: "",
    latitude: null,
    longitude: null,
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    offer: false,
    regularPrice: 5,
    discountPrice: 0,
  });
  const [imageUploadError, setImageUploadError] = useState("");
  const [error, setError] = useState(false);
  const [imageUpLoading, setImageUpLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  // getting country state and city data
  const getCountries = () =>
    Country.getAllCountries().map((country) => ({
      value: country.isoCode,
      label: country.name,
    }));

  const getStates = (countryCode) =>
    State.getStatesOfCountry(countryCode).map((state) => ({
      value: state.isoCode,
      label: state.name,
    }));

  const getCities = (countryCode, stateCode) =>
    City.getCitiesOfState(countryCode, stateCode).map((city) => ({
      value: city.name,
      label: city.name,
    }));

  const handleLocationChange = (field, value) => {
    setFormdata((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "country" && { state: null, city: null }),
      ...(field === "state" && { city: null }),
    }));
  };

  // creating function to upload images
  const handleUpload = async (e) => {
    if (images.length === 0) {
      return setImageUploadError("Please upload at least one image");
    }
    if (images.length + formdata.imagesLink.length > 6) {
      return setImageUploadError("You can upload a maximum of 6 images.");
    }
    try {
      setImageUpLoading(true);
      // arry to store cloud images link
      let uploadedImages = [];
      // uploading one by one images to cloud
      for (const image of images) {
        // calling cloudinary function
        const data = await CloudinaryFileUpload(image);
        // storing data of uploaded image like Public id and secure url in arry
        console.log(data);
        uploadedImages.push(data);
      }
      // setting uploaded images link in state
      setFormdata((prev) => ({
        ...prev,
        imagesLink: [...prev.imagesLink, ...uploadedImages],
      }));
      setImageUploadError("");
    } catch (error) {
      setImageUpLoading(false);
      setImageUploadError(
        "Image upload failed. Ensure each image is under 2MB."
      );
    } finally {
      setImageUpLoading(false);
    }
  };
  // deleting uploaded images from state
  const handleImageDelete = (index) => {
    setFormdata((prev) => ({
      ...prev, // Spread the previous state to keep all other properties unchanged
      imagesLink: prev.imagesLink.filter((_, i) => i !== index),
    }));
  };
  // update form data state
  const handleChange = (e) => {
    // as we know our form data have multiple types of inputs, we need to target it seperatly
    // type is one of them
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormdata({
        ...formdata,
        type: e.target.id,
      });
    }
    // this is our boolean data
    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormdata({
        ...formdata,
        [e.target.id]: e.target.checked,
      });
    }
    // remaining data are number and text and textarea
    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormdata({
        ...formdata,
        [e.target.id]: e.target.value,
      });
    }
  };
  // submit form data to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate session before sensitive action
    const valid = await validateUserSession(navigate);
    if (!valid) return;
    try {
      // checking if at last one image is uploaded
      if (formdata.imagesLink.length === 0) {
        setError("Please upload at least one image");
        return;
      }
      // checking if discounted price is less than regular price otherwise may b regular price is less than discounted price
      if (+formdata.regularPrice < +formdata.discountPrice) {
        return setError("Discounted price should be less than Regular price");
      }

      // check if country data is not filled
      if (!formdata.country || !formdata.state || !formdata.city) {
        return setError("Please select a valid country, state, and city.");
      }      
      setLoading(true);
      setError(false);
      const response = await fetch("/api/createlisting", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formdata,
          userRef: currentUser._id,
          country: formdata.country?.label,
          state: formdata.state?.label,
          city: formdata.city?.label,
        }),
      });
      const data = await response.json();
      if (data.success === false) {
        setError(data.message);
        setLoading(false);
        return;
      }
      setLoading(false);
      setError(false);
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center py-8">
      <div className="w-full max-w-4xl bg-white/90 rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-semibold text-center my-7 text-slate-800">Create a Listing</h1>
        <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">
          <div className="flex flex-col gap-5 flex-1">
            <input
              type="text"
              placeholder="Title of the listing"
              id="title"
              required
              minLength={10}
              maxLength={60}
              onChange={handleChange}
              value={formdata.title}
              className="border border-[#158a7b] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#147d6c] text-slate-700"
              aria-label="Title"
            />
            <textarea
              type="text"
              placeholder="Description"
              id="description"
              required
              minLength={30}
              maxLength={200}
              onChange={handleChange}
              value={formdata.description}
              className="border border-[#158a7b] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#147d6c] text-slate-700"
              aria-label="Description"
            />
            {/* selection fields for country state and city */}
            <Select
              options={getCountries()}
              value={formdata.country}
              onChange={(value) => handleLocationChange("country", value)}
              placeholder="Select Country"
              isClearable
              required
              className="rounded-lg"
              styles={{
                control: (provided, state) => ({
                  ...provided,
                  border: state.isFocused
                    ? "2px solid #158a7b"
                    : "1px solid #158a7b",
                  boxShadow: "none", // Removes default focus ring
                  padding: "8px", // Equivalent to Tailwind's `p-3`
                  borderRadius: "0.5rem",
                  backgroundColor: "white", // Ensures a clean background
                  "&:hover": {
                    border: state.isFocused
                      ? "2px solid #158a7b"
                      : "1px solid #158a7b", // Removes hover border change
                  },
                }),
                option: (provided) => ({
                  ...provided,
                  backgroundColor: "white", // Consistent white background
                  color: "black",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "white", // No hover effect
                  },
                }),
                menu: (provided) => ({
                  ...provided,
                  border: "1px solid #158a7b",
                  borderRadius: "0.5rem",
                }),
                singleValue: (provided) => ({
                  ...provided,
                  color: "black", // Text color of the selected value
                }),
              }}
            />
            <Select
              options={formdata.country ? getStates(formdata.country.value) : []}
              value={formdata.state}
              onChange={(value) => handleLocationChange("state", value)}
              placeholder="Select State"
              isClearable
              required
              isDisabled={!formdata.country}
              className="rounded-lg"
              styles={{
                control: (provided, state) => ({
                  ...provided,
                  border: state.isFocused
                    ? "2px solid #158a7b"
                    : "1px solid #158a7b",
                  boxShadow: "none",
                  padding: "8px", // Tailwind `p-3`
                  borderRadius: "0.5rem",
                  backgroundColor: state.isDisabled ? "#f9f9f9" : "white", // Lighter background for disabled state
                  "&:hover": {
                    border: state.isFocused
                      ? "2px solid #158a7b"
                      : "1px solid #158a7b",
                  },
                }),
                option: (provided) => ({
                  ...provided,
                  backgroundColor: "white",
                  color: "black",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "white", // No hover effect
                  },
                }),
                menu: (provided) => ({
                  ...provided,
                  border: "1px solid #158a7b",
                  borderRadius: "0.5rem",
                }),
                singleValue: (provided) => ({
                  ...provided,
                  color: "black",
                }),
              }}
            />
            <Select
              options={
                formdata.country && formdata.state
                  ? getCities(formdata.country.value, formdata.state.value)
                  : []
              }
              value={formdata.city}
              onChange={(value) => handleLocationChange("city", value)}
              placeholder="Select City"
              isClearable
              required
              isDisabled={!formdata.state}
              className="rounded-lg"
              styles={{
                control: (provided, state) => ({
                  ...provided,
                  border: state.isFocused
                    ? "2px solid #158a7b"
                    : "1px solid #158a7b",
                  boxShadow: "none",
                  padding: "8px", // Tailwind `p-3`
                  borderRadius: "0.5rem",
                  backgroundColor: state.isDisabled ? "#f9f9f9" : "white",
                  "&:hover": {
                    border: state.isFocused
                      ? "2px solid #158a7b"
                      : "1px solid #158a7b",
                  },
                }),
                option: (provided) => ({
                  ...provided,
                  backgroundColor: "white",
                  color: "black",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "white",
                  },
                }),
                menu: (provided) => ({
                  ...provided,
                  border: "1px solid #158a7b",
                  borderRadius: "0.5rem",
                }),
                singleValue: (provided) => ({
                  ...provided,
                  color: "black",
                }),
              }}
            />
            <input
              type="text"
              placeholder="Address"
              id="address"
              required
              minLength={10}
              maxLength={100}
              onChange={handleChange}
              value={formdata.address}
              className="border border-[#158a7b] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#147d6c] text-slate-700"
              aria-label="Address"
            />
            <input
              type="text"
              placeholder="Postal Code"
              id="postalCode"
              required
              minLength={3}
              maxLength={12}
              onChange={handleChange}
              value={formdata.postalCode}
              className="border border-[#158a7b] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#147d6c] text-slate-700"
              aria-label="Postal Code"
            />
            {/* Google Map Location Picker */}
            <GoogleMapLocationPicker
              value={{ latitude: formdata.latitude, longitude: formdata.longitude }}
              onChange={({ latitude, longitude, address }) => {
                setFormdata(prev => ({
                  ...prev,
                  address: address || prev.address,
                  latitude,
                  longitude,
                }));
              }}
            />
            <div className="flex gap-6 flex-wrap">
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="sale"
                  className="w-5"
                  onChange={handleChange}
                  checked={formdata.type === "sale"}
                />
                <span>Sale</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="rent"
                  className="w-5"
                  onChange={handleChange}
                  checked={formdata.type === "rent"}
                />
                <span>Rent</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="parking"
                  className="w-5"
                  onChange={handleChange}
                  checked={formdata.parking}
                />
                <span>Parking spot</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="furnished"
                  className="w-5"
                  onChange={handleChange}
                  checked={formdata.furnished}
                />
                <span>Furnished</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="offer"
                  className="w-5"
                  onChange={handleChange}
                  checked={formdata.offer}
                />
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
                  onChange={handleChange}
                  value={formdata.bedrooms}
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
                  onChange={handleChange}
                  value={formdata.bathrooms}
                  className="p-1 rounded-lg focus:outline-none border border-[#158a7b] focus:border-2"
                />
                <p>Baths</p>
              </div>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  id="regularPrice"
                  min={5}
                  max={1000000000}
                  onChange={handleChange}
                  value={formdata.regularPrice}
                  className="p-1 rounded-lg focus:outline-none border border-[#158a7b] focus:border-2"
                />
                <div className="flex flex-col items-center">
                  <p>Regular price</p>
                  <span className="text-xs">($ / month)</span>
                </div>
              </div>
              {formdata.offer && (
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    id="discountPrice"
                    min={0}
                    max={10000000}
                    onChange={handleChange}
                    value={formdata.discountPrice}
                    className="p-1 rounded-lg focus:outline-none border border-[#158a7b] focus:border-2"
                  />
                  <div className="flex flex-col items-center">
                    <p>Discounted price</p>
                    <span className="text-xs">($ / month)</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col flex-1 gap-5">
            <p className="font-semibold">
              Images:
              <span className="font-normal text-gray-500 ml-2">
                The first image will be the cover (max 6)
              </span>
            </p>
            <div className="flex gap-3 flex-col lg:flex-row">
              <input
                onChange={(e) => setImages(e.target.files)}
                className="p-3 border border-[#158a7b] rounded"
                type="file"
                id="images"
                accept="image/*"
                multiple={true}
                aria-label="Upload images"
              />
              <button
                onClick={handleUpload}
                className="p-3 border border-[#158a7b] rounded uppercase font-semibold bg-gradient-to-r from-[#147d6c] to-[#14a390] text-white hover:from-[#14a390] hover:to-[#147d6c] shadow disabled:opacity-80"
                type="button"
                disabled={imageUpLoading}
              >
                {imageUpLoading ? "Uploading..." : "Upload"}
              </button>
            </div>
            <p>
              {imageUploadError && (
                <span className="text-red-600 text-sm">{imageUploadError}</span>
              )}
            </p>
            {formdata.imagesLink.map((image, index) => {
              return (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 border border-[#158a7b] rounded-lg"
                >
                  <img src={image} alt="" className="w-20 h-20 object-contain" />
                  <button
                    onClick={() => handleImageDelete(index)}
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
                disabled={loading || imageUpLoading}
                className="uppercase bg-gradient-to-r from-[#147d6c] to-[#14a390] text-white p-3 rounded-lg font-semibold shadow hover:from-[#14a390] hover:to-[#147d6c] w-full disabled:opacity-80"
              >
                {loading ? "Creating..." : "Create Listing"}
              </button>
            </div>
            {error && <span className="text-red-600 text-sm">{error}</span>}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Create_Listing;
