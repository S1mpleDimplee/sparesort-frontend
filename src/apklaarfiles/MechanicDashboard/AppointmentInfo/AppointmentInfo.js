import React, { useState } from 'react';
import './AppointmentInfo.css';

const AppointmentInfo = () => {
  // Control variable for appointment state
  const [appointmentStarted, setAppointmentStarted] = useState(false);
  
  // Sample appointment data - would come from props or API
  const [appointmentData, setAppointmentData] = useState({
    carInfo: {
      brand: 'Toyota',
      model: 'STARLET',
      year: '1999',
      licensePlate: 'STARLET',
      lastInspection: '19-11-2024',
      registeredSince: '11-10-2024',
      description: 'Blauw | 1.3L | Benzine | blah | blah',
      logo: '🌐',
      logoText: 'Toyota starlet 1999'
    },
    repairs: [
      { id: 1, name: 'Voorband rechts voor vervangen', checked: appointmentStarted, type: 'repair' },
      { id: 2, name: 'APK-Keuring', checked: false, type: 'inspection' },
      { id: 3, name: 'Motor olie verversen', checked: false, type: 'maintenance' }
    ],
    appointmentTime: '10:00'
  });

  const handleRepairToggle = (repairId) => {
    if (!appointmentStarted) return; // Only allow toggling when appointment is started
    
    setAppointmentData(prev => ({
      ...prev,
      repairs: prev.repairs.map(repair =>
        repair.id === repairId ? { ...repair, checked: !repair.checked } : repair
      )
    }));
  };

  const handleStartAppointment = () => {
    setAppointmentStarted(true);
    // Update first repair to be checked when appointment starts
    setAppointmentData(prev => ({
      ...prev,
      repairs: prev.repairs.map(repair =>
        repair.id === 1 ? { ...repair, checked: true } : repair
      )
    }));
  };

  const toggleAppointmentState = () => {
    setAppointmentStarted(!appointmentStarted);
    if (!appointmentStarted) {
      handleStartAppointment();
    }
  };

  return (
    <div className="appointment-info-container">
      {/* Header */}
      <div className="appointment-info-header">
        <div className="appointment-info-breadcrumb">
          <span>Dashboard</span>
          <span className="appointment-info-separator">/</span>
          <span>Afspraken</span>
          <span className="appointment-info-separator">/</span>
          <span>Afspraak info</span>
        </div>
        
        <div className="appointment-info-user-info">
          <div className="appointment-info-user-avatar"></div>
          <span className="appointment-info-user-name">Edward robinson</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="appointment-info-main-content">
        <div className="appointment-info-content-grid">
          
          {/* Left Section - Car Image and Details */}
          <div className="appointment-info-left-section">
            <div className="appointment-info-car-image-container">
              <img 
                src="https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400&h=250&fit=crop&auto=format"
                alt={`${appointmentData.carInfo.brand} ${appointmentData.carInfo.model}`}
                className="appointment-info-car-image"
              />
            </div>
            
            {/* Car Details Table */}
            <div className="appointment-info-car-details-table">
              <div className="appointment-info-car-detail-row">
                <span className="appointment-info-car-detail-label">Merk</span>
                <span className="appointment-info-car-detail-value">{appointmentData.carInfo.brand}</span>
              </div>
              <div className="appointment-info-car-detail-row">
                <span className="appointment-info-car-detail-label">Model</span>
                <span className="appointment-info-car-detail-value">{appointmentData.carInfo.model}</span>
              </div>
              <div className="appointment-info-car-detail-row">
                <span className="appointment-info-car-detail-label">Bouw jaar</span>
                <span className="appointment-info-car-detail-value">{appointmentData.carInfo.year}</span>
              </div>
              <div className="appointment-info-car-detail-row">
                <span className="appointment-info-car-detail-label">Kenteken</span>
                <span className="appointment-info-car-detail-value">{appointmentData.carInfo.licensePlate}</span>
              </div>
              <div className="appointment-info-car-detail-row">
                <span className="appointment-info-car-detail-label">Laatste keuring</span>
                <span className="appointment-info-car-detail-value">{appointmentData.carInfo.lastInspection}</span>
              </div>
              <div className="appointment-info-car-detail-row">
                <span className="appointment-info-car-detail-label">Geregistreerd sinds</span>
                <span className="appointment-info-car-detail-value">{appointmentData.carInfo.registeredSince}</span>
              </div>
              <div className="appointment-info-car-detail-row empty">
                <span className="appointment-info-car-detail-label">Geregistreerd sinds</span>
                <span className="appointment-info-car-detail-value"></span>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="appointment-info-action-buttons">
              <button className="appointment-info-modify-btn">Informatie wijzigen</button>
              {!appointmentStarted && (
                <button 
                  className="appointment-info-start-btn"
                  onClick={handleStartAppointment}
                >
                  Afspraak starten
                </button>
              )}
            </div>
          </div>

          {/* Right Section - Car Info and Repairs */}
          <div className="appointment-info-right-section">
            <div className="appointment-info-car-info-card">
              <div className="appointment-info-car-logo">
                <div className="appointment-info-car-logo-icon">{appointmentData.carInfo.logo}</div>
                <span className="appointment-info-car-logo-text">{appointmentData.carInfo.logoText}</span>
              </div>
              
              <h2 className="appointment-info-car-title">Toyota starlet 1999</h2>
              <p className="appointment-info-car-subtitle">{appointmentData.carInfo.description}</p>
            </div>
            
            {/* Repairs Section */}
            <div className="appointment-info-repairs-section">
              <div className="appointment-info-repairs-header">
                <h3>Reparaties nodig</h3>
                {appointmentStarted && <span className="appointment-info-completion-text">1 van 3 afgehandeld</span>}
              </div>
              
              <div className="appointment-info-repairs-list">
                {appointmentData.repairs.map((repair) => (
                  <div key={repair.id} className="appointment-info-repair-item">
                    <span className="appointment-info-repair-name">{repair.name}</span>
                    <input
                      type="checkbox"
                      checked={repair.checked}
                      onChange={() => handleRepairToggle(repair.id)}
                      className="appointment-info-repair-checkbox"
                      disabled={!appointmentStarted}
                    />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Bottom Action Area */}
            {appointmentStarted && (
              <div className="appointment-info-bottom-actions">
                <div className="appointment-info-time-info">
                  <span>Afspraak gestart om: {appointmentData.appointmentTime}</span>
                </div>
                <div className="appointment-info-bottom-buttons">
                  <button className="appointment-info-bottom-btn info">Informatie wijzigen</button>
                  <button className="appointment-info-bottom-btn notification">Notitie toevoegen</button>
                  <button className="appointment-info-bottom-btn pause">Afspraak pauzeren</button>
                  <button className="appointment-info-bottom-btn complete">Afspraak afhandelen</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Debug Toggle Button - Remove in production */}
      <button 
        className="appointment-info-debug-toggle"
        onClick={toggleAppointmentState}
      >
        Toggle State: {appointmentStarted ? 'Started' : 'Not Started'}
      </button>
    </div>
  );
};

export default AppointmentInfo;