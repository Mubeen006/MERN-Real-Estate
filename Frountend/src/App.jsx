import React from "react";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Create_Listing from "./pages/Create_Listing";
import ProtectedRoute from "./components/ProtectedRoute";
import Edit_Listing from "./pages/Edit_Listing";
import Listing from "./pages/Listing";
import Search from "./pages/Search";
import About from "./pages/About";

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/listing/:listingId" element={<Listing />} />
          <Route path="/search" element={<Search />} />
          <Route path="/about" element={<About />} />
          <Route element={<ProtectedRoute />}>
            <Route
              path="/profile"
              element={<Profile /> /* this component is protected*/}
            />
            <Route path="/create-listing" element={<Create_Listing />} />
            <Route path="/edit-listing/:listingId" element={<Edit_Listing />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
