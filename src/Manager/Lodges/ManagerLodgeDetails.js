import React, { useState } from 'react';
import './ManagerLodgeDetails.css';

const ManagerLodgeDetails = () => {
  const [lodgeData, setLodgeData] = useState({
    name: 'Near Cliff Lodge',
    image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600&q=80',
    priceRegular: 430.12,
    priceWinter: 430.12,
    visible: true,
    status: 'beschikbaar',
    aantalPersonen: 1,
    slaapkamers: 1
  });

  const [amenities, setAmenities] = useState({
    // Voorzieningen
    gratisWifi: false,
    parkeerplaats: false,
    airco: false,
    wasmachine: false,
    droger: false,
    bbqBuitenkeuken: false,
    televisie: false,
    hottub: false,
    // Extra Voorzieningen
    extraGratisWifi: false,
    extraAirco: false,
    extraWasmachine: false,
    extraDroger: false,
    extraVoorziening1: false
  });

  const [extraVoorziening, setExtraVoorziening] = useState('');
  const [description, setDescription] = useState('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.');

  const toggleAmenity = (amenity) => {
    setAmenities(prev => ({
      ...prev,
      [amenity]: !prev[amenity]
    }));
  };

  const toggleVisibility = () => {
    setLodgeData(prev => ({
      ...prev,
      visible: !prev.visible
    }));
  };

  const handleSave = () => {
    console.log('Saving lodge details:', { lodgeData, amenities, description });
    // Save logic would go here
  };

  const handleDelete = () => {
    if (window.confirm('Weet je zeker dat je deze lodge wilt verwijderen?')) {
      console.log('Deleting lodge');
      // Delete logic would go here
    }
  };

  return (
    <div className="manager-lodge-details-page">
      <div className="manager-lodge-details-container">
        
        {/* Left Section - Lodge Image and Basic Info */}
        <div className="manager-lodge-details-left">
          <div className="manager-lodge-details-image-section">
            <div className="manager-lodge-details-image-wrapper">
              <img 
                src={lodgeData.image} 
                alt={lodgeData.name}
                className="manager-lodge-details-image"
              />
            </div>
            
            <div className="manager-lodge-details-basic-info">
              <div className="manager-lodge-details-name-section">
                <label className="manager-lodge-details-label">Lodge naam</label>
                <h2 className="manager-lodge-details-lodge-name">{lodgeData.name}</h2>
              </div>
              
              <div className="manager-lodge-details-pricing">
                <div className="manager-lodge-details-price-item">
                  <span className="manager-lodge-details-price">€{lodgeData.priceRegular}</span>
                </div>
                <div className="manager-lodge-details-price-item">
                  <span className="manager-lodge-details-season">Seizoenprijs (winter)</span>
                  <span className="manager-lodge-details-price">€{lodgeData.priceWinter}</span>
                </div>
              </div>
            </div>
            
            <div className="manager-lodge-details-image-controls">
              <button className="manager-lodge-details-image-btn">Afbeelding wijzigen</button>
            </div>
          </div>
        </div>

        {/* Middle Section - Status and Capacity */}
        <div className="manager-lodge-details-middle">
          <div className="manager-lodge-details-status-section">
            <h3 className="manager-lodge-details-section-title">Status / Info</h3>
            
            <div className="manager-lodge-details-status-item">
              <span className="manager-lodge-details-status-label">Zichtbaar voor klant</span>
              <div className="manager-lodge-details-toggle-wrapper">
                <label className="manager-lodge-details-toggle">
                  <input 
                    type="checkbox" 
                    checked={lodgeData.visible}
                    onChange={toggleVisibility}
                  />
                  <span className="manager-lodge-details-toggle-slider"></span>
                </label>
              </div>
            </div>
            
            <div className="manager-lodge-details-status-item">
              <span className="manager-lodge-details-status-label">Status</span>
              <span className="manager-lodge-details-status-badge manager-lodge-details-status-available">
                Beschikbaar
              </span>
            </div>
            
            <div className="manager-lodge-details-capacity-section">
              <div className="manager-lodge-details-capacity-item">
                <span className="manager-lodge-details-capacity-label">Aantal Personen</span>
                <div className="manager-lodge-details-capacity-value">
                  <span>{lodgeData.aantalPersonen}</span>
                </div>
              </div>
              
              <div className="manager-lodge-details-capacity-item">
                <span className="manager-lodge-details-capacity-label">Slaapkamers</span>
                <div className="manager-lodge-details-capacity-value">
                  <span>{lodgeData.slaapkamers}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Description */}
        <div className="manager-lodge-details-right">
          <div className="manager-lodge-details-description-section">
            <h3 className="manager-lodge-details-section-title">Beschrijving</h3>
            <div className="manager-lodge-details-description-box">
              <textarea 
                className="manager-lodge-details-description-textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="8"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Amenities Section */}
      <div className="manager-lodge-details-amenities-section">
        <h3 className="manager-lodge-details-amenities-title">Voorzieningen</h3>
        
        <div className="manager-lodge-details-amenities-grid">
          {/* Voorzieningen Column 1 */}
          <div className="manager-lodge-details-amenities-column">
            <div className="manager-lodge-details-amenity-item">
              <span className="manager-lodge-details-amenity-icon">📶</span>
              <span className="manager-lodge-details-amenity-text">Gratis wifi</span>
              <label className="manager-lodge-details-checkbox">
                <input 
                  type="checkbox" 
                  checked={amenities.gratisWifi}
                  onChange={() => toggleAmenity('gratisWifi')}
                />
                <span className="manager-lodge-details-checkmark"></span>
              </label>
            </div>

            <div className="manager-lodge-details-amenity-item">
              <span className="manager-lodge-details-amenity-icon">❄️</span>
              <span className="manager-lodge-details-amenity-text">Airco</span>
              <label className="manager-lodge-details-checkbox">
                <input 
                  type="checkbox" 
                  checked={amenities.airco}
                  onChange={() => toggleAmenity('airco')}
                />
                <span className="manager-lodge-details-checkmark"></span>
              </label>
            </div>

            <div className="manager-lodge-details-amenity-item">
              <span className="manager-lodge-details-amenity-icon">🧺</span>
              <span className="manager-lodge-details-amenity-text">Wasmachine</span>
              <label className="manager-lodge-details-checkbox">
                <input 
                  type="checkbox" 
                  checked={amenities.wasmachine}
                  onChange={() => toggleAmenity('wasmachine')}
                />
                <span className="manager-lodge-details-checkmark"></span>
              </label>
            </div>

            <div className="manager-lodge-details-amenity-item">
              <span className="manager-lodge-details-amenity-icon">👕</span>
              <span className="manager-lodge-details-amenity-text">Droger</span>
              <label className="manager-lodge-details-checkbox">
                <input 
                  type="checkbox" 
                  checked={amenities.droger}
                  onChange={() => toggleAmenity('droger')}
                />
                <span className="manager-lodge-details-checkmark"></span>
              </label>
            </div>

            <div className="manager-lodge-details-amenity-item">
              <span className="manager-lodge-details-amenity-icon">👕</span>
              <span className="manager-lodge-details-amenity-text">Droger</span>
              <label className="manager-lodge-details-checkbox">
                <input 
                  type="checkbox" 
                  checked={amenities.droger}
                  onChange={() => toggleAmenity('droger')}
                />
                <span className="manager-lodge-details-checkmark"></span>
              </label>
            </div>
          </div>

          {/* Voorzieningen Column 2 */}
          <div className="manager-lodge-details-amenities-column">
            <div className="manager-lodge-details-amenity-item">
              <span className="manager-lodge-details-amenity-icon">🚗</span>
              <span className="manager-lodge-details-amenity-text">Parkeerplaats</span>
              <label className="manager-lodge-details-checkbox">
                <input 
                  type="checkbox" 
                  checked={amenities.parkeerplaats}
                  onChange={() => toggleAmenity('parkeerplaats')}
                />
                <span className="manager-lodge-details-checkmark"></span>
              </label>
            </div>

            <div className="manager-lodge-details-amenity-item">
              <span className="manager-lodge-details-amenity-icon">🍖</span>
              <span className="manager-lodge-details-amenity-text">BBQ / Buitenkeuken</span>
              <label className="manager-lodge-details-checkbox">
                <input 
                  type="checkbox" 
                  checked={amenities.bbqBuitenkeuken}
                  onChange={() => toggleAmenity('bbqBuitenkeuken')}
                />
                <span className="manager-lodge-details-checkmark"></span>
              </label>
            </div>

            <div className="manager-lodge-details-amenity-item">
              <span className="manager-lodge-details-amenity-icon">📺</span>
              <span className="manager-lodge-details-amenity-text">Televisie</span>
              <label className="manager-lodge-details-checkbox">
                <input 
                  type="checkbox" 
                  checked={amenities.televisie}
                  onChange={() => toggleAmenity('televisie')}
                />
                <span className="manager-lodge-details-checkmark"></span>
              </label>
            </div>

            <div className="manager-lodge-details-amenity-item">
              <span className="manager-lodge-details-amenity-icon">🛁</span>
              <span className="manager-lodge-details-amenity-text">Hottub</span>
              <label className="manager-lodge-details-checkbox">
                <input 
                  type="checkbox" 
                  checked={amenities.hottub}
                  onChange={() => toggleAmenity('hottub')}
                />
                <span className="manager-lodge-details-checkmark"></span>
              </label>
            </div>

            <div className="manager-lodge-details-amenity-item">
              <span className="manager-lodge-details-amenity-icon">🛁</span>
              <span className="manager-lodge-details-amenity-text">Hottub</span>
              <label className="manager-lodge-details-checkbox">
                <input 
                  type="checkbox" 
                  checked={amenities.hottub}
                  onChange={() => toggleAmenity('hottub')}
                />
                <span className="manager-lodge-details-checkmark"></span>
              </label>
            </div>
          </div>

          {/* Extra Voorzieningen Column */}
          <div className="manager-lodge-details-amenities-column">
            <h4 className="manager-lodge-details-extra-title">Extra Voorzieningen</h4>
            
            <div className="manager-lodge-details-amenity-item">
              <span className="manager-lodge-details-amenity-icon">📶</span>
              <span className="manager-lodge-details-amenity-text">Extra voorziening</span>
              <button className="manager-lodge-details-remove-btn">✖</button>
            </div>

            <div className="manager-lodge-details-add-amenity">
              <input 
                type="text"
                placeholder="Extra Voorziening"
                className="manager-lodge-details-add-input"
                value={extraVoorziening}
                onChange={(e) => setExtraVoorziening(e.target.value)}
              />
              <button className="manager-lodge-details-add-btn">+</button>
            </div>
          </div>
        </div>
      </div>

      {/* Maintenance Section */}
      <div className="manager-lodge-details-maintenance-section">
        <h3 className="manager-lodge-details-maintenance-title">Reparaties</h3>
        
        <div className="manager-lodge-details-maintenance-item">
          <div className="manager-lodge-details-maintenance-info">
            <span className="manager-lodge-details-maintenance-task">Vervanging televisie</span>
            <div className="manager-lodge-details-maintenance-status">
              <span className="manager-lodge-details-status-label">Status</span>
              <span className="manager-lodge-details-status-badge manager-lodge-details-status-progress">
                Bezig
              </span>
            </div>
          </div>
          <button className="manager-lodge-details-maintenance-btn">Inzien</button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="manager-lodge-details-actions">
        <button 
          className="manager-lodge-details-action-btn manager-lodge-details-delete-btn"
          onClick={handleDelete}
        >
          Verwijderen
        </button>
        <button 
          className="manager-lodge-details-action-btn manager-lodge-details-save-btn"
          onClick={handleSave}
        >
          Bijwerken
        </button>
      </div>
    </div>
  );
};

export default ManagerLodgeDetails;