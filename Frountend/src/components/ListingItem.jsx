import React from "react";
import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";

const ListingItem = ({ listing }) => {
  console.log(listing);
  return (
    <div className="bg-white shadow-lg hover:shadow-xl transition-shadow overflow-hidden rounded-lg w-full sm:w-[300px]">
      <Link to={`/listing/${listing._id}`}>
        <img
          src={listing.imagesLink[0]}
          alt="listing cover"
          className="w-full h-[320px] sm:h-[220px] object-cover hover:scale-105 transition-scale duration-300"
        />
        <div className="p-3 flex flex-col gap-2 w-full">
          <p className="text-xl font-semibold text-slate-700 truncate">
            {listing.title}
          </p>
          <div className="flex gap-1 items-center">
            <MdLocationOn className="text-[#147d6c] h-4 w-4" />
            <p className="text-sm text-gray-600 w-full line-clamp-1">
              {listing.address}
            </p>
          </div>
          <p className="text-sm text-slate-600 line-clamp-2">
            {listing.description}
          </p>
          <p className="text-slate-700 mt-2 font-semibold">
            ${" "}
            {/* toLocaleString('english - united stade')  convert 30000 to 30,000*/}
            {listing.offer
              ? listing.discountPrice.toLocaleString("en-US")
              : listing.regularPrice.toLocaleString("en-US")}
            {listing.type === "rent" && " / month"}
          </p>
          <div className=" text-slate-700 flex gap-4">
            <div className=" font-bold text-xs">
              {listing.bedrooms > 1 ?`${listing.bedrooms} Beds`: `${listing.bedrooms} Bed` }
            </div>
            <div className=" font-bold text-xs">
              {listing.bathrooms > 1 ?`${listing.bathrooms} Baths`: `${listing.bathrooms} Bath` }
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ListingItem;
