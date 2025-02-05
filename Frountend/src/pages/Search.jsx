import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ListingItem from "../components/ListingItem";
import Select from "react-select";
import { Country, State, City } from "country-state-city";
const Search = () => {
  const navigate = useNavigate();
  const [searchTermData, setSearchTermData] = useState({
    searchTerm: "",
    country: null,
    state: null,
    city: null,
    type: "all",
    offer: false,
    parking: false,
    furnished: false,
    sort: "createdAt",
    order: "desc",
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const [showMore, setShowMore] = useState(false);

  // getting country state and city data
  const getCountries = () =>
    Country.getAllCountries().map((country) => ({
      value: country.isoCode,
      label: country.name,
    }));

  const getStates = (countryCode) =>
    State.getStatesOfCountry(countryCode).map((state) => ({
      value: state.isoCode,
      label: state.name,
    }));

  const getCities = (countryCode, stateCode) =>
    City.getCitiesOfState(countryCode, stateCode).map((city) => ({
      value: city.name,
      label: city.name,
    }));

  const handleLocationChange = (field, value) => {
    setSearchTermData((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "country" && { state: null, city: null }),
      ...(field === "state" && { city: null }),
    }));
  };
  // we neet to get data from the url to updata our searchTermData state
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const countryFromUrl = urlParams.get("country");
    const stateFromUrl = urlParams.get("state");
    const cityFromUrl = urlParams.get("city");
    const typeFromUrl = urlParams.get("type");
    const offerFromUrl = urlParams.get("offer");
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");
    // Convert URL strings to Select option objects
    let countryObj = null;
    if (countryFromUrl) {
      countryObj =
        getCountries().find((c) => c.label === countryFromUrl) || null;
    }

    let stateObj = null;
    if (countryObj && stateFromUrl) {
      stateObj =
        getStates(countryObj.value).find((s) => s.label === stateFromUrl) ||
        null;
    }

    let cityObj = null;
    if (countryObj && stateObj && cityFromUrl) {
      cityObj =
        getCities(countryObj.value, stateObj.value).find(
          (c) => c.label === cityFromUrl
        ) || null;
    }
    // in case of chage in anyone of these values
    if (
      searchTermFromUrl ||
      countryFromUrl ||
      stateFromUrl ||
      cityFromUrl ||
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
        country: countryObj || "",
        state: stateObj || "",
        city: cityObj || "",
        type: typeFromUrl || "all",
        offer: offerFromUrl === "true" ? true : false,
        parking: parkingFromUrl === "true" ? true : false,
        furnished: furnishedFromUrl === "true" ? true : false,
        sort: sortFromUrl || "createdAt",
        order: orderFromUrl || "desc",
      });
    }

    // now finally we will fetch data according to that searchQuery
    const fetchListings = async () => {
      try {
        setLoading(true);
        setShowMore(false);
        // now as we create a search query from tha updated url
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/data/alllistings?${searchQuery}`);
        const data = await res.json();
        if (data.success === false) {
          setLoading(false);
          console.log(data.message);
          return;
        }
        if (data.length > 8) {
          setShowMore(true);
        } else {
          setShowMore(false);
        }
        setListings(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

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
    // Only add location params if they exist
    if (searchTermData.country?.label)
      urlParams.set("country", searchTermData.country.label);
    if (searchTermData.state?.label)
      urlParams.set("state", searchTermData.state.label);
    if (searchTermData.city?.label)
      urlParams.set("city", searchTermData.city.label);
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
  const handleShowMore = async () => {
    // firt we need to get number of listings to show listings after that listings
    const numberOfListings = listings.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/data/alllistings?${searchQuery}`);
    const data = await res.json();
    if (data.length < 9) {
      setShowMore(false);
    }
    setListings([...listings, ...data]);
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
          <div className="flex">
            {/* selection fields for country state and city */}
            <div className="flex flex-col items-center gap-2">
              <Select
                options={getCountries()}
                value={searchTermData.country}
                onChange={(value) => handleLocationChange("country", value)}
                placeholder="Select Country"
                isClearable
                className="rounded-lg"
                styles={{
                  control: (provided, state) => ({
                    ...provided,
                    border: state.isFocused
                      ? "2px solid #158a7b"
                      : "1px solid #158a7b",
                    boxShadow: "none", // Removes default focus ring
                    padding: "4px", // Equivalent to Tailwind's `p-3`
                    borderRadius: "0.5rem",
                    backgroundColor: "white", // Ensures a clean background
                    "&:hover": {
                      border: state.isFocused
                        ? "2px solid #158a7b"
                        : "1px solid #158a7b", // Removes hover border change
                    },
                  }),
                  option: (provided) => ({
                    ...provided,
                    backgroundColor: "white", // Consistent white background
                    color: "black",
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "white", // No hover effect
                    },
                  }),
                  menu: (provided) => ({
                    ...provided,
                    border: "1px solid #158a7b",
                    borderRadius: "0.5rem",
                  }),
                  singleValue: (provided) => ({
                    ...provided,
                    color: "black", // Text color of the selected value
                  }),
                }}
              />
              <Select
                options={
                  searchTermData.country
                    ? getStates(searchTermData.country.value)
                    : []
                }
                value={searchTermData.state}
                onChange={(value) => handleLocationChange("state", value)}
                placeholder="Select State"
                isClearable
                isDisabled={!searchTermData.country}
                className="rounded-lg"
                styles={{
                  control: (provided, state) => ({
                    ...provided,
                    border: state.isFocused
                      ? "2px solid #158a7b"
                      : "1px solid #158a7b",
                    boxShadow: "none",
                    padding: "4px", // Tailwind `p-3`
                    borderRadius: "0.5rem",
                    backgroundColor: state.isDisabled ? "#f9f9f9" : "white", // Lighter background for disabled state
                    "&:hover": {
                      border: state.isFocused
                        ? "2px solid #158a7b"
                        : "1px solid #158a7b",
                    },
                  }),
                  option: (provided) => ({
                    ...provided,
                    backgroundColor: "white",
                    color: "black",
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "white", // No hover effect
                    },
                  }),
                  menu: (provided) => ({
                    ...provided,
                    border: "1px solid #158a7b",
                    borderRadius: "0.5rem",
                  }),
                  singleValue: (provided) => ({
                    ...provided,
                    color: "black",
                  }),
                }}
              />
              <Select
                options={
                  searchTermData.country && searchTermData.state
                    ? getCities(
                        searchTermData.country.value,
                        searchTermData.state.value
                      )
                    : []
                }
                value={searchTermData.city}
                onChange={(value) => handleLocationChange("city", value)}
                placeholder="Select City"
                isClearable
                isDisabled={!searchTermData.state}
                className="rounded-lg"
                styles={{
                  control: (provided, state) => ({
                    ...provided,
                    border: state.isFocused
                      ? "2px solid #158a7b"
                      : "1px solid #158a7b",
                    boxShadow: "none",
                    padding: "4px", // Tailwind `p-3`
                    borderRadius: "0.5rem",
                    backgroundColor: state.isDisabled ? "#f9f9f9" : "white",
                    "&:hover": {
                      border: state.isFocused
                        ? "2px solid #158a7b"
                        : "1px solid #158a7b",
                    },
                  }),
                  option: (provided) => ({
                    ...provided,
                    backgroundColor: "white",
                    color: "black",
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "white",
                    },
                  }),
                  menu: (provided) => ({
                    ...provided,
                    border: "1px solid #158a7b",
                    borderRadius: "0.5rem",
                  }),
                  singleValue: (provided) => ({
                    ...provided,
                    color: "black",
                  }),
                }}
              />
            </div>
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
              <span>Rent & Sale</span>
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
              <span>Sale</span>
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
              defaultValue={"createdAt_desc"}
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
        <h1 className="text-2xl font-semibold border-b-2 p-3 text-slate-900 my-5">
          Listing results:
        </h1>
        <div className="p-6 flex flex-wrap gap-4">
          {/* check if loading and if there is no listing founded */}
          {!loading && listings.length === 0 && (
            <p className="text-xl text-slate-700 ">No listing found!</p>
          )}
          {loading && (
            <p className="text-xl text-slate-700 text-center w-full">
              Loading...
            </p>
          )}
          {/* now to make cards for each listing */}
          {!loading &&
            listings &&
            listings.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))}
          {showMore && (
            <button
              onClick={handleShowMore}
              className="text-[#147d6c] hover:underline p-6 text-center w-full"
            >
              Show more
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
