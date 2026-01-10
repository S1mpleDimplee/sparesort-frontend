import React, { useEffect, useState } from 'react';
import './Notifications.css';
import apiCall from '../../../Calls/calls';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays } from '@fortawesome/free-regular-svg-icons';
import { faCalendarDay } from '@fortawesome/free-solid-svg-icons';

const CustomerNotifications = () => {

  useEffect(() => {

    const fetchNotifications = async () => {
      const userid = JSON.parse(localStorage.getItem('userdata')).userid;

      const response = await apiCall('getNotifications', { userid });
      if (response.isSuccess) {
        setNotifications(response.data);
      }
    };

    fetchNotifications();

  }, []);

  const [notifications, setNotifications] = useState([{
  }
  ]);

  return (
    <div className="notifications-main-content">
      <div className="notifications-content-area">
        <div className="notifications-list">
          {notifications.map((notification) => (
            <div key={notification.id} className="notification-card">
              <div className="notification-content">
                <div className="notification-title-row">
                  <h3 className="notification-title">{notification.title}</h3>
                  <span className="notification-timestamp"><FontAwesomeIcon icon={faCalendarDay} /> {notification.date}</span>
                </div>
                <p className="notification-message">{notification.description}</p>
              </div>
            </div>
          ))}
          <p className='end-of-list'>Einde van de lijst</p>
        </div>
      </div>
    </div>
  );
};

export default CustomerNotifications;