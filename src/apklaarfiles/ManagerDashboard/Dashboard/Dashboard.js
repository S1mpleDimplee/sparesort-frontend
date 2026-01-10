import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const ManagerDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);

  // Sample dashboard data for manager
  const dashboardData = {
    appointmentsToday: {
      total: 21,
      completed: 3,
      remaining: 18
    },
    mechanicsPresent: {
      total: 7,
      description: 'Monteurs aanwezig in de garage'
    },
    websiteCustomers: {
      total: 428,
      description: 'Huidige klanten aangemeld op de website'
    },
    apkSuccessRate: {
      percentage: 89,
      description: 'APK Slagingspercentage'
    },
    todayOverview: [
      { mechanic: 'Jan Bakker', appointments: 4, completed: 2, status: 'Bezig met APK-keuring', bridge: '1' },
      { mechanic: 'Piet Smit', appointments: 3, completed: 1, status: 'Reparatie BMW', bridge: '2' },
      { mechanic: 'Maria Jansen', appointments: 2, completed: 0, status: 'Pauze (terug 14:30)', bridge: '-' },
      { mechanic: 'Tom van Berg', appointments: 3, completed: 0, status: 'Start om 13:00', bridge: '3' },
      { mechanic: 'Lisa Vermeer', appointments: 4, completed: 0, status: 'Bezig met onderhoud', bridge: '4' },
      { mechanic: 'Mark de Vries', appointments: 3, completed: 0, status: 'APK-keuring Audi', bridge: '5' },
      { mechanic: 'Sandra Bos', appointments: 2, completed: 0, status: 'Beschikbaar', bridge: '6' }
    ],
    revenueToday: {
      amount: '€2,847',
      target: '€3,200',
      percentage: 89
    },
    upcomingIssues: [
      { type: 'Onderdeel tekort', item: 'Remblokken Toyota', urgency: 'high', eta: 'Morgen 10:00' },
      { type: 'Afspraak conflict', item: 'Dubbele boeking brug 3', urgency: 'medium', eta: '15:30 vandaag' },
      { type: 'Klant wacht', item: 'APK vertraging 45 min', urgency: 'low', eta: 'Contact opgenomen' },
      { type: 'Maintenance', item: 'Brug 2 kalibratie', urgency: 'medium', eta: 'Volgende week' }
    ],
    bridgeStatus: [
      { id: 1, status: 'occupied', mechanic: 'Jan Bakker', task: 'APK Toyota', timeLeft: '15 min' },
      { id: 2, status: 'occupied', mechanic: 'Piet Smit', task: 'Reparatie BMW', timeLeft: '45 min' },
      { id: 3, status: 'maintenance', mechanic: '-', task: 'Onderhoud gepland', timeLeft: '2u' },
      { id: 4, status: 'occupied', mechanic: 'Lisa Vermeer', task: 'Onderhoud VW', timeLeft: '30 min' },
      { id: 5, status: 'occupied', mechanic: 'Mark de Vries', task: 'APK Audi', timeLeft: '20 min' },
      { id: 6, status: 'available', mechanic: 'Sandra Bos', task: 'Beschikbaar', timeLeft: '-' }
    ]
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('nl-NL', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getUrgencyColor = (urgency) => {
    switch(urgency) {
      case 'high': return '#f44336';
      case 'medium': return '#ff9800';
      case 'low': return '#4caf50';
      default: return '#666';
    }
  };

  return (
    <div className="manager-dashboard-container">
      {/* Header */}
      <div className="manager-dashboard-header">
        <div className="manager-dashboard-breadcrumb">
          <span>Home</span>
          <span className="manager-dashboard-separator">/</span>
          <span>Dashboard</span>
        </div>
        
        <div className="manager-dashboard-user-info">
          <div className="manager-dashboard-user-avatar"></div>
          <span className="manager-dashboard-user-name">Edward robinson</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="manager-dashboard-main-content">
        {/* Stats Cards */}
        <div className="manager-dashboard-stats-grid">
          <div className="manager-dashboard-stat-card appointments">
            <div className="manager-dashboard-stat-number">{dashboardData.appointmentsToday.total}</div>
            <div className="manager-dashboard-stat-label">Afspraken vandaag</div>
            <div className="manager-dashboard-stat-progress">
              <div className="manager-dashboard-progress-bar">
                <div 
                  className="manager-dashboard-progress-fill"
                  style={{ width: `${(dashboardData.appointmentsToday.completed / dashboardData.appointmentsToday.total) * 100}%` }}
                ></div>
              </div>
              <span className="manager-dashboard-progress-text">
                {dashboardData.appointmentsToday.completed} van {dashboardData.appointmentsToday.total} afgehandeld
              </span>
            </div>
          </div>
          
          <div className="manager-dashboard-stat-card mechanics">
            <div className="manager-dashboard-stat-number">{dashboardData.mechanicsPresent.total}</div>
            <div className="manager-dashboard-stat-label">Monteurs aanwezig</div>
            <div className="manager-dashboard-stat-subtitle">in de garage</div>
          </div>
          
          <div className="manager-dashboard-stat-card customers">
            <div className="manager-dashboard-stat-number">{dashboardData.websiteCustomers.total}</div>
            <div className="manager-dashboard-stat-label">Huidige klanten</div>
            <div className="manager-dashboard-stat-subtitle">aangemeld op de website</div>
          </div>
          
          <div className="manager-dashboard-stat-card success-rate">
            <div className="manager-dashboard-stat-number">{dashboardData.apkSuccessRate.percentage}%</div>
            <div className="manager-dashboard-stat-label">APK</div>
            <div className="manager-dashboard-stat-subtitle">Slagingspercentage</div>
          </div>
        </div>

        {/* Additional Manager Stats */}
        <div className="manager-dashboard-additional-stats">
          <div className="manager-dashboard-revenue-card">
            <div className="manager-dashboard-revenue-info">
              <span className="manager-dashboard-revenue-label">Omzet vandaag</span>
              <span className="manager-dashboard-revenue-amount">{dashboardData.revenueToday.amount}</span>
              <span className="manager-dashboard-revenue-target">Doel: {dashboardData.revenueToday.target}</span>
            </div>
            <div className="manager-dashboard-revenue-progress">
              <div 
                className="manager-dashboard-revenue-progress-fill"
                style={{ width: `${dashboardData.revenueToday.percentage}%` }}
              ></div>
            </div>
          </div>
          
          <div className="manager-dashboard-time-card">
            <span className="manager-dashboard-time-label">Huidige tijd</span>
            <span className="manager-dashboard-time-value">{formatTime(currentTime)}</span>
          </div>
        </div>

        {/* Content Grid */}
        <div className="manager-dashboard-content-grid">
          {/* Today's Staff Overview */}
          <div className="manager-dashboard-content-section">
            <h2 className="manager-dashboard-section-title">Afspraken vandaag</h2>
            <div className="manager-dashboard-staff-list">
              {dashboardData.todayOverview.map((staff, index) => (
                <div key={index} className="manager-dashboard-staff-item">
                  <div className="manager-dashboard-staff-info">
                    <div className="manager-dashboard-staff-name">{staff.mechanic}</div>
                    <div className="manager-dashboard-staff-appointments">
                      {staff.completed}/{staff.appointments} afspraken
                    </div>
                    <div className="manager-dashboard-staff-status">{staff.status}</div>
                  </div>
                  <div className="manager-dashboard-staff-bridge">
                    Brug {staff.bridge}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bridge Status & Issues */}
          <div className="manager-dashboard-content-section">
            <h2 className="manager-dashboard-section-title">Brug Status & Aandachtspunten</h2>
            
            {/* Bridge Status */}
            <div className="manager-dashboard-bridges-section">
              <h3 className="manager-dashboard-subsection-title">Bruggen overzicht</h3>
              <div className="manager-dashboard-bridges-grid">
                {dashboardData.bridgeStatus.map((bridge) => (
                  <div key={bridge.id} className={`manager-dashboard-bridge-item ${bridge.status}`}>
                    <div className="manager-dashboard-bridge-number">Brug {bridge.id}</div>
                    <div className="manager-dashboard-bridge-info">
                      <div className="manager-dashboard-bridge-task">{bridge.task}</div>
                      {bridge.mechanic !== '-' && (
                        <div className="manager-dashboard-bridge-mechanic">{bridge.mechanic}</div>
                      )}
                      <div className="manager-dashboard-bridge-time">{bridge.timeLeft}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Issues */}
            <div className="manager-dashboard-issues-section">
              <h3 className="manager-dashboard-subsection-title">Aandachtspunten</h3>
              <div className="manager-dashboard-issues-list">
                {dashboardData.upcomingIssues.map((issue, index) => (
                  <div key={index} className="manager-dashboard-issue-item">
                    <div 
                      className="manager-dashboard-issue-indicator"
                      style={{ backgroundColor: getUrgencyColor(issue.urgency) }}
                    ></div>
                    <div className="manager-dashboard-issue-content">
                      <div className="manager-dashboard-issue-type">{issue.type}</div>
                      <div className="manager-dashboard-issue-description">{issue.item}</div>
                      <div className="manager-dashboard-issue-eta">{issue.eta}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;