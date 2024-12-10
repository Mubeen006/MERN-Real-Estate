import { useSelector } from "react-redux";
import { useRef,useState } from "react";
// import updateUser reducer from userSlice
import { updateUserStart, updateUserSuccess, updateUserFailure } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
const Profile = () => {
  const { currentUser,loading,error } = useSelector((state) => state.user);

  const fileRef = useRef(null);
  const [formdata, setFormdata] = useState({});
  const dispatch = useDispatch();

console.log(formdata)
  const handleChange = (e) => {
    setFormdata({
      ...formdata,
      [e.target.id]: e.target.value
    })
  };
// updata data of usrer
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      
      const res = await fetch(`/api/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formdata),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
    } catch (error) {
      dispatch(updateUserFailure(error.message));
      }

  }
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7 text-slate-800">
        PROFILE
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input type="file" id="file" className="hidden" ref={fileRef} accept="image/*" />
      <img src={formdata.avatar || currentUser.avatar} alt="Profile" onClick={() => fileRef.current.click()} className="h-24 w-24 rounded-full object-cover cursor-pointer self-center mt-2" /* for image use selfcenter to center img */ />
        
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
        <button disabled={loading} className="bg-gradient-to-r from-[#147d6c] to-[#14a390] text-white p-3 rounded-lg hover:bg-gradient-to-r hover:from-[#14a390] hover:to-[#147d6c]">
          {loading ? "loading..." : "UPDATE"}
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-600 cursor-pointer">Delete account</span>
        <span className="text-red-600 cursor-pointer">Sign out</span>
      </div>
      {error && <p className="text-red-600 mt-5">{error}</p>}
    </div>
  );
};

export default Profile;
