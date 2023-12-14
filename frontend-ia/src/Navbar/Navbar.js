import React from 'react';
import { Link } from 'react-router-dom'; // Assurez-vous d'avoir installé react-router-dom si vous utilisez des routes


import "./navbar.css";

export const Navbar = () => {
  return (
    <div className="navbar">
      <div className="links">
        <Link to="/"> Home </Link>
        <Link to="/Upload">Upload</Link>
        <Link to="/Gallery">Gallery </Link>
        {/* <Link to= "/Display">Display</Link> */}
      </div>
    </div>
  );
};
