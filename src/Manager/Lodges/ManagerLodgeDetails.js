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
    gratisWifi: false,
    parkeerplaats: false,
    airco: false,
    wasmachine: false,
    droger: false,
    bbqBuitenkeuken: false,
    televisie: false,
    hottub: false
  });

  const [extraAmenities, setExtraAmenities] = useState([
    { id: 1, name: 'Extra voorziening', checked: false }
  ]);

  const [newAmenity, setNewAmenity] = useState('');
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

  const addExtraAmenity = () => {
    if (newAmenity.trim()) {
      setExtraAmenities(prev => [...prev, {
        id: Date.now(),
        name: newAmenity,
        checked: false
      }]);
      setNewAmenity('');
    }
  };

  const removeExtraAmenity = (id) => {
    setExtraAmenities(prev => prev.filter(item => item.id !== id));
  };

  const handleSave = () => {
    console.log('Saving lodge details:', { lodgeData, amenities, extraAmenities, description });
  };

  const handleDelete = () => {
    if (window.confirm('Weet je zeker dat je deze lodge wilt verwijderen?')) {
      console.log('Deleting lodge');
    }
  };

  const amenityColumns = [
    [
      { key: 'gratisWifi', icon: '📶', text: 'Gratis wifi' },
      { key: 'airco', icon: '❄️', text: 'Airco' },
      { key: 'wasmachine', icon: '🧺', text: 'Wasmachine' },
      { key: 'droger', icon: '👕', text: 'Droger' }
    ],
    [
      { key: 'parkeerplaats', icon: '🚗', text: 'Parkeerplaats' },
      { key: 'bbqBuitenkeuken', icon: '🍖', text: 'BBQ / Buitenkeuken' },
      { key: 'televisie', icon: '📺', text: 'Televisie' },
      { key: 'hottub', icon: '🛁', text: 'Hottub' }
    ]
  ];

  return (
    <div className="manager-lodge-details-page">
      <div className="manager-lodge-details-card">
        
        <div className="manager-lodge-details-top-section">
          
          <div className="manager-lodge-details-left">
            <div className="manager-lodge-details-image-wrapper">
              <img 
                src={lodgeData.image} 
                alt={lodgeData.name}
                className="manager-lodge-details-image"
              />
            </div>
            
            <div className="manager-lodge-details-basic-info">
              <div>
                <label className="manager-lodge-details-label">Lodge naam</label>
                <h2 className="manager-lodge-details-lodge-name">{lodgeData.name}</h2>
              </div>
              
              <div>
                <div className="manager-lodge-details-price">€{lodgeData.priceRegular}</div>
                <div className="manager-lodge-details-season">Seizoenprijs (winter)</div>
                <div className="manager-lodge-details-price">€{lodgeData.priceWinter}</div>
              </div>
            </div>
            
            <button className="manager-lodge-details-image-btn">Afbeelding wijzigen</button>
          </div>

          <div className="manager-lodge-details-middle">
            <h3 className="manager-lodge-details-section-title">Status / Info</h3>
            
            <div className="manager-lodge-details-status-item">
              <span className="manager-lodge-details-status-label">Zichtbaar voor klant</span>
              <label className="manager-lodge-details-toggle">
                <input 
                  type="checkbox" 
                  checked={lodgeData.visible}
                  onChange={toggleVisibility}
                />
                <span className="manager-lodge-details-toggle-slider"></span>
              </label>
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
                  {lodgeData.aantalPersonen}
                </div>
              </div>
              
              <div className="manager-lodge-details-capacity-item">
                <span className="manager-lodge-details-capacity-label">Slaapkamers</span>
                <div className="manager-lodge-details-capacity-value">
                  {lodgeData.slaapkamers}
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
                  placeholder="Beschrijving van de lodge..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Amenities Section */}
        <div className="manager-lodge-details-amenities-section">
          <h3 className="manager-lodge-details-amenities-title">Voorzieningen</h3>
          
          <div className="manager-lodge-details-amenities-grid">
            {/* Column 1 */}
            <div className="manager-lodge-details-amenities-column">
              {amenityColumns[0].map((item) => (
                <div key={item.key} className="manager-lodge-details-amenity-item">
                  <span className="manager-lodge-details-amenity-icon">{item.icon}</span>
                  <span className="manager-lodge-details-amenity-text">{item.text}</span>
                  <label className="manager-lodge-details-checkbox">
                    <input 
                      type="checkbox" 
                      checked={amenities[item.key]}
                      onChange={() => toggleAmenity(item.key)}
                    />
                    <span className="manager-lodge-details-checkmark"></span>
                  </label>
                </div>
              ))}
            </div>

            {/* Column 2 */}
            <div className="manager-lodge-details-amenities-column">
              {amenityColumns[1].map((item) => (
                <div key={item.key} className="manager-lodge-details-amenity-item">
                  <span className="manager-lodge-details-amenity-icon">{item.icon}</span>
                  <span className="manager-lodge-details-amenity-text">{item.text}</span>
                  <label className="manager-lodge-details-checkbox">
                    <input 
                      type="checkbox" 
                      checked={amenities[item.key]}
                      onChange={() => toggleAmenity(item.key)}
                    />
                    <span className="manager-lodge-details-checkmark"></span>
                  </label>
                </div>
              ))}
            </div>

            {/* Column 3 - Extra Amenities */}
            <div className="manager-lodge-details-amenities-column">
              <h4 className="manager-lodge-details-extra-title">Extra Voorzieningen</h4>
              
              {extraAmenities.map((amenity) => (
                <div key={amenity.id} className="manager-lodge-details-amenity-item">
                  <span className="manager-lodge-details-amenity-icon">📋</span>
                  <span className="manager-lodge-details-amenity-text">{amenity.name}</span>
                  <button 
                    onClick={() => removeExtraAmenity(amenity.id)}
                    className="manager-lodge-details-remove-btn"
                  >
                    ✖
                  </button>
                </div>
              ))}

              <div className="manager-lodge-details-add-amenity">
                <input 
                  type="text"
                  placeholder="Extra Voorziening"
                  value={newAmenity}
                  onChange={(e) => setNewAmenity(e.target.value)}
                  className="manager-lodge-details-add-input"
                  onKeyPress={(e) => e.key === 'Enter' && addExtraAmenity()}
                />
                <button 
                  onClick={addExtraAmenity}
                  className="manager-lodge-details-add-btn"
                >
                  +
                </button>
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
    </div>
  );
};

export default ManagerLodgeDetails;