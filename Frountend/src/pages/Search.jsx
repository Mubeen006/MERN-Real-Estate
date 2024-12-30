import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ListingItem from "../components/ListingItem";
const Search = () => {
  const navigate = useNavigate();
  const [searchTermData, setSearchTermData] = useState({
    searchTerm: "",
    type: "all",
    offer: false,
    parking: false,
    furnished: false,
    sort: "created_at",
    order: "desc",
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const {currentUser} = useSelector((state) => state.user);
  // we neet to get data from the url to updata our searchTermData state
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const typeFromUrl = urlParams.get("type");
    const offerFromUrl = urlParams.get("offer");
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");
    // in case of chage in anyone of these values
    if (
      searchTermFromUrl ||
      typeFromUrl ||
      offerFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      // we will updata our searchTermData state
      setSearchTermData({
        searchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "all",
        offer: offerFromUrl === "true" ? true : false,
        parking: parkingFromUrl === "true" ? true : false,
        furnished: furnishedFromUrl === "true" ? true : false,
        sort: sortFromUrl || "created_at",
        order: orderFromUrl || "desc",
      });
    }

    // now finally we will fetch data according to that searchQuery
    const fetchListings = async () => {
      try {
        setLoading(true);
        // now as we create a search query from tha updated url
        const searchQuery= urlParams.toString();
        const res= await fetch(`/api/${currentUser._id}/alllistings?${searchQuery}`);
        const data= await res.json();
        if(data.success===false){
          setLoading(false);
          console.log(data.message);
          return;
        }
        setListings(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
      
    }

    fetchListings();

  }, [location.search]);
  const handleChange = (e) => {
    if (
      e.target.id === "all" ||
      e.target.id === "rent" ||
      e.target.id === "sale"
    ) {
      setSearchTermData({ ...searchTermData, type: e.target.id });
    }
    if (e.target.id === "searchTerm") {
      setSearchTermData({ ...searchTermData, searchTerm: e.target.value });
    }
    if (
      e.target.id === "offer" ||
      e.target.id === "parking" ||
      e.target.id === "furnished"
    ) {
      // ched if the value is bolean true or string true , to pretend any error , in our case it will check bolean true first and then string true
      setSearchTermData({
        ...searchTermData,
        [e.target.id]:
          e.target.checked || e.target.checked === "true" ? true : false,
      });
    }
    if (e.target.id === "sort_order") {
      //as we provide two values togather like created_at_desc, created_at_asc
      // we need to extract seperately
      const sort =
        e.target.value.split("_")[0] ||
        /*if there is no first value then*/ "created_at";
      // second value
      const order =
        e.target.value.split("_")[1] ||
        /*if there is no second value then*/ "desc";
      setSearchTermData({ ...searchTermData, sort, order });
    }
  };
  //create a submit handler
  const handleSubmit = (e) => {
    e.preventDefault();

    // first we need to set information for the URL
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", searchTermData.searchTerm);
    urlParams.set("type", searchTermData.type);
    urlParams.set("offer", searchTermData.offer);
    urlParams.set("parking", searchTermData.parking);
    urlParams.set("furnished", searchTermData.furnished);
    urlParams.set("sort", searchTermData.sort);
    urlParams.set("order", searchTermData.order);

    // now we need create a search query
    const searchQuery = urlParams.toString();

    // now we will navigate to that particular search query
    navigate(`/search?${searchQuery}`);
  };
  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border border-[#147d6c] border-t-0 border-b-1 md:border-r-1 md:min-h-screen">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search Term:
            </label>
            <input
              type="text"
              placeholder="Search..."
              id="searchTerm"
              value={searchTermData.searchTerm}
              onChange={handleChange}
              className=" border-[#147d6c] border-r-2
                border-b-2 bg-slate-100 focus:outline-none  rounded-lg w-full p-2"
            />
          </div>
          {/* providign serch terms to filter data */}
          <div className="flex items-center flex-wrap gap-2 ">
            <label className="whitespace-nowrap font-semibold">Type:</label>
            <div className="flex gap-2 ">
              <input
                type="checkbox"
                id="all"
                onChange={handleChange}
                checked={searchTermData.type === "all"}
                className="bg-slate w-5"
              />
              <span>Rent & Sele</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                onChange={handleChange}
                checked={searchTermData.type === "rent"}
                className="bg-slate w-5"
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                onChange={handleChange}
                checked={searchTermData.type === "sale"}
                className="bg-slate w-5"
              />
              <span>Sele</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                onChange={handleChange}
                checked={searchTermData.offer}
                className=" bg-slate w-5"
              />
              <span>offer</span>
            </div>
          </div>
          {/* Amenities/facilities */}
          <div className="flex items-center flex-wrap gap-2 ">
            <label className="whitespace-nowrap font-semibold">
              Amenities:
            </label>
            <div className=" bg-slate flex gap-2">
              <input
                type="checkbox"
                id="parking"
                onChange={handleChange}
                checked={searchTermData.parking}
                className=" bg-slate w-5"
              />
              <span>Parking</span>
            </div>
            <div className=" bg-slate flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                onChange={handleChange}
                checked={searchTermData.furnished}
                className="bg-slate w-5"
              />
              <span>Furnished</span>
            </div>
          </div>
          {/* order of the filteration */}
          <div className="flex items-center gap-2 font-semibold">
            <label>Sort:</label>
            <select
              id="sort_order"
              onChange={handleChange}
              defaultValue={"created_at_desc"}
              className=" bg-slate-100 text-sm border border-[#147d6c] rounded-lg p-2 focus:outline-none focus:border-2"
            >
              <option value="regularPrice_desc">Price high to low</option>
              <option value="regularPrice_asc">Price low to high</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>
          <button
            className="uppercase bg-gradient-to-r from-[#147d6c] to-[#14a390] text-white p-3 
              rounded-lg hover:bg-gradient-to-r hover:from-[#14a390] hover:to-[#147d6c] w-full disabled:opacity-80"
          >
            Search
          </button>
        </form>
      </div>
      {/* Listings Result */}
      <div className="flex-1">
        <h1 className="text-2xl font-semibold border-b-2 p-3 text-slate-900 my-5">Listing results:</h1>
        <div className="p-6 flex flex-wrap gap-4">
          {/* check if loading and if there is no listing founded */}
          {!loading && listings.length===0 &&(
            <p className="text-xl text-slate-700 ">No listing found!</p>
          )}
          {loading &&(
            <p className="text-xl text-slate-700 text-center w-full">Loading...</p>
          )}
          {/* now to make cards for each listing */}
          {!loading && listings && listings.map((listing) => (
            <ListingItem key={listing._id} listing={listing}/>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Search;
