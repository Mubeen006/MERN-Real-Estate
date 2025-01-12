import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Contact = (userRef, listingName) => {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState("");
  // here we get the landlord data to contect him
  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(`/api/${userRef.lister}`);
        const data = await res.json();
        setLandlord(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLandlord();
  }, [userRef]);
  return (
    <>
      {landlord && (
        <div className=" flex flex-col gap-2">
          <p>
            Contact: <span className="font-semibold">{landlord.username}</span>{" "}
            for{" "}
            <span className="font-semibold">
              {userRef.listing.toLowerCase()}
            </span>
          </p>
          <textarea
            name="message"
            id="message"
            rows={2}
            placeholder="Enter your message here..."
            className="w-full border border-[#147d6c] focus:outline-none focus:border-2 rounded-lg p-2"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
          {/* create a custom link using user sistem for sending email */}
          <Link
            to={`mailto:${landlord.email}?Subject=${userRef.listing}&body=${message}`}
            className="bg-slate-700 text-white text-center p-3 rounded-lg hover:bg-slate-600"
          >
            Send Message
          </Link>
        </div>
      )}
    </>
  );
};

export default Contact;
