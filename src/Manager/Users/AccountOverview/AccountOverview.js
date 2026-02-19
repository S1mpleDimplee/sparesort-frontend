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
      "19-11-2007"
    ]
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // Load user data from localStorage or API
    const loggedInData = JSON.parse(localStorage.getItem("userdata"));
    if (loggedInData) {
      setUserData(prevData => ({
        ...prevData,
        email: loggedInData.email || prevData.email,
        voornaam: loggedInData.firstName || "",
        achternaam: loggedInData.lastName || ""
      }));
    }
  }, []);

  const handleInputChange = (field, value) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }));
    setHasChanges(true);
  };

  const handleSaveChanges = async () => {
    setIsLoading(true);
    try {
      // API call to save changes would go here
      // const response = await postCall("updateUserData", userData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("Saving user data:", userData);
      setHasChanges(false);
      // Show success toast
    } catch (error) {
      console.error("Error saving user data:", error);
      // Show error toast
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form or reload data
    setHasChanges(false);
    // Reload original data
  };

  const handleDeleteAccount = () => {
    // Show confirmation dialog and handle account deletion
    const confirmed = window.confirm("Weet u zeker dat u uw account wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.");
    if (confirmed) {
      console.log("Account deletion requested");
      // API call to delete account
    }
  };

  const getInitials = (firstName, lastName) => {
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : "";
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : "";
    return firstInitial + lastInitial || "JA";
  };

  return (
    <div className="account-overview page-enter">
      <div className="account-container">
        <div className="account-header">
          <h1 className="account-title fade-in">Account overzicht</h1>
          <p className="account-subtitle fade-in-delayed">Gast account</p>
        </div>

        <div className="account-content">
          {/* User Profile Section */}
          <div className="profile-section card-entrance">
            <div className="profile-avatar hover-scale">
              {getInitials(userData.voornaam, userData.achternaam)}
            </div>
            <div className="profile-info">
              <div className="profile-email">{userData.email}</div>
              <div className="profile-status">
                {userData.isVerified ? (
                  <span className="status-verified">
                    <span className="status-icon">✓</span>
                    Geverifieerd
                  </span>
                ) : (
                  <span className="status-unverified">
                    <span className="status-icon">!</span>
                    Niet geverifieerd
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="account-form-section">
            <div className="account-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="voornaam">Voornaam</label>
                  <input
                    type="text"
                    id="voornaam"
                    value={userData.voornaam}
                    onChange={(e) => handleInputChange('voornaam', e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="land">Land</label>
                  <input
                    type="text"
                    id="land"
                    value={userData.land}
                    onChange={(e) => handleInputChange('land', e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="websiteTaal">Website Taal</label>
                  <input
                    type="text"
                    id="websiteTaal"
                    value={userData.websiteTaal}
                    onChange={(e) => handleInputChange('websiteTaal', e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="tussenvoegsel">Tussenvoegsel</label>
                  <input
                    type="text"
                    id="tussenvoegsel"
                    value={userData.tussenvoegsel}
                    onChange={(e) => handleInputChange('tussenvoegsel', e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="stad">Stad</label>
                  <input
                    type="text"
                    id="stad"
                    value={userData.stad}
                    onChange={(e) => handleInputChange('stad', e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="achternaam">Achternaam</label>
                  <input
                    type="text"
                    id="achternaam"
                    value={userData.achternaam}
                    onChange={(e) => handleInputChange('achternaam', e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="postcode">Postcode</label>
                  <input
                    type="text"
                    id="postcode"
                    value={userData.postcode}
                    onChange={(e) => handleInputChange('postcode', e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="straatnaam">Straatnaam</label>
                  <input
                    type="text"
                    id="straatnaam"
                    value={userData.straatnaam}
                    onChange={(e) => handleInputChange('straatnaam', e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group form-group-third">
                  <label htmlFor="huisnummer">Huisnummer</label>
                  <input
                    type="text"
                    id="huisnummer"
                    value={userData.huisnummer}
                    onChange={(e) => handleInputChange('huisnummer', e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="form-group form-group-third">
                  <label htmlFor="toevoeging">Toevoeging</label>
                  <input
                    type="text"
                    id="toevoeging"
                    value={userData.toevoeging}
                    onChange={(e) => handleInputChange('toevoeging', e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>
            </div>

            {/* Extra Information Section */}
            <div className="extra-info-section card-entrance-delayed">
              <h3 className="section-title">Extra informatie</h3>
              <div className="info-list">
                {userData.registrationDates.map((date, index) => (
                  <div key={index} className="info-item slide-right" style={{ animationDelay: `${0.1 + index * 0.1}s` }}>
                    <span className="info-label">Geregistreerd sinds:</span>
                    <span className="info-value">{date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="account-actions fade-in-delayed">
          <div className="action-buttons-left">
            <button 
              type="button" 
              className={`btn btn-primary ${!hasChanges ? 'btn-disabled' : ''}`}
              onClick={handleSaveChanges}
              disabled={!hasChanges || isLoading}
            >
              {isLoading ? 'Opslaan...' : 'Aanpassingen opslaan'}
            </button>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Annuleren
            </button>
          </div>
          <div className="action-buttons-right">
            <button 
              type="button" 
              className="btn btn-danger hover-glow"
              onClick={handleDeleteAccount}
            >
              Account verwijderen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountOverview;