import React from 'react';
import './Navbarhome.css';
import logo from '../../media/logo.png'
import { useNavigate } from 'react-router-dom';
const NavbarHome = () => {

  const navigate = useNavigate();

  const currentPage = window.location.pathname;

  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <img src={logo} alt="Logo" className="logo-image" onClick={() => navigate("/")} />
        </div>

        <nav className="navbar-nav">
          <a className={`nav-link ${currentPage === "/" ? "active" : ""}`} onClick={() => navigate("/")}>Home</a>
          <a className={`nav-link ${currentPage === "/lodges" ? "active" : ""}`} onClick={() => navigate("/lodges")}>Lodge's</a>
          <a className={`nav-link ${currentPage === "/openingsdagen" ? "active" : ""}`} onClick={() => navigate("/openingsdagen")}>Openingsdagen</a>
        </nav>

        <div className="navbar-actions">
          <button className="navbar-login-btn" onClick={() => navigate('/inloggen')}>Inloggen</button>
        </div>
      </div>
    </header>
  );
};

export default NavbarHome;