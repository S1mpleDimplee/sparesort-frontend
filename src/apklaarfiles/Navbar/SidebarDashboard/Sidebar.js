import React from "react";
import "./Sidebar.css";
import dashboard from "./media/dashboard.svg";
import car from "./media/car.svg";
import invoice from "./media/invoice.svg";
import users from "./media/users.png";
import notification from "./media/notification.svg";
import calendar from "./media/notification.svg";
import apklaar_white from "./media/apklaar_white.png";

const Sidebar = ({ userRole, onNavigate, currentPath }) => {
  // Define menu items for different roles
  const menuItems = {
    // Customer (role 0)
    1: [
      {
        id: "dashboard",
        label: "Dashboard",
        image: dashboard,
        path: "/dashboard",
        description: "Overzicht van uw account",
      },
      {
        id: "mijnauto",
        label: "Mijn auto(s)",
        image: car,
        path: "/dashboard/mijnauto",
        description: "Voertuig informatie",
      },
      {
        id: "facturen",
        label: "Facturen",
        image: invoice,
        path: "/dashboard/facturen",
        description: "Uw factuuroverzicht",
      },
      {
        id: "berichten",
        label: "Berichten",
        image: notification,
        path: "/dashboard/berichten",
        description: "Notificaties en berichten",
      },
    ],
    // Mechanic (role 1)
    2: [
      {
        id: "dashboard",
        label: "Dashboard",
        image: dashboard,
        path: "/dashboard",
        description: "Werkdag overzicht",
      },
      {
        id: "rooster",
        label: "Afspraken",
        image: calendar,
        path: "/dashboard/rooster",
        description: "Uw werkrooster",
      },
      {
        id: "klanten",
        label: "Klanten",
        image: "👥",
        path: "/dashboard/klanten",
        description: "Klantinformatie",
      },
      {
        id: "rapporten",
        label: "Rapporten",
        image: "📋",
        path: "/dashboard/rapporten",
        description: "Werk rapporten",
      },
      {
        id: "berichten",
        label: "Berichten",
        image: notification,
        path: "/dashboard/berichten",
        description: "Mededelingen",
      },
    ],
    // Manager (role 2)
    3: [
      {
        id: "dashboard",
        label: "Dashboard",
        image: dashboard,
        path: "/dashboard",
        description: "Bedrijfsoverzicht",
      },
      {
        id: "afspraken",
        label: "Afspraken",
        image: calendar,
        path: "/dashboard/rooster",
        description: "Alle afspraken beheren",
      },
      {
        id: "facturen",
        label: "Facturen",
        image: invoice,
        path: "/dashboard/facturen",
        description: "Factuur management",
      },
      {
        id: "gebruikers",
        label: "Gebruikers",
        image: users,
        path: "/dashboard/gebruikers",
        description: "Personeel beheer",
      },
      {
        id: "rapporten",
        label: "Rapporten",
        image: "📈",
        path: "/dashboard/rapporten",
        description: "Business intelligence",
      }
    ],
  };

  // Get role-specific menu items
  const currentMenuItems = menuItems[userRole] || menuItems[0];

  // Get role-specific title
  const getRoleTitle = () => {
    switch (userRole) {
      case 1:
        return "Klant Profiel";
      case 2:
        return "Monteur Profiel";
      case 3:
        return "Manager Profiel";
      default:
        return "Klant Profiel";
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userdata");
    onNavigate("/");
  };

  const handleNavigation = (path, label) => {
    localStorage.setItem("currentPage", label);
    if (onNavigate) {
      onNavigate(path);
    }
  };

  const isActive = (path) => {
    if (path === "/dashboard") {
      return currentPath === "/dashboard";
    }
    return currentPath && currentPath.startsWith(path);
  };

  return (
    <div className="sidebar">
      {/* Logo Section */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <h1>
            <img src={apklaar_white} alt="APKLAAR Logo" className="apklaar-sidebar-icon" />
          </h1>
        </div>
      </div>

      {/* User Profile Section */}
      <div className="sidebar-profile">
        <div className="sidebar-profile-title">{getRoleTitle()}</div>
      </div>

      {/* Navigation Menu */}
      <nav className="sidebar-nav">
        {currentMenuItems.map((item) => (
          <div
            key={item.id}
            className={`sidebar-nav-item ${isActive(item.path) ? "active" : ""
              }`}
            onClick={() => handleNavigation(item.path, item.label)}
            title={item.description}
          >
            <img className="sidebar-nav-icon" src={item.image} />
            <span className="sidebar-nav-label">{item.label}</span>
          </div>
        ))}

        <div className="logout-btn-bottom">
          <div
            className="sidebar-nav-item logout-item"
            onClick={() => handleLogout()}
          >
            <span className="sidebar-nav-label">Uitloggen</span>
          </div>
        </div>
      </nav>

      {/* Additional Role-specific Info */}
      {userRole === 2 && (
        <div className="sidebar-footer">
          <div className="sidebar-footer-item">
            <span className="sidebar-footer-label">Systeem Status</span>
            <span className="sidebar-footer-status active">🟢 Online</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
