import React, { useEffect, useState } from "react";
import "./NavbarDashboard.css";
import logo from "../../media/logo.png";
import { useNavigate } from "react-router-dom";

const NavbarDashboard = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [role, setRole] = useState(4);

  useEffect(() => {
    // setRole(localStorage.getItem('userRole'));
  }, []);

  const navigate = useNavigate();

  const menuItems = {
    // Customer (role 1)
    1: [
      {
        id: "dashboard",
        label: "Dashboard",
        path: "/dashboard",
        description: "Overzicht van uw account",
      },
      {
        id: "mijnauto",
        label: "Mijn auto(s)",
        path: "/dashboard/mijnauto",
        description: "Voertuig informatie",
      },
      {
        id: "facturen",
        label: "Facturen",
        path: "/dashboard/facturen",
        description: "Uw factuuroverzicht",
      },
      {
        id: "berichten",
        label: "Berichten",
        path: "/dashboard/berichten",
        description: "Notificaties en berichten",
      },
    ],
    // Balie (role 2)
    2: [
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
    ],
    // Onderhoud (role 3)
    3: [
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
    // Manager (role 4)
    4: [
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
        subitems: [
          {
            id: "alle-lodges",
            label: "Alle Lodges",
            path: "/dashboard/lodges/alle",
            description: "Overzicht van alle lodges",
          },
          {
            id: "nieuwe-lodge",
            label: "Nieuwe Lodge",
            path: "/dashboard/lodges/nieuw",
            description: "Nieuwe lodge toevoegen",
          },
        ],
      },
      {
        id: "gebruikers",
        label: "Gebruikers",
        path: "/dashboard/users",
        description: "Personeel beheer",
      },
      {
        id: "afspraken",
        label: "Afspraken",
        path: "/dashboard/rooster",
        description: "Alle afspraken beheren",
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
                  className="nav-dash-link"
                  onClick={() => navigate(item.path)}
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