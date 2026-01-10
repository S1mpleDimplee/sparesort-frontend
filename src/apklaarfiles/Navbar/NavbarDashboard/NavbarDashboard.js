import React from "react";
import "./NavbarDashboard.css";

const NavbarDashboard = ({ userImage }) => {

  const currentPage = localStorage.getItem("currentPage") || "Dashboard";

  const username = JSON.parse(localStorage.getItem("userdata"))?.firstName;

  return (
    <header className="navbar-dashboard-header">
      <div className="navbar-dashboard-container">
        <div className="navbar-dashboard-content">
          {/* Breadcrumb Navigation */}
          <div className="breadcrumb">
            <span className="breadcrumb-link">
              Home
            </span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">{currentPage}</span>
          </div>

          {/* User Profile Section */}
          <div className="user-profile">
            <img
              src={userImage || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"}
              alt="User profile"
              className="user-avatar"
            />
            <span className="user-name">{username}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavbarDashboard;