import React from "react";

const Search = () => {
  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border border-[#147d6c] border-t-0 border-b-1 md:border-r-1 md:min-h-screen">
        <form className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">Search Term:</label>
            <input
              type="text"
              placeholder="Search..."
              id="searchTerm"
              className=" border-[#147d6c] border-r-2
                border-b-2 focus:outline-none  rounded-lg w-full p-2"
            />
          </div>
          {/* providign serch term to filter data */}
          <div className="flex items-center flex-wrap gap-2 ">
            <label className="whitespace-nowrap font-semibold">Type:</label>
            <div className="flex gap-2">
              <input type="checkbox" id="all" className="w-5" />
              <span>Rent & Sele</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="rent" className="w-5" />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="sale" className="w-5" />
              <span>Sele</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="offer" className="w-5" />
              <span>offer</span>
            </div>
          </div>
          {/* Amenities/facilities */}
          <div className="flex items-center flex-wrap gap-2 ">
            <label className="whitespace-nowrap font-semibold">Amenities:</label>
            <div className="flex gap-2">
              <input type="checkbox" id="all" className="w-5" />
              <span>Parking</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="rent" className="w-5" />
              <span>Furnished</span>
            </div>
          </div>
          {/* order of the filteration */}
          <div className="flex items-center gap-2 font-semibold" >
            <label >Sort:</label>
            <select id="sort_order" className=" text-sm border border-[#147d6c] rounded-lg p-2 focus:outline-none focus:border-2">
                <option>Price high to low</option>
                <option>Price low to high</option>
                <option>Latest</option>
                <option>Oldest</option>
            </select>
          </div>
          <button className="uppercase bg-gradient-to-r from-[#147d6c] to-[#14a390] text-white p-3 
              rounded-lg hover:bg-gradient-to-r hover:from-[#14a390] hover:to-[#147d6c] w-full disabled:opacity-80">Search</button>
        </form>
      </div>
      <div className="text-2xl font-semibold border-b-2 p-3 text-slate-900 my-5">
        <h1>Listing results:</h1>
      </div>
    </div>
  );
};

export default Search;
