import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";   
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
const Listing = () => {
  SwiperCore.use([Navigation]);
  const { listingId } = useParams();
  const [listingdata, setListingdata] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
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
      {listingdata && !loading && !error &&(
        <div>
          <Swiper navigation>
            {listingdata.imagesLink.map((url)=> (
              <SwiperSlide key={url}>
                <div className="h-[550px]" style={{ background: `url(${url}) center no-repeat`, backgroundSize: "cover"}} >
                </div>
              </SwiperSlide>
            ))}
          </Swiper>;
        </div>
        )}
    </main>
  );
};

export default Listing;
