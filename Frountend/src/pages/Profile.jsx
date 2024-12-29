import { useSelector } from "react-redux";
import { useRef, useState } from "react";
// import updateUser reducer from userSlice
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  logoutUserStart,
  logoutUserSuccess,
  logoutUserFailure,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
const Profile = () => {
  const { currentUser, loading, error } = useSelector((state) => state.user);

  const fileRef = useRef(null);
  const [formdata, setFormdata] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [profileImage, setProfileImage] = useState(currentUser.avatar);
  const [showListingError, setShowListingError] = useState(false);
  const [userListing, setUserListing] = useState([]);
  const dispatch = useDispatch();
  const handleChange = (e) => {
    setFormdata({
      ...formdata,
      [e.target.id]: e.target.value,
    });
  };
  // updata data of usrer
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());

      // Prepare form data for the POST request
      const fdata = new FormData();
      if (formdata.avatar) fdata.append("file", formdata.avatar);
      if (formdata.username) fdata.append("username", formdata.username);
      if (formdata.email) fdata.append("email", formdata.email);
      if (formdata.password) fdata.append("password", formdata.password);
      const res = await fetch(`/api/update/${currentUser._id}`, {
        method: "POST",
        body: fdata,
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      // Set the avatar URL from the backend response to update the UI immediately
      setFormdata({
        ...formdata,
        avatar: data.avatar || currentUser.avatar,
      });
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };
  // deleter user account
  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  // Logout user
  const handleLogout = async (e) => {
    try {
      dispatch(logoutUserStart());
      const res = await fetch(`/api/signout/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        dispatch(logoutUserFailure(data.message));
        return;
      }
      dispatch(logoutUserSuccess(data));
    } catch (error) {
      dispatch(logoutUserFailure(error.message));
    }
  };
  // function to show listings of user
  const handleShwoListings = async (e) => {
    try {
      setShowListingError(false);
      const res = await fetch(`/api/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingError(true);
        return;
      }
      setUserListing(data);
    } catch (error) {
      setShowListingError(true);
    }
  };
  // function to delete user listing
  const handleDeleteListing= async(listingId)=>{
    try {
      const res=await fetch(`/api/deletelisting/${listingId}`,
        {
          method:"DELETE",}
      );
      const data=await res.json();
      if(data.success===false){
        console.log(data.message);
        return;
      }
      // if listing is deleted successfully we need to update user listing
      
      setUserListing((prev)=>prev.filter
      // here we did not return the deleted listing
      ((listing)=>listing._id!==listingId));
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7 text-slate-800">
        PROFILE
      </h1>
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="flex flex-col gap-4"
      >
        <input
          type="file"
          id="file"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              setFormdata({ ...formdata, avatar: file });
              setProfileImage(URL.createObjectURL(file));
            }
          }}
          className="hidden"
          ref={fileRef}
          accept="image/*"
        />
        <img
          src={profileImage || currentUser.avatar}
          alt="profile image"
          onClick={() => fileRef.current.click()}
          className="h-24 w-24 rounded-full object-contain cursor-pointer self-center mt-2" /* for image use selfcenter to center img */
        />

        <input
          type="text"
          placeholder="username"
          id="username"
          defaultValue={currentUser.username}
          className="border border-[#158a7b] p-3 rounded-lg focus:outline-none focus:border-2"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="@gmail.com"
          id="email"
          defaultValue={currentUser.email}
          className="border border-[#158a7b] p-3 rounded-lg focus:outline-none focus:border-2"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          className="border border-[#158a7b] p-3 rounded-lg focus:outline-none focus:border-2"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-gradient-to-r from-[#147d6c] to-[#14a390] text-white p-3 
        rounded-lg hover:bg-gradient-to-r hover:from-[#14a390] hover:to-[#147d6c]"
        >
          {loading ? "loading..." : "UPDATE"}
        </button>
        <Link
          to="/create-listing"
          className="bg-slate-700 text-white p-3 rounded-lg uppercase text-center hover:bg-slate-600"
        >
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-600 cursor-pointer" onClick={handleDelete}>
          Delete account
        </span>
        <span className="text-red-600 cursor-pointer" onClick={handleLogout}>
          Sign out
        </span>
      </div>
      {error && <p className="text-red-600 mt-5">{error}</p>}
      {updateSuccess && (
        <p className="text-[#147d6c] mt-5 text-sm">
          User is updated successfully!
        </p>
      )}
      <button
        onClick={handleShwoListings}
        className="text-[#147d6c] w-full text-1xl mt-5"
      >
        Show Listings
      </button>
      <p>{showListingError ? "Error showing listings" : ""}</p>
      {userListing &&
        userListing.length > 0 &&
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl text-center font-semibold mt-7">Your Listings</h1>
          {userListing.map((listing) => (
            <div
              key={listing._id}
              className="flex border border-[#147d6c] rounded-lg justify-between items-center gap-4 p-3 mt-3"
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imagesLink[0]}
                  alt="listing cover"
                  className="h-16 w-16 object-contain"
                />
              </Link>
              <Link
                to={`/listing/${listing._id}`}
                className="text-slate-700 flex-1 hover:underline font-semibold truncate"
              >
                <p>{listing.title}</p>
              </Link>
              <div className="flex flex-col items-center ">
                <button onClick = {() => handleDeleteListing(listing._id)} className="text-red-700 uppercase hover:text-red-500">Delete</button>
                <Link to={`/edit-listing/${listing._id}`}>
                <button className="text-[#147d6c] uppercase hover:text-[#14a390]">Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
        }
    </div>
  );
};

export default Profile;
