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
const Profile = () => {
  const { currentUser, loading, error } = useSelector((state) => state.user);

  const fileRef = useRef(null);
  const [formdata, setFormdata] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
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
      const res = await fetch("/api/signout");
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
            }
          }}
          className="hidden"
          ref={fileRef}
          accept="image/*"
        />
        <img
          src={formdata.avatar || currentUser.avatar}
          alt="profile image"
          onClick={() => fileRef.current.click()}
          className="h-24 w-24 rounded-full object-cover cursor-pointer self-center mt-2" /* for image use selfcenter to center img */
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
        <p className="text-green-600 mt-5">User is updated successfully!</p>
      )}
    </div>
  );
};

export default Profile;
