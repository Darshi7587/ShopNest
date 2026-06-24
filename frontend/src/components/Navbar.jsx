import React from "react";
import { Link } from "react-router-dom";
import "../styles/navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
        <div className="navbar-brand">
        <Link to="/">ShopNest</Link>
         <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="ShopNest Logo" className="navbar-logo" />
         ShopNest
         </div>
         <ul className="navbar-links">
          <li><Link to="/shop">Home</Link></li>
          <li><Link to="/profile">Profile</Link></li>
          <li><Link to="/cart">Cart</Link></li>
         </ul>
      </nav>
  );
};

export default Navbar;
