import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";
const Login = () => {
  const [formdata, setFormdata] = useState({});
  //create states one for error and 2nd for loading effect
  // const [error, setError] = useState(null);
  // const [loading, setLoading] = useState(false);did not need to use that insted of this we use gloable state of our reduceer
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  // initialize dispatch
  const dispatch = useDispatch();
  const handleChange = (e) => {
    setFormdata({
      ...formdata,
      [e.target.id]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    //edited "" add loading effect
    try {
      // setLoading(true);// this is first we use
      dispatch(signInStart()); // this is second we use with react redux
      // backend to store data of the user
      // hare i use proxy which is created in vite.config.js file for localhost
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // data is submited to backend
        body: JSON.stringify(formdata),
      });
      const data = await res.json();
      if (data.success === false) {
        // setError(data.message); firstly we use both of thate for error
        // setLoading(false);
        dispatch(signInFailure(data.message)); // now we use with react redux
        return;
      }
      // setLoading(false); previous method
      // setError(null);
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      // setLoading(false);
      // setError(error.message);

      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Sign In</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="@gmail.com"
          id="email"
          className="border border-[#158a7b] p-3 rounded-lg focus:outline-none focus:border-2"
          required
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          className="border border-[#158a7b] p-3 rounded-lg focus:outline-none focus:border-2"
          required
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-gradient-to-r from-[#147d6c] to-[#14a390] text-white p-3 rounded-lg hover:bg-gradient-to-r hover:from-[#14a390] hover:to-[#147d6c]"
        >
          {loading ? "loading..." : "LOGIN"}
        </button>
        <OAuth />
      </form>
      <div className="flex gap-2 mt-5">
        <p>Dont have an account?</p>
        <Link to={"/signup"}>
          <span className="text-blue-700">SIGN-UP</span>
        </Link>
      </div>
      {error && <p className="text-red-600 mt-5">{error}</p>}
    </div>
  );
};

export default Login;
