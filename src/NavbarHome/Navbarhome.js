import React from 'react';
import './Navbarhome.css';
import logo from '../media/logo.png'
const NavbarHome = () => {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <img src={logo} alt="Logo" className="logo-image" />
        </div>

        <nav className="navbar-nav">
          <a href="/" className="nav-link active">Home</a>
          <a href="/lodges" className="nav-link">Lodge's</a>
          <a href="/openingsdagen" className="nav-link">Openingsdagen</a>
        </nav>

        <div className="navbar-actions">
          <button className="navbar-login-btn">Inloggen</button>
        </div>
      </div>
    </header>
  );
};

export default NavbarHome;