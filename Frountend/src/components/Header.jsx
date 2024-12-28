import React from "react";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
const Header = () => {
  // we take information fo current user from userSlice
 const {currentUser} = useSelector(state=>state.user)
  return (
    <div className=" top-0" >
      <header className="bg-slate-200 shadow-md">
        <div className="flex justify-between items-center max-w-6xl p-4 mx-auto">
           <img src={logo} alt="Logo image" className="w-48 sm:w-56" />
           <Link to="/profile"> 
           {currentUser ? (
             <img src={currentUser.avatar} alt="Profile" className="h-10 w-10 rounded-full object-contain"/>
           ):<li className="cursor-pointer list-none">Sign-up</li>}
           </Link>
        </div>
      </header>
    </div>
  );
};

export default Header;
