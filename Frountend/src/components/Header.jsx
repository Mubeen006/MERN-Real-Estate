import React from "react";
import logo from "../assets/logo.png";
const Header = () => {
  return (
    <div >
      <header className="bg-slate-200">
        <div className="flex justify-between items-center max-w-6xl p-4 mx-auto">
           <img src={logo} alt="Logo image" className="w-48 sm:w-56" />
        </div>
      </header>
    </div>
  );
};

export default Header;
