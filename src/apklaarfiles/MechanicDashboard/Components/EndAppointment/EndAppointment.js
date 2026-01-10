import React, { useState } from 'react';
import './EndAppointment.css';

const EndAppointment = ({ 
  isOpen = true, 
  onClose, 
  onCompleteRepair,
  appointmentId = "A-00002",
  completedTasks = [
    "Voorband rechts voor vervangen",
    "APK-Keuring"
  ],
  notCompletedTasks = [
    "Motor olie verversen"
  ],
  costItems = [
    {
      id: 1,
      description: "Voorband ventiel",
      excludingVAT: "€10",
      vatPercentage: "21%",
      total: "€12,10"
    },
    {
      id: 2,
      description: "Werktijd werkenmer (3 UUR)",
      excludingVAT: "€50,12",
      vatPercentage: "21%",
      total: "h65,65"
    }
  ]
}) => {
  const [endTime, setEndTime] = useState('10:00');
  const [startTime] = useState('10:00');
  
  // Calculate totals
  const subtotal = "€50,12";
  const totalAmount = "€65,65";

  const handleCompleteRepair = () => {
    const repairData = {
      appointmentId,
      completedTasks,
      notCompletedTasks,
      costItems,
      startTime,
      endTime,
      subtotal,
      totalAmount
    };
    
    if (onCompleteRepair) {
      onCompleteRepair(repairData);
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="repair-overlay-backdrop">
      <div className="repair-overlay-content">
        {/* Header */}
        <div className="repair-overlay-header">
          <div className="repair-overlay-title-section">
            <h2 className="repair-overlay-title">Reparatie afronden</h2>
            <p className="repair-overlay-subtitle">Afspraak ID: {appointmentId}</p>
          </div>
          <button className="repair-overlay-close-btn" onClick={handleClose}>
            ✕
          </button>
        </div>

        {/* Main Content */}
        <div className="repair-overlay-main-content">
          <div className="repair-overlay-content-grid">
            {/* Left Column - Tasks */}
            <div className="repair-overlay-left-column">
              {/* Completed Tasks */}
              <div className="repair-overlay-section">
                <h3 className="repair-overlay-section-title">Afgeronde taken</h3>
                <div className="repair-overlay-tasks-list">
                  {completedTasks.map((task, index) => (
                    <div key={index} className="repair-overlay-task-item completed">
                      {task}
                    </div>
                  ))}
                </div>
              </div>

              {/* Not Completed Tasks */}
              <div className="repair-overlay-section">
                <h3 className="repair-overlay-section-title">Niet-afgeronde taken</h3>
                <div className="repair-overlay-tasks-list">
                  {notCompletedTasks.map((task, index) => (
                    <div key={index} className="repair-overlay-task-item not-completed">
                      {task}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Costs and Time */}
            <div className="repair-overlay-right-column">
              {/* Costs Section */}
              <div className="repair-overlay-section">
                <div className="repair-overlay-costs-header">
                  <h3 className="repair-overlay-section-title">Kosten</h3>
                  <button className="repair-overlay-add-cost-btn">+</button>
                </div>
                
                <div className="repair-overlay-costs-table">
                  <div className="repair-overlay-costs-table-header">
                    <div className="repair-overlay-table-col">Onderdeel</div>
                    <div className="repair-overlay-table-col">Excl btw.</div>
                    <div className="repair-overlay-table-col">Kosten</div>
                    <div className="repair-overlay-table-col">BTW</div>
                    <div className="repair-overlay-table-col">Totaal</div>
                  </div>
                  
                  {costItems.map((item) => (
                    <div key={item.id} className="repair-overlay-costs-table-row">
                      <div className="repair-overlay-table-col">{item.description}</div>
                      <div className="repair-overlay-table-col">{item.excludingVAT}</div>
                      <div className="repair-overlay-table-col">{item.vatPercentage}</div>
                      <div className="repair-overlay-table-col">{item.total}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Time Section */}
              <div className="repair-overlay-time-section">
                <div className="repair-overlay-time-row">
                  <span className="repair-overlay-time-label">Start tijd</span>
                  <span className="repair-overlay-time-value">{startTime}</span>
                </div>
                <div className="repair-overlay-time-row">
                  <span className="repair-overlay-time-label">Eind tijd</span>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="repair-overlay-time-input"
                  />
                </div>
              </div>

              {/* Totals */}
              <div className="repair-overlay-totals">
                <div className="repair-overlay-total-row">
                  <span className="repair-overlay-total-label">Subtotaal:</span>
                  <span className="repair-overlay-total-value">{subtotal}</span>
                </div>
                <div className="repair-overlay-total-row final">
                  <span className="repair-overlay-total-label">Totaal:</span>
                  <span className="repair-overlay-total-value">{totalAmount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="repair-overlay-actions">
            <button 
              className="repair-overlay-complete-btn"
              onClick={handleCompleteRepair}
            >
              Reparatie afronden
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Demo component to show how to use the overlay
const RepairCompletionDemo = () => {
  const [isOverlayOpen, setIsOverlayOpen] = useState(true);

  const handleCompleteRepair = (repairData) => {
    console.log('Completing repair with data:', repairData);
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
      <button onClick={handleOpenOverlay}>Open Repair Completion Overlay</button>
      
      <EndAppointment
        isOpen={isOverlayOpen}
        onClose={handleCloseOverlay}
        onCompleteRepair={handleCompleteRepair}
      />
    </div>
  );
};

export default RepairCompletionDemo;