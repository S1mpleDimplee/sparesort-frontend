import React, { useState } from 'react';
import './Navbarhome.css';
import logo from '../../media/logo.png'
import { useNavigate } from 'react-router-dom';

const NavbarHome = () => {
  const navigate = useNavigate();
  const currentPage = window.location.pathname;
  
  const [isLodgeDropdownOpen, setIsLodgeDropdownOpen] = useState(false);

  const handleLodgeNavigation = (path) => {
    navigate(path);
    setIsLodgeDropdownOpen(false);
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <img src={logo} alt="Logo" className="logo-image" onClick={() => navigate("/")} />
        </div>

        <nav className="navbar-nav">
          <a className={`nav-link ${currentPage === "/" ? "active" : ""}`} onClick={() => navigate("/")}>
            Home
          </a>
          
          {/* Lodge's Dropdown with Hover */}
          <div 
            className="nav-dropdown"
            onMouseEnter={() => setIsLodgeDropdownOpen(true)}
            onMouseLeave={() => setIsLodgeDropdownOpen(false)}
          >
            <a 
              className={`nav-link ${currentPage.includes("/lodges") ? "active" : ""}`}
              onClick={() => navigate("/lodges")}
            >
              Lodge's
              <svg 
                className={`nav-arrow ${isLodgeDropdownOpen ? 'open' : ''}`}
                width="12" height="12" viewBox="0 0 12 12"
              >
                <path 
                  d="M2 4L6 8L10 4" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </a>

            {isLodgeDropdownOpen && (
              <div className="nav-dropdown-menu">
                <div className="nav-dropdown-item" onClick={() => handleLodgeNavigation('/lodges')}>
                  :beach: All Lodges
                </div>
                <div className="nav-dropdown-item" onClick={() => handleLodgeNavigation('/lodges/beach')}>
                  :beach: Beach Lodges
                </div>
                <div className="nav-dropdown-item" onClick={() => handleLodgeNavigation('/lodges/mountain')}>
                  :mountain_snow: Mountain Lodges
                </div>
                <div className="nav-dropdown-item" onClick={() => handleLodgeNavigation('/lodges/luxury')}>
                  :sparkles: Luxury Suites
                </div>
              </div>
            )}
          </div>
          
          <a className={`nav-link ${currentPage === "/openingsdagen" ? "active" : ""}`} onClick={() => navigate("/openingsdagen")}>
            Openingsdagen
          </a>
        </nav>

        <div className="navbar-actions">
          <button className="navbar-login-btn" onClick={() => navigate('/inloggen')}>
            Inloggen
          </button>
        </div>
      </div>
    </header>
  );
};

export default NavbarHome;