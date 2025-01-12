import React from "react";

const About = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-myFont text-gray-800 mb-6 text-center">
          About Us
        </h1>
        <p className="text-lg font-myFont2 text-gray-600 text-center mb-8">
          Welcome to{" "}
          <span className="text-blue-500 font-myFont2">Hostels&Homes</span>
        </p>

        <section className="mb-10">
          <h2 className="text-2xl font-myFont text-gray-800 mb-4">
            Our Mission
          </h2>
          <p className="text-gray-600 leading-relaxed font-myFont">
            At Hostels&amp;Homes, we believe that finding the perfect place to
            live should be simple, affordable, and enjoyable. Founded with a
            passion for connecting people to their ideal accommodations, we
            specialize in a diverse range of rental options, from vibrant
            hostels to cozy homes.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-myFont text-gray-800 mb-4">
            What We Offer
          </h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600 font-myFont">
            <li>
              <span className="font-bold">Diverse Accommodations:</span> Whether
              you’re looking for a lively hostel atmosphere or a quiet home, we
              have options to suit every lifestyle.
            </li>
            <li>
              <span className="font-bold">User-Friendly Experience:</span> Our
              platform is designed to make your search easy and efficient,
              allowing you to filter listings based on your preferences.
            </li>
            <li>
              <span className="font-bold">Affordable Choices:</span> We
              prioritize affordability, ensuring that you can find a place that
              fits your budget without compromising on comfort.
            </li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-myFont text-gray-800 mb-4">
            Why Choose Us?
          </h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600 font-myFont">
            <li>
              <span className="font-bold">Expert Guidance:</span> Our team is
              dedicated to helping you navigate the rental market and find the
              best options available.
            </li>
            <li>
              <span className="font-bold">Community Focused:</span> We believe
              in building a community where everyone can find a place they love
              to call home.
            </li>
            <li>
              <span className="font-bold">Commitment to Quality:</span> We work
              with trusted landlords and property owners to ensure that our
              listings meet high standards of quality and safety.
            </li>
          </ul>
        </section>

        <section className="text-center">
          <h2 className="text-2xl font-myFont text-gray-800 mb-4">Join Us</h2>
          <p className="text-gray-600 leading-relaxed mb-6 font-myFont">
            Explore our listings today and start your journey to finding the
            perfect rental space with Hostels&amp;Homes. Whether you’re moving
            to a new city or just looking for a temporary stay, we’re here to
            help you every step of the way.
          </p>
          <a
            href="/search"
            className="uppercase bg-gradient-to-r from-[#147d6c] to-[#14a390] text-white p-3 
              rounded-lg hover:bg-gradient-to-r hover:from-[#14a390] hover:to-[#147d6c] w-6 disabled:opacity-80"
          >
            Explore Listings
          </a>
        </section>
      </div>
    </div>
  );
};

export default About;
