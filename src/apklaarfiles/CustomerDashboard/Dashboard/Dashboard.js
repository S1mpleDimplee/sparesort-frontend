import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import apiCall from '../../Calls/calls';
import { useNavigate } from 'react-router-dom';
import CreateAppointment from '../CreateAppointment/Createappointment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays, faClock } from '@fortawesome/free-regular-svg-icons';
import { useToast } from '../../toastmessage/toastmessage';

const DashboardKlant = () => {
  const [notifications, setNotifications] = useState([{}]);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [lastAPKKeuringData, setLastAPKKeuringData] = useState([]);
  const [upcomingAPKKeuringData, setUpcomingAPKKeuringData] = useState([]);
  const [openInvoices, setOpenInvoices] = useState(0);
  const [appointments, setAppointments] = useState([]);
  const [removeAppointmentVerify, setRemoveAppointmentVerify] = useState(false);

  const navigate = useNavigate();

  const { openToast } = useToast();

  useEffect(() => {
    fetchNotifications();
    fetchDashboardInfo();
  }, []);

  const fetchNotifications = async () => {
    const userid = JSON.parse(localStorage.getItem('userdata')).userid;
    const response = await apiCall('getNotifications', { userid });
    if (response.isSuccess) {
      setNotifications(response.data);
    }
  };

  const cancelAppointment = async (appointmentId, appointmenttime) => {

    const response = await apiCall('cancelAppointment', { appointmentId, appointmenttime });
    if (response.isSuccess) {
      openToast(response.message);
      fetchDashboardInfo();
    } else {
      openToast(response.message);
    }
  };

  const editAppointment = (appointmentId) => {
    // Logic to edit appointment
    console.log(`Edit appointment with ID: ${appointmentId}`);
  }

  const fetchDashboardInfo = async () => {
    const userid = JSON.parse(localStorage.getItem('userdata')).userid;
    const response = await apiCall('fetchcustomerdashboard', { userid });
    if (response.isSuccess) {
      setOpenInvoices(response.data.openInvoices);
      setLastAPKKeuringData([response.data.lastAPKCarDate, response.data.lastAPKCarName]);
      setUpcomingAPKKeuringData([response.data.upcomingAPKCarDate, response.data.upcomingAPKCarName]);

      // Set all appointments at once
      const nextAppointments = response.data.nextAppointments || [];
      setAppointments(nextAppointments);

      console.log(nextAppointments);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="main-content">
        <div className="stats-grid">
          <div className="stat-card blue">
            <h3>Welkom op het dashboard!</h3>
            <p>Hier kunt u uw auto status, afspraken en facturen bekijken. Bij vragen conctacteer ons via apklaar@gmail.com</p>
          </div>

          <div className="stat-card green">
            <h3>Laatste APK Keuring</h3>
            <p>{lastAPKKeuringData[0] != null ? `Uw vorige APK keuring was op ${lastAPKKeuringData[0]} voor uw "${lastAPKKeuringData[1]}"` : "U heeft nog geen vorige APK keuring"}</p>
          </div>

          <div className="stat-card yellow">
            <h3>Volgende APK Keuring</h3>
            <p>{upcomingAPKKeuringData[0] != null ? `Uw volgende APK keuring moet worden gedaan op ${upcomingAPKKeuringData[0]} voor uw "${upcomingAPKKeuringData[1]}"` : "U heeft nog geen volgende APK keuring gepland"}</p>
          </div>

          <div className="stat-card dark-blue">
            <h3>{openInvoices} open factuur(en)</h3>
            <p>Momenteel heeft u {openInvoices} factuur(en) open staan, u kunt open facturen bekijken en betalen via de <a onClick={() => navigate("facturen")} className='dashboard-link'>Facturen</a> pagina.</p>
          </div>
        </div>

        <div className="content-grid">
          <div className="content-section">
            <h2>Meldingen</h2>

            <div className="notification-item">
              {notifications.slice(0, 4).map((notification) => (
                <div key={notification.id} className="dashboard-notification-card">
                  <div className="dashboard-notification-content">
                    <div className="dashboard-notification-title-row">
                      <h3 className="dashboard-notification-title">{notification.title}</h3>
                      <span className="dashboard-notification-timestamp">{notification.date}</span>
                    </div>
                    <p className="dashboard-notification-message">{notification.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="end-of-list">Meeste recente meldingen, <a onClick={() => navigate("berichten")} className='dashboard-link'>Bekijk alle meldingen</a></p>
          </div>

          <div className="content-section">
            <div className="appointments-header">
              <h2>Aankomende Afspraken</h2>
              <span className="plan-apk-text" onClick={() => setShowAppointmentModal(true)}>Afspraak aanmaken</span>
            </div>

            {appointments.length > 0 ? (
              <div className="appointments-scroll-container">

                {appointments.map((appointment) => (
                  <div key={appointment.aid} className="appointment-card">
                    <div className="appointment-header">
                      <h3>{appointment.carNickname}</h3>
                      <span className="appointment-brand">{appointment.brand} {appointment.model}</span>
                    </div>
                    <div className="appointment-details">
                      <div className="appointment-datetime">
                        <FontAwesomeIcon icon={faCalendarDays} />
                        <span>{appointment.appointmentDate}</span>
                      </div>
                      <div className="appointment-datetime">
                        <FontAwesomeIcon icon={faClock} />
                        <span>{appointment.appointmentTime}</span>
                      </div>
                    </div>
                    <div className="appointment-footer">
                      <div>
                        {/* <button className='appointment-edit' onClick={() => editAppointment(appointment.aid)}> Wijzig</button> */}

                        <button className='appointment-cancel' onClick={() => {
                          if (!removeAppointmentVerify) {
                            setRemoveAppointmentVerify(appointment.aid, appointment.appointmenttime);
                            openToast("Klik nogmaals op annuleren om de afspraak te annuleren.");
                          } else if (removeAppointmentVerify === appointment.aid) {
                            cancelAppointment(appointment.aid, appointment.appointmenttime);
                            setRemoveAppointmentVerify(false);
                          }
                        }
                        }>Annuleren</button>
                      </div>
                      <span className="appointment-price">€{appointment.totalGrossPrice}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-content">
                <div>
                  <p>U heeft momenteel geen aankomende afspraken. Maak gemakkelijk en snel een afspraak.</p>
                  <button className="plan-apk-button" onClick={() => setShowAppointmentModal(true)}>Plan nu een afspraak</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {showAppointmentModal && (
        <CreateAppointment
          onClose={() => {
            fetchDashboardInfo();
            setShowAppointmentModal(false);
          }}
        />
      )}
    </div>
  );
};

export default DashboardKlant;