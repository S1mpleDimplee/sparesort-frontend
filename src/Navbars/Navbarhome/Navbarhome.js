import React from 'react';
import './Navbarhome.css';
import logo from '../../media/logo.png'
import { useNavigate } from 'react-router-dom';
const NavbarHome = () => {

  const navigate = useNavigate();

  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <img src={logo} alt="Logo" className="logo-image" />
        </div>

        <nav className="navbar-nav">
          <a className="nav-link active">Home</a>
          <a className="nav-link">Lodge's</a>
          <a className="nav-link">Openingsdagen</a>
        </nav>

        <div className="navbar-actions">
          <button className="navbar-login-btn" onClick={() => navigate('/inloggen')}>Inloggen</button>
        </div>
      </div>
    </header>
  );
};

export default NavbarHome;