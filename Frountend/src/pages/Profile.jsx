import {useSelector} from "react-redux";

const Profile = () => {
  const {currentUser} = useSelector(state=>state.user);
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7 text-slate-800">PROFILE</h1>
      <form className="flex flex-col gap-4 mt-7">
        <img src={currentUser.avatar} alt="Profile" className="h-24 w-24 rounded-full object-cover cursor-pointer self-center mt-2" /* for image use selfcenter to center img */ />
        <input
          type="text"  
          placeholder="username"
          id="username"
          className="border border-[#158a7b] p-3 rounded-lg focus:outline-none focus:border-2"
        />
        <input
          type="email"
          placeholder="@gmail.com"
          id="email"
          className="border border-[#158a7b] p-3 rounded-lg focus:outline-none focus:border-2"
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          className="border border-[#158a7b] p-3 rounded-lg focus:outline-none focus:border-2"
        />
        <button
          className=" uppercase bg-gradient-to-r from-[#147d6c] to-[#14a390] text-white p-3 rounded-lg hover:bg-gradient-to-r hover:from-[#14a390] hover:to-[#147d6c]"
        >update
        </button> 
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-600 cursor-pointer">Delete account</span>
        <span className="text-red-600 cursor-pointer">Sign out</span>
      </div>
    </div>
  );
};

export default Profile;
