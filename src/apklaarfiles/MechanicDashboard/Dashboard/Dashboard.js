import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import postCall from '../../Calls/calls';
import { useToast } from '../../toastmessage/toastmessage';

const MechanicDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [upcomingInspections, setUpcomingInspections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { openToast } = useToast();

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Fetch today's appointments
  const fetchTodayAppointments = async () => {
    try {
      const loggedInData = JSON.parse(localStorage.getItem('loggedInData'));
      if (!loggedInData || !loggedInData.userid) {
        setError('Gebruiker niet ingelogd');
        return;
      }

      const userid = loggedInData.userid;
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

      const response = await postCall('getMechanicAppointments', {
        mechanicId: userid,
        date: today
      });

      if (response.isSuccess && response.data) {
        const transformedAppointments = response.data.map(appt => ({
          id: appt.id || appt.appointmentid,
          time: appt.time,
          customer: appt.customerName || appt.customer || 'Onbekend',
          service: appt.apk ? 'APK-Keuring' : `Reparatie (${appt.duration}h)`,
          licensePlate: appt.licensePlate || appt.kenteken || 'Onbekend',
          status: appt.status || 'upcoming'
        }));
        setTodayAppointments(transformedAppointments);
      } else {
        setTodayAppointments([]);
      }
    } catch (err) {
      console.error('Error fetching today\'s appointments:', err);
      setTodayAppointments([]);
    }
  };

  // Fetch upcoming inspections
  const fetchUpcomingInspections = async () => {
    try {
      const loggedInData = JSON.parse(localStorage.getItem('loggedInData'));
      if (!loggedInData || !loggedInData.userid) {
        return;
      }

      const userid = loggedInData.userid;
      const response = await postCall('getUpcomingInspections', { mechanicId: userid });

      if (response.isSuccess && response.data) {
        const transformedInspections = response.data.map(inspection => ({
          id: inspection.id,
          customer: inspection.vehicleModel || inspection.customer || 'Onbekend voertuig',
          plate: inspection.licensePlate || inspection.kenteken || 'Onbekend',
          date: formatInspectionDate(inspection.date),
          type: inspection.type || 'APK-Keuring'
        }));
        setUpcomingInspections(transformedInspections);
      } else {
        setUpcomingInspections([]);
      }
    } catch (err) {
      console.error('Error fetching upcoming inspections:', err);
      setUpcomingInspections([]);
    }
  };

  // Format inspection date to relative format
  const formatInspectionDate = (dateString) => {
    const inspectionDate = new Date(dateString);
    const today = new Date();
    const diffTime = inspectionDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Vandaag';
    if (diffDays === 1) return 'Morgen';
    if (diffDays <= 7) return `${diffDays} dagen`;
    if (diffDays <= 14) return '1 week';
    return inspectionDate.toLocaleDateString('nl-NL');
  };

  // Load data on component mount
  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        await Promise.all([fetchTodayAppointments(), fetchUpcomingInspections()]);
      } catch (err) {
        setError('Fout bij het laden van dashboard gegevens');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Sample data - would come from props or API
  const dashboardData = {
    appointmentsToday: {
      total: 8,
      completed: 3,
      remaining: 5
    },
    nextAppointment: {
      time: '12:00',
      description: 'Volgende afspraak is om 12:00'
    },
    bridgeStatus: {
      totalBridges: 10,
      occupied: 6,
      available: 4
    },
    todayAppointments: [
      { time: '08:00', customer: 'Jan Bakker', service: 'APK-Keuring', licensePlate: 'AB-123-CD', status: 'completed' },
      { time: '09:30', customer: 'Maria Jansen', service: 'Reparatie', licensePlate: 'EF-456-GH', status: 'completed' },
      { time: '10:45', customer: 'Piet de Vries', service: 'Motor olie', licensePlate: 'IJ-789-KL', status: 'completed' },
      { time: '12:00', customer: 'Anna van Berg', service: 'APK-Keuring', licensePlate: 'MN-012-OP', status: 'upcoming' },
      { time: '13:30', customer: 'Tom Hendriks', service: 'Reparatie', licensePlate: 'QR-345-ST', status: 'upcoming' },
      { time: '15:00', customer: 'Lisa Vermeer', service: 'APK-Keuring', licensePlate: 'UV-678-WX', status: 'upcoming' },
      { time: '16:15', customer: 'Mark Smit', service: 'Onderhoud', licensePlate: 'YZ-901-AB', status: 'upcoming' },
      { time: '17:30', customer: 'Sandra Bos', service: 'APK-Keuring', licensePlate: 'CD-234-EF', status: 'upcoming' }
    ],
    upcomingInspections: [
      { customer: 'BMW 3 Series', plate: 'GH-567-IJ', date: 'Morgen', type: 'APK-Keuring' },
      { customer: 'Audi A4', plate: 'KL-890-MN', date: '3 dagen', type: 'APK-Keuring' },
      { customer: 'Mercedes C-Class', plate: 'OP-123-QR', date: '5 dagen', type: 'APK-Keuring' },
      { customer: 'Volkswagen Golf', plate: 'ST-456-UV', date: '1 week', type: 'APK-Keuring' }
    ],
    workload: {
      hoursWorked: 6.5,
      targetHours: 8,
      efficiency: 81
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('nl-NL', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getNextAppointment = () => {
    const now = new Date();
    const currentTimeStr = formatTime(now);
    
    return dashboardData.todayAppointments.find(apt => 
      apt.time > currentTimeStr && apt.status === 'upcoming'
    );
  };

  const nextAppointment = getNextAppointment();

  return (
    <div className="mechanic-dashboard-container">
      {/* Header */}
      <div className="mechanic-dashboard-header">
        <div className="mechanic-dashboard-breadcrumb">
          <span>Home</span>
          <span className="mechanic-dashboard-separator">/</span>
          <span>Dashboard</span>
        </div>
        
        <div className="mechanic-dashboard-user-info">
          <div className="mechanic-dashboard-user-avatar"></div>
          <span className="mechanic-dashboard-user-name">Edward robinson</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="mechanic-dashboard-main-content">
        {/* Stats Cards */}
        <div className="mechanic-dashboard-stats-grid">
          <div className="mechanic-dashboard-stat-card appointments">
            <div className="mechanic-dashboard-stat-number">{dashboardData.appointmentsToday.total}</div>
            <div className="mechanic-dashboard-stat-label">Afspraken vandaag</div>
            <div className="mechanic-dashboard-stat-progress">
              <div className="mechanic-dashboard-progress-bar">
                <div 
                  className="mechanic-dashboard-progress-fill"
                  style={{ width: `${(dashboardData.appointmentsToday.completed / dashboardData.appointmentsToday.total) * 100}%` }}
                ></div>
              </div>
              <span className="mechanic-dashboard-progress-text">
                {dashboardData.appointmentsToday.completed} van {dashboardData.appointmentsToday.total} afgehandeld
              </span>
            </div>
          </div>
          
          <div className="mechanic-dashboard-stat-card next-appointment">
            <div className="mechanic-dashboard-stat-number">
              {nextAppointment ? nextAppointment.time : '--:--'}
            </div>
            <div className="mechanic-dashboard-stat-label">
              {nextAppointment ? 'Volgende afspraak is om' : 'Geen afspraken meer vandaag'}
            </div>
            {nextAppointment && (
              <div className="mechanic-dashboard-next-appointment-details">
                <div className="mechanic-dashboard-customer">{nextAppointment.customer}</div>
                <div className="mechanic-dashboard-service">{nextAppointment.service} - {nextAppointment.licensePlate}</div>
              </div>
            )}
          </div>
          
          <div className="mechanic-dashboard-stat-card bridges">
            <div className="mechanic-dashboard-stat-number">{dashboardData.bridgeStatus.totalBridges}</div>
            <div className="mechanic-dashboard-stat-label">Bruggen totaal</div>
            <div className="mechanic-dashboard-bridge-status">
              <div className="mechanic-dashboard-bridge-item occupied">
                <span className="mechanic-dashboard-bridge-count">{dashboardData.bridgeStatus.occupied}</span>
                <span className="mechanic-dashboard-bridge-text">Bezet</span>
              </div>
              <div className="mechanic-dashboard-bridge-item available">
                <span className="mechanic-dashboard-bridge-count">{dashboardData.bridgeStatus.available}</span>
                <span className="mechanic-dashboard-bridge-text">Beschikbaar</span>
              </div>
            </div>
          </div>
          
          <div className="mechanic-dashboard-stat-card efficiency">
            <div className="mechanic-dashboard-stat-number">{dashboardData.workload.efficiency}%</div>
            <div className="mechanic-dashboard-stat-label">Efficiency vandaag</div>
            <div className="mechanic-dashboard-workload-details">
              <div className="mechanic-dashboard-hours-worked">
                {dashboardData.workload.hoursWorked}u van {dashboardData.workload.targetHours}u gewerkt
              </div>
              <div className="mechanic-dashboard-current-time">
                Huidige tijd: {formatTime(currentTime)}
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="mechanic-dashboard-content-grid">
          {/* Today's Appointments */}
          <div className="mechanic-dashboard-content-section">
            <h2 className="mechanic-dashboard-section-title">Afspraken vandaag</h2>
            {loading ? (
              <div className="mechanic-dashboard-loading">Afspraaken laden...</div>
            ) : error ? (
              <div className="mechanic-dashboard-error">{error}</div>
            ) : todayAppointments.length === 0 ? (
              <div className="mechanic-dashboard-no-appointments">Geen afspraken vandaag.</div>
            ) : (
              <div className="mechanic-dashboard-appointments-list">
                {todayAppointments.map((appointment) => (
                  <div key={appointment.id} className={`mechanic-dashboard-appointment-item ${appointment.status}`}>
                    <div className="mechanic-dashboard-appointment-time">{appointment.time}</div>
                    <div className="mechanic-dashboard-appointment-details">
                      <div className="mechanic-dashboard-appointment-customer">{appointment.customer}</div>
                      <div className="mechanic-dashboard-appointment-service">
                        {appointment.service} - {appointment.licensePlate}
                      </div>
                    </div>
                    <div className={`mechanic-dashboard-appointment-status ${appointment.status}`}>
                      {appointment.status === 'completed' ? '✓' : '○'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming APK Inspections */}
          <div className="mechanic-dashboard-content-section">
            <h2 className="mechanic-dashboard-section-title">Volgende APK Keuring</h2>
            {loading ? (
              <div className="mechanic-dashboard-loading">APK keuringen laden...</div>
            ) : upcomingInspections.length === 0 ? (
              <div className="mechanic-dashboard-no-inspections">Geen komende APK keuringen.</div>
            ) : (
              <div className="mechanic-dashboard-inspections-list">
                {upcomingInspections.map((inspection) => (
                  <div key={inspection.id} className="mechanic-dashboard-inspection-item">
                    <div className="mechanic-dashboard-inspection-vehicle">
                      <div className="mechanic-dashboard-inspection-name">{inspection.customer}</div>
                      <div className="mechanic-dashboard-inspection-plate">{inspection.plate}</div>
                    </div>
                    <div className="mechanic-dashboard-inspection-date">{inspection.date}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Quick Actions */}
            <div className="mechanic-dashboard-quick-actions">
              <button className="mechanic-dashboard-quick-action-btn">Nieuwe afspraak</button>
              <button className="mechanic-dashboard-quick-action-btn">APK planning</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MechanicDashboard;