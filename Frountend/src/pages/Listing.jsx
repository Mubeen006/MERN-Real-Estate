import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";   
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import {FaBath,FaBed,FaParking,FaShare,FaMapMarkerAlt,FaChair} from "react-icons/fa";
import {useSelector} from "react-redux";
const Listing = () => {
  SwiperCore.use([Navigation]);
  const { listingId } = useParams();
  const [listingdata, setListingdata] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const currentUser = useSelector((state) => state.user);
  useEffect(() => {
    // create a function to fetch listing data
    const fetchListingData = async () => {
      try {
        setLoading(true);
        setError(false); 
        const res = await fetch(`/api/getlisting/${listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListingdata(data);
        setError(false);
        setLoading(false);
      } catch (error) {
        setError(true);
      }
    };
    fetchListingData();
  }, [listingId]);
  return (
    <main>
      {loading && <p className="text-center my-7 text-2xl">Loading...</p>}
      {error && (
        <p className="text-center my-7 text-2xl">Something went wrong!</p>
      )}
      {/* here we show listing images  */}
      {listingdata && !loading && !error &&(
        <div>
          <Swiper navigation>
            {listingdata.imagesLink.map((url)=> (
              <SwiperSlide key={url}>
                <div className="h-[550px]" style={{ background: `url(${url}) center no-repeat`, backgroundSize: "cover"}} >
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className=" fixed top-[13%] right-[3%] z-10 border rounded-full h-12 w-12 flex justify-center items-center bg-slate-100 cursor-pointer">
            <FaShare className="text-slate-500" onClick={()=>{ navigator.clipboard.writeText(window.location.href);
              setCopied(true);
              setTimeout(() => {
                setCopied(false);
              },2000)
            }
          } />
          </div>
          {copied && (
            <p className="fixed top-[23%] right-[5%] z-10border rounded-md p-2 bg-slate-100">
             Link Copied!
            </p>  
          )}
          <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
            <p className="text-2xl font-semibold">
              {listingdata.title} - ${' '}
              {listingdata.offer ? listingdata.discountPrice.toLocaleString('en-US')
              :listingdata.regularPrice.toLocaleString('en-US')}
              {listingdata.type === "rent" && " / month" }
            </p>
            <p className="flex items-center mt-2 gap-2 text-slate-600text-sm">
              <FaMapMarkerAlt className="text-green-900 " /> {listingdata.address}
              </p>
              <div className="flex gap-4 ">
                <p className="bg-red-900 w-full max-w-[200px] p-1 text-white text-center rounded-md">{listingdata.type==="rent"?"For Rent":"For Sale"}</p>
                {listingdata.offer && (
                  <p className="bg-green-900 w-full max-w-[200px] p-1 text-white text-center rounded-md">
                    ${+listingdata.regularPrice- +listingdata.discountPrice} discount
                  </p>
                )}
              </div>
              <p className="text-slate-800">
                <span className="font-semibold text-black">Discription - {' '}</span>{listingdata.description}</p>
                <ul className="text-green-900 text-sm font-semibold flex flex-wrap items-center gap-4 sm:gap-6">
                   <li className="flex items-center gap-1 whitespace-nowrap">
                    <FaBed className="text-green-900 " /> {listingdata.bedrooms > 1 ? `${listingdata.bedrooms} beds` :`${listingdata.bedrooms} bed`}
                   </li>
                   <li className="flex items-center gap-1 whitespace-nowrap">
                    <FaBath className="text-green-900 " /> {listingdata.bathrooms > 1 ? `${listingdata.bathrooms} baths` :`${listingdata.bathrooms} bath`}
                   </li>
                   <li className="flex items-center gap-1 whitespace-nowrap">
                    <FaParking className="text-green-900 " /> {listingdata.parking? "Parking spot":"No Parking"}
                   </li>
                   <li className="flex items-center gap-1 whitespace-nowrap">
                    <FaChair className="text-green-900 " /> {listingdata.furnished? "Furnished":"Unfurnished"}
                   </li>
                </ul> 
          </div>
        </div>
        )}
    </main>
  );
};

export default Listing;
