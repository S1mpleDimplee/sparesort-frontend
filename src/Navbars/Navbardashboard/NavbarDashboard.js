import React, { useEffect, useState } from 'react';
import './NavbarDashboard.css';
import logo from '../../media/logo.png'
import { useNavigate } from 'react-router-dom';
const NavbarDashboard = () => {

  const [role, setRole] = useState(2);

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
      }
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
        id: "afspraken",
        label: "Afspraken",
        path: "/dashboard/rooster",
        description: "Alle afspraken beheren",
      },
    ]
  };


  return (
    <header className="navbar-dash">
      <div className="navbar-dash-container">
        <div className="navbar-dash-logo">
          <img src={logo} alt="Logo" className="logo-image" onClick={() => navigate("/")} />
        </div>

        <nav className="navbar-dash-nav">
          {menuItems[role] && menuItems[role].map(item => (
            <a key={item.id} className="nav-dash-link" onClick={() => navigate(item.path)}>{item.label}</a>


          ))}
        </nav>

        <div className="navbar-dash-actions">
          {/* <button className="navbar-dash-login-btn" onClick={() => navigate('/inloggen')}>Inloggen</button> */}
        </div>
      </div>
    </header>
  );
};

export default NavbarDashboard;