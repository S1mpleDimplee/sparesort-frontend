import React, { useState } from 'react';
import './StartAppointment.css';

const StartAppointment = ({ 
  isOpen = true, 
  onClose, 
  onStartAppointment,
  appointmentId = "A-00002",
  initialTasks = [
    "Voorband rechts voor vervangen",
    "APK-Keuring", 
    "Motor olie verversen"
  ],
  initialMechanic = "Edward robinson"
}) => {
  const [startTime, setStartTime] = useState('10:00');
  const [expectedEndTime, setExpectedEndTime] = useState('10:00');
  const [bridgeNumber, setBridgeNumber] = useState('1');
  const [mechanic, setMechanic] = useState(initialMechanic);
  const [notes, setNotes] = useState('Afspraak is voor de king of pranks');

  const handleStartAppointment = () => {
    const appointmentData = {
      appointmentId,
      startTime,
      expectedEndTime,
      bridgeNumber,
      mechanic,
      notes,
      tasks: initialTasks
    };
    
    if (onStartAppointment) {
      onStartAppointment(appointmentData);
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="overlay-backdrop">
      <div className="overlay-content">
        {/* Header */}
        <div className="overlay-header">
          <div className="overlay-title-section">
            <h2 className="overlay-title">Afspraak starten</h2>
            <p className="overlay-subtitle">Afspraak ID: {appointmentId}</p>
          </div>
          <button className="overlay-close-btn" onClick={handleClose}>
            ✕
          </button>
        </div>

        {/* Main Content */}
        <div className="overlay-main-content">
          {/* Tasks Section */}
          <div className="overlay-section">
            <h3 className="overlay-section-title">Taken</h3>
            <div className="overlay-tasks-list">
              {initialTasks.map((task, index) => (
                <div key={index} className="overlay-task-item">
                  {task}
                </div>
              ))}
            </div>
          </div>

          {/* Time and Mechanic Section */}
          <div className="overlay-form-grid">
            {/* Time Inputs */}
            <div className="overlay-time-section">
              <div className="overlay-time-field">
                <label className="overlay-field-label">Start tijd</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="overlay-time-input"
                />
              </div>
              <div className="overlay-time-field">
                <label className="overlay-field-label">Verwachte eind tijd</label>
                <input
                  type="time"
                  value={expectedEndTime}
                  onChange={(e) => setExpectedEndTime(e.target.value)}
                  className="overlay-time-input"
                />
              </div>
            </div>

            {/* Bridge and Mechanic */}
            <div className="overlay-bridge-mechanic-section">
              <div className="overlay-bridge-field">
                <label className="overlay-field-label">Brug</label>
                <input
                  type="text"
                  value={bridgeNumber}
                  onChange={(e) => setBridgeNumber(e.target.value)}
                  className="overlay-bridge-input"
                />
              </div>
              <div className="overlay-mechanic-field">
                <label className="overlay-field-label">Monteur</label>
                <input
                  type="text"
                  value={mechanic}
                  onChange={(e) => setMechanic(e.target.value)}
                  className="overlay-mechanic-input"
                />
              </div>
            </div>
          </div>

          {/* Notes Section */}
          <div className="overlay-section">
            <label className="overlay-field-label">Afspraak notatie</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="overlay-notes-textarea"
              rows={4}
              placeholder="Voeg notities toe..."
            />
          </div>

          {/* Action Button */}
          <div className="overlay-actions">
            <button 
              className="overlay-start-btn"
              onClick={handleStartAppointment}
            >
              Afspraak starten
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Demo component to show how to use the overlay
const AppointmentStartDemo = () => {
  const [isOverlayOpen, setIsOverlayOpen] = useState(true);

  const handleStartAppointment = (appointmentData) => {
    console.log('Starting appointment with data:', appointmentData);
    setIsOverlayOpen(false);
    // Here you would typically send the data to your API
  };

  const handleCloseOverlay = () => {
    setIsOverlayOpen(false);
  };

  const handleOpenOverlay = () => {
    setIsOverlayOpen(true);
  };

  return (
    <div style={{ padding: '20px' }}>
      <button onClick={handleOpenOverlay}>Open Appointment Start Overlay</button>
      
      <StartAppointment
        isOpen={isOverlayOpen}
        onClose={handleCloseOverlay}
        onStartAppointment={handleStartAppointment}
      />
    </div>
  );
};

export default AppointmentStartDemo;