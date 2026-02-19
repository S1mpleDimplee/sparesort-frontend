import React, { useEffect, useState } from "react";
import "./ManagerUsers.css";
import { useToast } from "../../toastmessage/toastmessage";
import apiCall from "../../Calls/calls";

const ManagerUsers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [users, setUsers] = useState([]);

  const { openToast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const response = await apiCall("getallusers", {});

    if (response.isSuccess) {
      setUsers(response.data);
      console.log("Fetched users:", response.data);
    } else {
      openToast("Fout bij het ophalen van gebruikers: " + response.message);
    }
  };

  const getRoleColor = (role) => {
    switch (role.toLowerCase()) {
      case "1":
        return "manager-users-role-service";
      case "2":
        return "manager-users-role-maintenance";
      case "3":
        return "manager-users-role-manager";
      case "0":
        return "manager-users-role-guest";
      default:
        return "manager-users-role-default";
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user?.role?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="manager-users-page">
      {/* Header Section */}
      <div className="manager-users-header">
        <div className="manager-users-search-section">
          <div className="manager-users-search-wrapper">
            <input
              type="text"
              placeholder="Zoeken..."
              className="manager-users-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select className="manager-users-filter-select">
            <option value="">Alle rollen</option>
            <option value="0">Gast</option>
            <option value="1">Balimedewerker</option>
            <option value="2">Monteur</option>
            <option value="3">Manager</option>
          </select>

          <select className="manager-users-filter-select">
            <option value="">Alle statussen</option>
            <option value="active">Actief</option>
            <option value="inactive">Inactief</option>
          </select>

          <div className="manager-users-header-actions">
            <div className="manager-users-view-toggle"></div>
            <button
              className="manager-users-create-btn"
              onClick={() => setShowCreateModal(true)}
            >
              Account aanmaken
            </button>
          </div>
        </div>
      </div>
      <div className="manager-users-table-section">
        <div className="manager-users-table-wrapper">
          <table className="manager-users-table">
            <thead>
              <tr className="manager-users-table-header">
                <th className="manager-users-header-cell">Naam</th>
                <th className="manager-users-header-cell">Email adres</th>
                <th className="manager-users-header-cell">Role</th>
                <th className="manager-users-header-cell">Aangemaakt op</th>
                <th className="manager-users-header-cell">Status</th>
                <th className="manager-users-header-cell">Actie</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="manager-users-table-row">
                  <td className="manager-users-table-cell">
                    <div className="manager-users-user-info">
                      <div className="manager-users-user-avatar">
                        <span className="manager-users-avatar-text">
                          {user.name
                            ? user.name
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()
                            : user.email?.charAt(0).toUpperCase() +
                              user.email?.charAt(1).toUpperCase()}
                        </span>
                      </div>
                      <span className="manager-users-user-name">
                        {user.name}
                      </span>
                    </div>
                  </td>
                  <td className="manager-users-table-cell">
                    <span className="manager-users-email">{user.email}</span>
                  </td>
                  <td className="manager-users-table-cell">
                    <span
                      className={`manager-users-role-badge ${getRoleColor(user.role)}`}
                    >
                      {user.role === "0" && "Gast"}
                      {user.role === "1" && "Balimedewerker"}
                      {user.role === "2" && "Monteur"}
                      {user.role === "3" && "Manager"}
                    </span>
                  </td>
                  <td className="manager-users-table-cell">
                    <span className="manager-users-date">
                      {user.created_at}
                    </span>
                  </td>
                  <td className="manager-users-table-cell">
                    <span
                      className={`manager-users-status-badge ${user.email_verified ? "manager-users-status-active" : "manager-users-status-inactive"}`}
                    >
                      {user.email_verified ? "Actief" : "Inactief"}
                    </span>
                  </td>
                  <td className="manager-users-table-cell">
                    <div className="manager-users-actions">
                      <button className="manager-users-action-btn manager-users-deactivate-btn">
                        Deactiveren
                      </button>
                      <button className="manager-users-action-btn manager-users-view-btn">
                        Inzien
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            
            <td className="manager-users-table-footer">
              <span className="manager-users-end-message">
                Einde van de lijst
              </span>
            </td>
          </table>
        </div>
      </div>
      {/* Create Account Modal (placeholder) */}
      {showCreateModal && (
        <div
          className="manager-users-modal-overlay"
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className="manager-users-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="manager-users-modal-header">
              <h3>Account aanmaken</h3>
              <button
                className="manager-users-modal-close"
                onClick={() => setShowCreateModal(false)}
              >
                ×
              </button>
            </div>
            <div className="manager-users-modal-content">
              <p>Account creation form would go here...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerUsers;
