import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/navbar.css";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {

    const {user,logout}=useContext(AuthContext);
    const navigate=useNavigate();
    const handleLogout=()=>{
        logout();
        navigate("/login");
    };
  return (
    <nav className="navbar">
        <div className="navbar-brand">
        <Link to="/">ShopNest</Link>
         <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="ShopNest Logo" className="navbar-logo" />
         ShopNest
         </div>
         <ul className="navbar-links">
          <li><Link to="/shop">Home</Link></li>
          <li><Link to="/cart">Cart</Link></li>
          {user ? (
            <>
              <li><Link to="/profile">Hi, {user.name}</Link></li>
              {user.role === 'admin' && <li><Link to="/admin">Admin </Link></li>}
              <li><button onClick={handleLogout} className="btn-logout">Logout</button></li>
            </>
          ):(
            <li><Link to="/login">Login</Link></li>

          ) }
         </ul>
      </nav>
  );
};

export default Navbar;
