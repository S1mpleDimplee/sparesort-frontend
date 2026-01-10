// src/MechanicDashboard/TimeTable/TimeTable.js
import React, { useState, useEffect } from 'react';
import './TimeTable.css';
import {
  getISOWeek,
  startOfISOWeek,
  addDays,
  getISOWeeksInYear,
  format,
  parseISO,
  isSameDay
} from 'date-fns';
import { nl } from 'date-fns/locale';
import postCall from '../../../Calls/calls';

const MechanicTimeTable = () => {
  const today = new Date();
  const [currentWeek, setCurrentWeek] = useState(getISOWeek(today));
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Calculate the Monday of the selected week
  const monday = startOfISOWeek(addDays(new Date(currentYear, 0, 4), (currentWeek - 1) * 7));
  const weekDates = Array.from({ length: 5 }, (_, i) => addDays(monday, i));

  const fetchAppointmentsForWeek = async () => {
    try {
      setLoading(true);
      const loggedInData = JSON.parse(localStorage.getItem('userdata'));
      const response = await postCall('getAppointmentsForWeek', {
        week: currentWeek,
        year: currentYear,
        mechanicId: loggedInData?.userid
      });

      if (response?.isSuccess) {
        const transformed = response.data.map(appt => {
          const repairs = JSON.parse(appt.repairs || '[]');
          const isAPK = repairs.some(r => r.repairationType === 'APK-Keuring');
          return {
            ...appt,
            displayType: isAPK ? 'APK-Keuring' : `Reparatie (${appt.totalLaborTime || 0})`,
            isAPK: isAPK
          };
        });
        setAppointments(transformed);
      }
    } catch (err) {
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointmentsForWeek();
  }, [currentWeek, currentYear]);

  const navigateWeek = (dir) => {
    let newWeek = dir === 'next' ? currentWeek + 1 : currentWeek - 1;
    let newYear = currentYear;
    const totalWeeks = getISOWeeksInYear(new Date(currentYear, 0, 1));

    if (newWeek > totalWeeks) { newWeek = 1; newYear++; }
    if (newWeek < 1) {
      newYear--;
      newWeek = getISOWeeksInYear(new Date(newYear, 0, 1));
    }

    setCurrentWeek(newWeek);
    setCurrentYear(newYear);
  };

  return (
    <div className="planner-container">
      <div className="planner-main-content">

        {/* Date Selector Header */}
        <div className="planner-date-header">
          <div className="planner-date-card">
            <div className="planner-week-label">Week {currentWeek}, {currentYear}</div>
            <div className="planner-nav-group">
              <button className="nav-btn" onClick={() => navigateWeek('prev')}>← Vorige</button>
              <button className="nav-btn" onClick={() => navigateWeek('next')}>Volgende →</button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">Laden...</div>
        ) : (
          weekDates.map((date, idx) => {
            const dayAppointments = appointments.filter(a => isSameDay(parseISO(a.appointmentDate), date));

            return (
              <div key={idx} className="day-section">
                <div className="day-card-header">
                  <div className="day-name">{format(date, 'EEEE', { locale: nl })}</div>
                  <div className="day-full-date">{format(date, 'dd MMM yyyy')}</div>
                </div>

                <div className="appointments-grid">
                  {dayAppointments.length > 0 ? (
                    dayAppointments.map((appt) => (
                      <div key={appt.aid} className={`appt-card ${appt.isAPK ? 'apk-border' : 'repair-border'}`}>
                        <div className="appt-top">
                          <span className="appt-type">{appt.displayType}</span>
                          <span className="appt-time">{appt.appointmentTime.slice(0, 5)} - {appt.endTime || '10:30'}</span>
                        </div>
                        <div className="appt-plate">
                          <span className="plate-icon">XYZ 000</span> {appt.licensePlate || '17-GZ-7B'}
                        </div>
                        <div className="appt-vehicle">
                          <span className="car-icon">🚗</span> {appt.carModel || 'VOLVO'}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-appt">Geen afspraken voor deze dag</div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MechanicTimeTable;