import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";

const SignUp = () => {
  const [formdata, setFormdata] = useState({});
  //create states one for error and 2nd for loading effect
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChage = (e) => {
    setFormdata({
      ...formdata,
      [e.target.id]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    //edited "" add loading effect
    try {
      setLoading(true);
      // backend to store data of the user
      // hare i use proxy which is created in vite.config.js file for localhost
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // data is submited to backend
        body: JSON.stringify(formdata),
      });
      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
        setLoading(false);
        return;
      }
      setLoading(false);
      setError(null);
      navigate("/login");
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Sign Up</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="username"
          id="username"
          className="border border-[#158a7b] p-3 rounded-lg focus:outline-none focus:border-2"
          required
          onChange={handleChage}
        />
        <input
          type="email"
          placeholder="@gmail.com"
          id="email"
          className="border border-[#158a7b] p-3 rounded-lg focus:outline-none focus:border-2"
          required
          onChange={handleChage}
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          className="border border-[#158a7b] p-3 rounded-lg focus:outline-none focus:border-2"
          required
          onChange={handleChage}
        />
        <button
          disabled={loading}
          className="bg-gradient-to-r from-[#147d6c] to-[#14a390] text-white p-3 rounded-lg hover:bg-gradient-to-r hover:from-[#14a390] hover:to-[#147d6c]"
        >
          {loading ? "loading..." : "SIGN UP"}
        </button>
        <OAuth />
      </form>
      <div className="flex gap-2 mt-5">
        <p>Already have an account?</p>
        <Link to={"/login"}>
          <span className="text-blue-700">Login</span>
        </Link>
      </div>
      {error && <p className="text-red-600 mt-5">{error}</p>}
    </div>
  );
};

export default SignUp;
