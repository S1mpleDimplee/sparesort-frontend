import React, { useEffect, useState } from "react";
import "./NavbarDashboard.css";
import logo from "../../media/logo.png";
import { useNavigate } from "react-router-dom";
import { calendar } from "../../Icons/Icons";

const NavbarDashboard = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [role, setRole] = useState(0);
  const [selectedPage, setSelectedPage] = useState("dashboard");


  useEffect(() => {
    const userdata = JSON.parse(localStorage.getItem("userdata"));
    const currentRole = parseInt(userdata.role) || 0;
    setRole(currentRole);

    const currentPage = localStorage.getItem("currentPage") || "dashboard";
    setSelectedPage(currentPage);
  }, []);

  const navigate = useNavigate();

  const menuItems = {
    // Customer (role 0)
    0: [
      {
        id: "dashboard",
        label: "Dashboard",
        path: "/dashboard",
        description: "Overzicht van uw account",
      },
      {
        id: "mijnboekingen",
        label: "Mijn boeking",
        path: "/dashboard/mijnboekingen",
        description: "Uw boekingsinformatie",
      },
      {
        id: "facturen",
        label: "Facturen",
        path: "/dashboard/facturen",
        description: "Uw factuuroverzicht",
      },
    ],
    // Balie (role 1)
    1: [
      {
        id: "dashboard",
        label: "Dashboard",
        path: "/dashboard",
      },
      {
        id: "lodges",
        label: "Lodges",
        path: "/dashboard/lodges",
      },
      {
        id: "calendar",
        label: "kalender",
        path: "/dashboard/calendar",
      },

    ],
    // Onderhoud (role 2)
    2: [
      {
        id: "dashboard",
        label: "Dashboard",
        path: "/dashboard",
        description: "Bedrijfsoverzicht",
      },
      {
        id: "afspraken",
        label: "Afspraken",
        path: "/dashboard/rooster",
        description: "Alle afspraken beheren",
      },
      {
        id: "facturen",
        label: "Facturen",
        path: "/dashboard/facturen",
        description: "Factuur management",
      },
      {
        id: "gebruikers",
        label: "Gebruikers",
        path: "/dashboard/gebruikers",
        description: "Personeel beheer",
      },
      {
        id: "rapporten",
        label: "Rapporten",
        path: "/dashboard/rapporten",
        description: "Business intelligence",
      },
    ],
    // Manager (role 3)
    3: [
      {
        id: "dashboard",
        label: "Dashboard",
        path: "/dashboard",
        description: "Bedrijfsoverzicht",
      },
      {
        id: "lodges",
        label: "Lodges",
        path: "/dashboard/lodges",
        description: "Lodge beheer",
      },
      {
        id: "gebruikers",
        label: "Gebruikers",
        path: "/dashboard/gebruikers",
        description: "Personeel beheer",
      },
      {
        id: "Boekingen",
        label: "Boekingen",
        path: "/dashboard/boekingen",
        description: "Alle boekingen beheren",
      },
    ],
  };

  const handleSubitemClick = (path) => {
    navigate(path);
    setActiveDropdown(null);
  };

  return (
    <div className="navbar-dash">
      <div className="navbar-dash-container">
        <div className="navbar-dash-logo">
          <img
            src={logo}
            alt="Logo"
            className="logo-image"
            onClick={() => navigate("/")}
          />
        </div>

        <nav className="navbar-dash-nav">
          {menuItems[role] &&
            menuItems[role].map((item) => (
              <div key={item.id} className="nav-dash-dropdown">
                <a
                  className={`nav-dash-link ${selectedPage === item.id ? 'nav-dash-selected' : ''}`}
                  onClick={() => {
  navigate(item.path);
  setSelectedPage(item.id);
  localStorage.setItem("currentPage", item.id);
}}
                  onMouseEnter={() => setActiveDropdown(item.subitems ? item.id : null)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  {item.label}
                  {item.subitems && (
                    <svg
                      className={`nav-dash-arrow ${activeDropdown === item.id ? 'open' : ''}`}
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
                  )}
                </a>

                {item.subitems && activeDropdown === item.id && (
                  <div
                    className="nav-dropdown-menu"
                    onMouseEnter={() => setActiveDropdown(item.id)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    {item.subitems.map((subitem) => (
                      <div
                        key={subitem.id}
                        className="nav-dropdown-item"
                        onClick={() => handleSubitemClick(subitem.path)}
                      >
                        <div className="nav-dash-dropdown-content">
                          <span className="nav-dash-dropdown-label">{subitem.label}</span>
                          {subitem.description && (
                            <span className="nav-dash-dropdown-description">{subitem.description}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
        </nav>

        <div className="navbar-dash-actions">
          {/* <button className="navbar-dash-login-btn" onClick={() => navigate('/inloggen')}>Inloggen</button> */}
        </div>
      </div>

    </div>
  );
};

export default NavbarDashboard;