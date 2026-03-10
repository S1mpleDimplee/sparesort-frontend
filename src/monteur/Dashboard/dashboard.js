import React, { useState, useEffect } from "react";
import "./dashboard.css";
import ProgressBar from "../../HouseStyle/ProgressBar/ProgressBar";
import * as Icons from "../../Icons/Icons";

const MonteurDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    reparationsToday: 3,
    completedToday: 1,
    totalReparations: 8,
    completedReparations: 3,
    urgentRepairs: 2,
    scheduledRepairs: 5
  });

  const [repairTasks, setRepairTasks] = useState([
    {
      id: 1,
      title: "Gebroken monitor",
      description: "Tropisch beach resort lodge",
      lodge: "Lodge 15",
      status: "Ingepland",
      priority: "Hoog",
      statusColor: "green",
      checkIn: "2026-03-15",
      checkOut: "2026-03-16",
      assignedTo: "Johan Bakker",
      estimatedTime: "2 uur"
    },
    {
      id: 2,
      title: "Defecte airconditioning",
      description: "Tropisch beach resort lodge",
      lodge: "Lodge 7",
      status: "In behandeling",
      priority: "Urgent",
      statusColor: "orange",
      checkIn: "2026-03-17",
      checkOut: "2026-03-18",
      assignedTo: "Marc Peters",
      estimatedTime: "4 uur"
    },
    {
      id: 3,
      title: "Lekkage badkamer",
      description: "Tropisch beach resort lodge",
      lodge: "Lodge 23",
      status: "Niet ingepland",
      priority: "Gemiddeld",
      statusColor: "red",
      checkIn: "2026-03-19",
      checkOut: "2026-03-20",
      assignedTo: "Niet toegewezen",
      estimatedTime: "3 uur"
    },
    {
      id: 4,
      title: "WiFi probleem",
      description: "Tropisch beach resort lodge",
      lodge: "Lodge 12",
      status: "Voltooid",
      priority: "Laag",
      statusColor: "completed",
      checkIn: "2026-03-14",
      checkOut: "2026-03-15",
      assignedTo: "Johan Bakker",
      estimatedTime: "1 uur"
    }
  ]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleStatusChange = (taskId, newStatus) => {
    setRepairTasks(prev => 
      prev.map(task => 
        task.id === taskId 
          ? { 
              ...task, 
              status: newStatus,
              statusColor: newStatus === "Voltooid" ? "completed" : 
                           newStatus === "In behandeling" ? "orange" :
                           newStatus === "Ingepland" ? "green" : "red"
            }
          : task
      )
    );
  };

  const formatCurrency = (amount) => {
    return `€${amount.toFixed(2)}`;
  };

  if (isLoading) {
    return (
      <div className="monteur-dashboard">
        <div className="dashboard-loading">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="monteur-dashboard page-enter">
      {/* Stats Cards Row */}
      <div className="dashboard-stats-row">
        <div className="stat-card card-entrance hover-glow">
          <div className="stat-icon">
            <img src={Icons.managerWrench || "🔧"} alt="Reparaties vandaag" width="32" height="32" />
          </div>
          <div className="stat-content">
            <div className="stat-value scale-in">{dashboardData.reparationsToday}</div>
            <div className="stat-label">Reparaties vandaag</div>
            <ProgressBar
              value={dashboardData.completedToday}
              max={dashboardData.reparationsToday}
              height="10px"
              color={"#4caf50"}
              secondColor={"#81c784"}
            />
            <div className="stat-sublabel">
              Voltooid: <span className="stat-highlight">{dashboardData.completedToday}</span>
            </div>
          </div>
        </div>

        <div className="stat-card card-entrance-delayed hover-glow">
          <div className="stat-icon stat-icon-green">
            <img src={Icons.managerCalendar || "✅"} alt="Voltooide reparaties" width="32" height="32" />
          </div>
          <div className="stat-content">
            <div className="stat-value scale-in-bounce">{dashboardData.completedReparations}</div>
            <div className="stat-label">Voltooide reparaties</div>
            <ProgressBar
              value={dashboardData.completedReparations}
              max={dashboardData.totalReparations}
              height="10px"
              color={"#4caf50"}
              secondColor={"#81c784"}
            />
            <div className="stat-sublabel">
              Van totaal {dashboardData.totalReparations} reparaties
            </div>
          </div>
        </div>

        <div className="stat-card card-entrance-delayed hover-glow" style={{ animationDelay: "0.4s" }}>
          <div className="stat-icon stat-icon-orange shimmer">
            <img src={Icons.managerUser || "⚠️"} alt="Urgent" width="32" height="32" />
          </div>
          <div className="stat-content">
            <div className="stat-value scale-in">{dashboardData.urgentRepairs}</div>
            <div className="stat-label">Urgente reparaties</div>
            <ProgressBar
              value={dashboardData.urgentRepairs}
              max={dashboardData.scheduledRepairs}
              height="10px"
              color={"#ff9800"}
              secondColor={"#ffb74d"}
            />
            <div className="stat-sublabel">
              Van {dashboardData.scheduledRepairs} <span className="stat-highlight-orange">geplande taken</span>
            </div>
          </div>
        </div>

        <div className="stat-card card-entrance-delayed hover-glow" style={{ animationDelay: "0.6s" }}>
          <div className="stat-icon stat-icon-currency pulse">
            <img src={Icons.managerEuro || "📊"} alt="Prestaties" width="32" height="32" />
          </div>
          <div className="stat-content">
            <div className="stat-value scale-in-bounce">87%</div>
            <div className="stat-label">Prestatie score</div>
            <div className="stat-sublabel stat-revenue">
              <span className="revenue-icon">📈</span>
              <span>Deze maand</span>
              <span className="revenue-amount">+5%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Repairs Section */}
      <div className="dashboard-bar-chart hover-glow">
        <h3 className="chart-section-title fade-in-delayed">Reparatie Overzicht</h3>
        
        <div className="repairs-list">
          {repairTasks.map((task, index) => (
            <div 
              key={task.id} 
              className="booking-item slide-up"
              style={{ animationDelay: `${0.2 + index * 0.1}s` }}
            >
              <div className={`booking-avatar ${task.statusColor === 'completed' ? 'completed' : 
                                              task.statusColor === 'green' ? 'scheduled' :
                                              task.statusColor === 'orange' ? 'in-progress' : 'pending'}`}>
                {task.lodge.split(' ')[1]}
              </div>
              
              <div className="booking-details">
                <div className="booking-name">{task.title}</div>
                <div className="booking-status">{task.description} - {task.lodge}</div>
                <div className="repair-meta">
                  <span className="meta-item">
                    <strong>Prioriteit:</strong> {task.priority}
                  </span>
                  <span className="meta-item">
                    <strong>Toegewezen aan:</strong> {task.assignedTo}
                  </span>
                  <span className="meta-item">
                    <strong>Geschatte tijd:</strong> {task.estimatedTime}
                  </span>
                </div>
              </div>

              <div className="repair-actions">
                <div className={`repair-status-badge status-${task.statusColor}`}>
                  {task.status}
                </div>
                <div className="booking-date">
                  Check-in: {new Date(task.checkIn).toLocaleDateString('nl-NL')}
                </div>
                {task.status !== "Voltooid" && (
                  <div className="repair-buttons">
                    <button 
                      className="action-btn btn-primary"
                      onClick={() => handleStatusChange(task.id, "In behandeling")}
                    >
                      Start Reparatie
                    </button>
                    {task.status === "In behandeling" && (
                      <button 
                        className="action-btn btn-success"
                        onClick={() => handleStatusChange(task.id, "Voltooid")}
                      >
                        Voltooi
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="repairs-footer">
          <div className="repairs-summary">
            <div className="summary-item">
              <span className="summary-label">Totaal reparaties:</span>
              <span className="summary-value">{repairTasks.length}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Voltooid:</span>
              <span className="summary-value completed">{repairTasks.filter(task => task.status === "Voltooid").length}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">In behandeling:</span>
              <span className="summary-value in-progress">{repairTasks.filter(task => task.status === "In behandeling").length}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Te doen:</span>
              <span className="summary-value pending">{repairTasks.filter(task => task.status === "Niet ingepland").length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonteurDashboard;