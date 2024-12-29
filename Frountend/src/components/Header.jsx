import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { useSelector } from "react-redux";
import { FaSearch } from "react-icons/fa";
const Header = () => {
  // we take information fo current user from userSlice
 const {currentUser} = useSelector(state=>state.user)
 const [searchTerm, setSearchTerm] = useState('');
 const navigate = useNavigate();
 
 // form submit handler
 const handleSubmit = (e)=>{
   e.preventDefault();
   // to did not lose the search term when we made some other changes like sell or rent etc
   // use bultin method URLSearchParas to get the search term
   const urlParams = new URLSearchParams(window.location.search);
   urlParams.set('searchTerm', searchTerm);
   // getting seach complete search query
   const searchQuery = urlParams.toString();
   // now we will navigate to that particular search query
   navigate (`/search?${searchQuery}`);
 }
 // to updata header serch term on every change
 useEffect(()=>{
   const urlParams = new URLSearchParams(location.search);
   setSearchTerm(urlParams.get('searchTerm') || '');
 },[location.search]);
  return (
    <div className=" top-0" >
      <header className="bg-slate-100 shadow-md">
        <div className="flex justify-between items-center max-w-6xl p-4 mx-auto">
           <Link to='/'>
           <img src={logo} alt="Logo image" className="w-48 sm:w-56" />
           </Link>
           <form onSubmit={handleSubmit} className=" border-[#147d6c] border-r-2 border-b-2 p-2 rounded-lg flex items-center">
            <input type='text' placeholder="Search..." className="bg-transparent shadow-sm focus:outline-none px-1 w-24 sm:w-64"
            value={searchTerm}
            onChange={(e)=>setSearchTerm(e.target.value)}/>
            <button>
            <FaSearch className="text-slate-500 "/>
            </button>
           </form>
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
