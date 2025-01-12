import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import ListingItem from "../components/ListingItem";
const Home = () => {
  const { currentUser } = useSelector((state) => state.user);
  // we wana fetch listings data to make an image slider
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState(null);
  const [rentListings, setRentListings] = useState(null);
  SwiperCore.use([Navigation]);
  useEffect(() => {
    // fetching offer listing data
    const fetchOfferListings = async () => {
      try {
        const res = await fetch(`/api/data/alllistings?offer=true&limit=3`);
        const data = await res.json();
        setOfferListings(data);
        // untill this data is not fetched we did not get rent data so we call it inside it
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };
    //fetching rent listing data
    const fetchRentListings = async () => {
      try {
        const res = await fetch(`/api/data/alllistings?type=rent&limit=3`);
        const data = await res.json();
        setRentListings(data);
        // untill this data is not fetched we did not get sale data so we call it inside it
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };
    // fetching sale listing data
    const fetchSaleListings = async () => {
      try {
        const res = await fetch(`/api/data/alllistings?type=sale&limit=3`);
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOfferListings();
  }, []);
  console.log(saleListings);
  return (
    <div>
      {/* Intro Section */}
      <div className="flex flex-col gap-6 p-20 px-3 max-w-6xl mx-auto">
        <h1 className="text-slate-700 text-3xl lg:text-6xl font-myFont font-bold ">
          Welcome to{" "}
          <span className="text-slate-500 font-normal font-myFont2 ">
            Hostels&Homes{" "}
          </span>{" "}
          <br />
          Your Gateway to Affordable
          <br /> Living.
        </h1>
        <div className="text-gray-500 text-xs sm:text-sm font-myFont">
          We connect you to a variety of accommodations—from cozy hostels to
          charming homes.
          <br /> Whether you're a student, traveler, or professional, our
          platform simplifies your
          <br /> search for the ideal space. Explore our listings today and find
          the perfect <br />
          fit for your lifestyle and budget!
        </div>
        <Link
          to={"/search"}
          className="text-sx sm:text-sm text-blue-800 font-bold hover:underline font-myFont"
        >
          Let's Start now...
        </Link>
      </div>
      {/* Listing Slider Section */}
      {offerListings && offerListings.length > 0 && (
        <Swiper navigation>
          {offerListings.map((listing, index) => {
            // Use the first image of the imagesLink array as the cover image
            const coverImage = listing.imagesLink[0];
            return (
              <SwiperSlide key={index}>
                <div
                  className="h-[500px]"
                  style={{
                    background: `url(${coverImage}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      )}
      {/* listings results for sales and rent */}
      <div className="max-w-6xl mx-auto p-3 flex-col gap-8 my-10">
        {offerListings && offerListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-myFont">Recent offers</h2>
              <Link
                className="text-blue-800 text-sm hover:underline font-myFont"
                to={`/search?offer=true`}
              >
                Show more offers...
              </Link>
            </div>
            <div className="flex flex-wrap gap-3 ">
              {offerListings.map((listing, index) => (
                <ListingItem key={index} listing={listing} id={listing._id} />
              ))}
            </div>
          </div>
        )}
        {rentListings && rentListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-myFont">Recent places for rent</h2>
              <Link
                className="text-blue-800 text-sm hover:underline font-myFont"
                to={`/search?type=rent`}
              >
                Show more places for rent...
              </Link>
            </div>
            <div className="flex flex-wrap gap-3 ">
              {rentListings.map((listing, index) => (
                <ListingItem key={index} listing={listing} id={listing._id} />
              ))}
            </div>
          </div>
        )}
        {saleListings && saleListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-myFont">Recent places for sale</h2>
              <Link
                className="text-blue-800 text-sm hover:underline font-myFont"
                to={`/search?type=sale`}
              >
                Show more places for sale...
              </Link>
            </div>
            <div className="flex flex-wrap gap-3 ">
              {saleListings.map((listing, index) => (
                <ListingItem key={index} listing={listing} id={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
