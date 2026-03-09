import React, { useState, useEffect } from "react";
import "./AccountOverview.css";
import apiCall from "../../../Calls/calls";
import { useToast } from "../../../toastmessage/toastmessage";
import { useNavigate } from "react-router-dom";
import ConfirmDeleteUser from "../Modals/ConfirmDeleteUser/ConfirmDeleteUser";

const AccountOverview = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userData, setUserData] = useState({
    id: "", name: "", email: "", phonenumber: "",
    role: "0", email_verified: 0, created_at: "",
    street: "", housenumber: "", addition: "", zipcode: "", city: "",
  });

  const { openToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setIsLoading(true);
    const userid = JSON.parse(localStorage.getItem("selectedUserId")) || 1;
    try {
      const response = await apiCall("getuserdata", { userid });
      if (response.isSuccess) {
        setUserData(response.data);
      } else {
        openToast(response.message);
      }
    } catch (error) {
      openToast(error.message || "Er is een fout opgetreden bij het laden van de gebruikersgegevens.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSaveChanges = async () => {
    setIsLoading(true);
    const response = await apiCall("updateuserdata", userData);
    openToast(response.message);
    if (response.isSuccess) {
      setHasChanges(false);
    }
    setIsLoading(false);
  };

  const handleCancel = () => {
    fetchUserData();
    setHasChanges(false);
  };

  const handleDeleteAccount = async () => {
    const response = await apiCall("deleteuser", { userid: userData.id });
    openToast(response.message);
    if (response.isSuccess) {
      navigate("/dashboard/gebruikers");
    }
    else {
    }
  }

  const getInitials = () => {
    if (userData.name) {
      const parts = userData.name.split(" ");
      return (parts[0]?.[0] || "") + (parts[parts.length - 1]?.[0] || "");
    }
    return (userData.email?.[0] || "") + (userData.email?.[1] || "");
  };

  const getRoleLabel = (role) => {
    switch (String(role)) {
      case "1": return "Balimedewerker";
      case "2": return "Monteur";
      case "3": return "Manager";
      default: return "Gast";
    }
  };

  return (
    <div className="manage-account-overview page-enter">
      <div className="manage-account-container">
        <button className="lodge-details-back-btn" onClick={() => navigate(-1)}>
          ← Terug naar overzicht
        </button>
        <div className="manage-account-content-grid">


          <div className="manage-account-left-section card">
            <div className="manage-account-header">
              <h1 className="manage-account-title fade-in">Account overzicht</h1>
              <p className="manage-account-subtitle fade-in-delayed">{getRoleLabel(userData.role)}</p>
            </div>

            <div className="manage-account-profile-section card-entrance">
              <div className="manage-account-profile-avatar hover-scale">
                {getInitials().toUpperCase()}
              </div>
              <div className="manage-account-profile-info">
                <div className="manage-account-profile-email">{userData.email}</div>
                <div className="manage-account-profile-status">
                  {userData.email_verified == 1 ? (
                    <span className="manage-account-status-verified">✓ Geverifieerd</span>
                  ) : (
                    <span className="manage-account-status-unverified">! Niet geverifieerd</span>
                  )}
                </div>
              </div>
            </div>

            <div className="manage-account-form-content">
              <div className="manage-account-content-left">
                <div className="manage-account-form-column">
                  <div className="manage-account-form-group">
                    <label>Naam</label>
                    <input
                      type="text"
                      value={userData.name || ""}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="manage-account-form-input" />
                  </div>

                  <div className="manage-account-form-group">
                    <label>Email</label>
                    <input
                      type="text"
                      value={userData.email || ""}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="manage-account-form-input" />
                  </div>

                  <div className="manage-account-form-group">
                    <label>Telefoonnummer</label>
                    <input
                      type="text" value={userData.phonenumber || ""}
                      onChange={(e) => handleInputChange("phonenumber", e.target.value)}
                      className="manage-account-form-input" />
                  </div>

                  <div className="manage-account-form-group">
                    <label>Role</label>
                    <select
                      value={userData.role || "0"}
                      onChange={(e) => handleInputChange("role", e.target.value)}
                      className="manage-account-form-input">
                      <option value="0">Gast</option>
                      <option value="1">Balimedewerker</option>
                      <option value="2">Monteur</option>
                      <option value="3">Manager</option>
                    </select>
                  </div>

                  <div className="manage-account-form-group">
                    <label>Status</label>
                    <select
                      value={userData.email_verified || 0}
                      onChange={(e) => handleInputChange("email_verified", e.target.value)}
                      className="manage-account-form-input">
                      <option value="1">Actief</option>
                      <option value="0">Inactief</option>
                    </select>
                  </div>

                </div>
              </div>

              <div className="manage-account-content-right">
                <div className="manage-account-form-column">

                  <div className="manage-account-form-group">
                    <label>Straatnaam</label>
                    <input
                      type="text"
                      value={userData.street || ""}
                      onChange={(e) => handleInputChange("street", e.target.value)}
                      className="manage-account-form-input" />
                  </div>

                  <div className="manage-account-form-row-two">
                    <div className="manage-account-form-group">
                      <label>Huisnummer</label>
                      <input
                        type="text"
                        value={userData.housenumber || ""}
                        onChange={(e) => handleInputChange("housenumber", e.target.value)}
                        className="manage-account-form-input" />
                    </div>
                    <div className="manage-account-form-group">
                      <label>Toevoeging</label>
                      <input
                        type="text"
                        value={userData.addition || ""}
                        onChange={(e) => handleInputChange("addition", e.target.value)}
                        className="manage-account-form-input" />
                    </div>
                  </div>

                  <div className="manage-account-form-group">
                    <label>Postcode</label>
                    <input
                      type="text"
                      value={userData.zipcode || ""}
                      onChange={(e) => handleInputChange("zipcode", e.target.value)}
                      className="manage-account-form-input" />
                  </div>

                  <div className="manage-account-form-group">
                    <label>Stad</label>
                    <input
                      type="text"
                      value={userData.city || ""}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      className="manage-account-form-input" />
                  </div>

                </div>
              </div>
            </div>

            <div className="manage-account-actions fade-in-delayed">
              <div className="manage-account-buttons-left">
                <button
                  className={`manage-account-btn manage-account-btn-primary ${!hasChanges ? "manage-account-btn-disabled" : ""}`}
                  onClick={handleSaveChanges}
                  disabled={!hasChanges || isLoading}
                >
                  {isLoading ? "Opslaan..." : "Aanpassingen opslaan"}
                </button>
                <button className="manage-account-btn manage-account-btn-secondary" onClick={handleCancel} disabled={isLoading}>
                  Annuleren
                </button>
              </div>
              <div className="manage-account-buttons-right">
                <button className="manage-account-btn manage-account-btn-danger hover-glow" onClick={() => setShowDeleteConfirm(true)}>
                  Account verwijderen
                </button>
              </div>
            </div>
          </div>

          <div className="manage-account-info-panel card-entrance-delayed" style={{ animationDelay: "0.2s" }}>
            <h3 className="manage-account-info-title">Extra informatie</h3>
            <div className="manage-account-info-list">
              <div className="manage-account-info-item slide-right">
                <span className="manage-account-info-label">Geregistreerd op:</span>
                <span className="manage-account-info-value">{userData.created_at}</span>
              </div>
              <div className="manage-account-info-item slide-right" style={{ animationDelay: "0.1s" }}>
                <span className="manage-account-info-label">Gebruiker ID:</span>
                <span className="manage-account-info-value">#{userData.id}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
      <ConfirmDeleteUser
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => handleDeleteAccount()}
      />
    </div>

  );
};

export default AccountOverview;