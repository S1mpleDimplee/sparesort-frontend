import React, { useState, useEffect } from "react";
import "./AccountOverview.css";

const AccountOverview = () => {
  const [userData, setUserData] = useState({
    email: "Jaylanavanderveen@gmail.com",
    isVerified: true,
    voornaam: "",
    tussenvoegsel: "",
    achternaam: "",
    land: "",
    websiteTaal: "",
    stad: "",
    postcode: "",
    straatnaam: "",
    huisnummer: "",
    toevoeging: "",
    registrationDates: [
      "19-11-2007",
      "19-11-2007",
      "19-11-2007",
      "19-11-2007",
      "19-11-2007",
    ],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const loggedInData = JSON.parse(localStorage.getItem("userdata"));
    if (loggedInData) {
      setUserData((prevData) => ({
        ...prevData,
        email: loggedInData.email || prevData.email,
        voornaam: loggedInData.firstName || "",
        achternaam: loggedInData.lastName || "",
      }));
    }
  }, []);

  const handleInputChange = (field, value) => {
    setUserData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setHasChanges(true);
  };

  const handleSaveChanges = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Saving user data:", userData);
      setHasChanges(false);
    } catch (error) {
      console.error("Error saving user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setHasChanges(false);
  };

  const handleDeleteAccount = () => {
    const confirmed = window.confirm(
      "Weet u zeker dat u uw account wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.",
    );
    if (confirmed) {
      console.log("Account deletion requested");
    }
  };

  const getInitials = (firstName, lastName) => {
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : "";
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : "";
    return firstInitial + lastInitial || "JA";
  };

  return (
    <div className="manage-account-overview page-enter">
      <div className="manage-account-container">
        {/* Main Content Grid */}
        <div className="manage-account-content-grid">
          {/* Left Section - Profile + Form */}
          <div className="manage-account-left-section card">
            {/* Header */}
            <div className="manage-account-header">
              <h1 className="manage-account-title fade-in">
                Account overzicht
              </h1>
              <p className="manage-account-subtitle fade-in-delayed">
                Gast account
              </p>
            </div>

            {/* Profile Section */}
            <div className="manage-account-profile-section card-entrance">
              <div className="manage-account-profile-avatar hover-scale">
                {getInitials(userData.voornaam, userData.achternaam)}
              </div>
              <div className="manage-account-profile-info">
                <div className="manage-account-profile-email">
                  {userData.email}
                </div>
                <div className="manage-account-profile-status">
                  {userData.isVerified ? (
                    <span className="manage-account-status-verified">
                      <span className="manage-account-status-icon">✓</span>
                      Geverifieerd
                    </span>
                  ) : (
                    <span className="manage-account-status-unverified">
                      <span className="manage-account-status-icon">!</span>
                      Niet geverifieerd
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Form Content Split */}
            <div className="manage-account-form-content">
              {/* Left Content */}
              <div className="manage-account-content-left">
                <div className="manage-account-form-column">
                  <div className="manage-account-form-group">
                    <label>Voornaam</label>
                    <input
                      type="text"
                      value={userData.voornaam}
                      onChange={(e) =>
                        handleInputChange("voornaam", e.target.value)
                      }
                      className="manage-account-form-input"
                    />
                  </div>

                  <div className="manage-account-form-group">
                    <label>Tussenvoegsel</label>
                    <input
                      type="text"
                      value={userData.tussenvoegsel}
                      onChange={(e) =>
                        handleInputChange("tussenvoegsel", e.target.value)
                      }
                      className="manage-account-form-input"
                    />
                  </div>

                  <div className="manage-account-form-group">
                    <label>Achternaam</label>
                    <input
                      type="text"
                      value={userData.achternaam}
                      onChange={(e) =>
                        handleInputChange("achternaam", e.target.value)
                      }
                      className="manage-account-form-input"
                    />
                  </div>
                </div>
              </div>

              {/* Right Content */}
              <div className="manage-account-content-right">
                <div className="manage-account-form-column">
                  <div className="manage-account-form-row-two">
                    <div className="manage-account-form-group">
                      <label>Land</label>
                      <input
                        type="text"
                        value={userData.land}
                        onChange={(e) =>
                          handleInputChange("land", e.target.value)
                        }
                        className="manage-account-form-input"
                      />
                    </div>
                    <div className="manage-account-form-group">
                      <label>Website Taal</label>
                      <input
                        type="text"
                        value={userData.websiteTaal}
                        onChange={(e) =>
                          handleInputChange("websiteTaal", e.target.value)
                        }
                        className="manage-account-form-input"
                      />
                    </div>
                  </div>

                  <div className="manage-account-form-group">
                    <label>Stad</label>
                    <input
                      type="text"
                      value={userData.stad}
                      onChange={(e) =>
                        handleInputChange("stad", e.target.value)
                      }
                      className="manage-account-form-input"
                    />
                  </div>

                  <div className="manage-account-form-group">
                    <label>Postcode</label>
                    <input
                      type="text"
                      value={userData.postcode}
                      onChange={(e) =>
                        handleInputChange("postcode", e.target.value)
                      }
                      className="manage-account-form-input"
                    />
                  </div>

                  <div className="manage-account-form-group">
                    <label>Straatnaam</label>
                    <input
                      type="text"
                      value={userData.straatnaam}
                      onChange={(e) =>
                        handleInputChange("straatnaam", e.target.value)
                      }
                      className="manage-account-form-input"
                    />
                  </div>

                  <div className="manage-account-form-row-two">
                    <div className="manage-account-form-group">
                      <label>Housenummer</label>
                      <input
                        type="text"
                        value={userData.huisnummer}
                        onChange={(e) =>
                          handleInputChange("huisnummer", e.target.value)
                        }
                        className="manage-account-form-input"
                      />
                    </div>
                    <div className="manage-account-form-group">
                      <label>Toevoeging</label>
                      <input
                        type="text"
                        value={userData.toevoeging}
                        onChange={(e) =>
                          handleInputChange("toevoeging", e.target.value)
                        }
                        className="manage-account-form-input"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="manage-account-actions fade-in-delayed">
              <div className="manage-account-buttons-left">
                <button
                  type="button"
                  className={`manage-account-btn manage-account-btn-primary ${!hasChanges ? "manage-account-btn-disabled" : ""}`}
                  onClick={handleSaveChanges}
                  disabled={!hasChanges || isLoading}
                >
                  {isLoading ? "Opslaan..." : "Aanpassingen opslaan"}
                </button>
                <button
                  type="button"
                  className="manage-account-btn manage-account-btn-secondary"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  Annuleren
                </button>
              </div>
              <div className="manage-account-buttons-right">
                <button
                  type="button"
                  className="manage-account-btn manage-account-btn-danger hover-glow"
                  onClick={handleDeleteAccount}
                >
                  Account verwijderen
                </button>
              </div>
            </div>
          </div>

          {/* Right Section - Extra Information */}
          <div
            className="manage-account-info-panel card-entrance-delayed"
            style={{ animationDelay: "0.2s" }}
          >
            <h3 className="manage-account-info-title">Extra informatie</h3>
            <div className="manage-account-info-list">
              {userData.registrationDates.map((date, index) => (
                <div
                  key={index}
                  className="manage-account-info-item slide-right"
                  style={{ animationDelay: `${0.1 + index * 0.1}s` }}
                >
                  <span className="manage-account-info-label">
                    Geregistreerd sinds:
                  </span>
                  <span className="manage-account-info-value">{date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountOverview;
