import React, { useState, useEffect } from 'react';
import './TimeTable.css';

const ManagerTimeTable = () => {
  const [filters, setFilters] = useState({
    nameFilter: '',
    serviceType: 'alle',
    mechanic: 'alle',
    status: 'alle',
    dateRange: 'deze-week'
  });

  const [weekData, setWeekData] = useState([]);
  const mechanics = ['alle', 'Jan Bakker', 'Piet Smit', 'Maria Jansen', 'Tom van Berg'];
const serviceTypes = ['alle', 'APK-Keuring', 'Reparatie', 'Onderhoud', 'Motor olie'];
const statusOptions = ['alle', 'bezet', 'beschikbaar', 'afgerond', 'geannuleerd'];


  useEffect(() => {
    fetch('http://localhost/apklaarAPI/router/router.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        function: 'getallappointments'
      })
    })
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setWeekData(mapAppointmentsToWeek(json.data));
        }
      })
      .catch(err => console.error(err));
  }, []);


  const mapAppointmentsToWeek = (appointments) => {
    const days = ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag'];

    const week = days.map(day => ({
      day,
      date: '',
      appointments: []
    }));

    appointments.forEach(a => {
      const dateObj = new Date(a.date);
      const dayIndex = dateObj.getDay() - 1; // Monday = 0

      if (dayIndex >= 0 && dayIndex < week.length) {
        week[dayIndex].date = dateObj.toLocaleDateString('nl-NL');

        week[dayIndex].appointments.push({
          id: a.aid,
          type: a.apk ? 'APK-Keuring' : 'Reparatie',
          time: `${a.time} (${a.duration} min)`,
          code: a.apk ?? '',
          vehicle: `${a.firstname} ${a.lastname}`,
          status: a.status,
          mechanic: a.mechanic ?? 'Onbekend'
        });
      }
    });

    return week;
  };

  const handleFilterChange = (filterType, value) => {
  setFilters(prev => ({
    ...prev,
    [filterType]: value
  }));
};


  // Filter appointments based on current filters
  const filteredWeekData = weekData.map(day => ({
    ...day,
    appointments: day.appointments.filter(appointment => {
      const nameMatch = filters.nameFilter === '' || 
        appointment.vehicle.toLowerCase().includes(filters.nameFilter.toLowerCase()) ||
        appointment.code.toLowerCase().includes(filters.nameFilter.toLowerCase());
      
      const serviceMatch = filters.serviceType === 'alle' || 
        appointment.type.includes(filters.serviceType);
      
      const mechanicMatch = filters.mechanic === 'alle' || 
        appointment.mechanic === filters.mechanic;
      
      const statusMatch = filters.status === 'alle' || 
        appointment.status === filters.status;

      return nameMatch && serviceMatch && mechanicMatch && statusMatch;
    })
  }));

  return (
    <div className="manager-appointments-container">
      {/* Header */}
      <div className="manager-appointments-header">
        <div className="manager-appointments-breadcrumb">
          <span>Dashboard</span>
          <span className="manager-appointments-separator">/</span>
          <span>Afspraken</span>
        </div>
        
        <div className="manager-appointments-user-info">
          <div className="manager-appointments-user-avatar"></div>
          <span className="manager-appointments-user-name">Edward robinson</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="manager-appointments-main-content">
        {/* Filters Section */}
        <div className="manager-appointments-filters">
          <div className="manager-appointments-filters-row">
            {/* Name Filter */}
            <div className="manager-appointments-filter-group">
              <label className="manager-appointments-filter-label">Filter op naam</label>
              <input
                type="text"
                placeholder="Zoek op kenteken of voertuig..."
                value={filters.nameFilter}
                onChange={(e) => handleFilterChange('nameFilter', e.target.value)}
                className="manager-appointments-filter-input"
              />
            </div>

            {/* Service Type Filter */}
            <div className="manager-appointments-filter-group">
              <label className="manager-appointments-filter-label">Service type</label>
              <select
                value={filters.serviceType}
                onChange={(e) => handleFilterChange('serviceType', e.target.value)}
                className="manager-appointments-filter-select"
              >
                {serviceTypes.map(type => (
                  <option key={type} value={type}>
                    {type === 'alle' ? 'Alle services' : type}
                  </option>
                ))}
              </select>
            </div>

            {/* Mechanic Filter */}
            <div className="manager-appointments-filter-group">
              <label className="manager-appointments-filter-label">Monteur</label>
              <select
                value={filters.mechanic}
                onChange={(e) => handleFilterChange('mechanic', e.target.value)}
                className="manager-appointments-filter-select"
              >
                {mechanics.map(mechanic => (
                  <option key={mechanic} value={mechanic}>
                    {mechanic === 'alle' ? 'Alle monteurs' : mechanic}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="manager-appointments-filter-group">
              <label className="manager-appointments-filter-label">Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="manager-appointments-filter-select"
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>
                    {status === 'alle' ? 'Alle statussen' : status}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range Filter */}
            <div className="manager-appointments-filter-group">
              <label className="manager-appointments-filter-label">Periode</label>
              <select
                value={filters.dateRange}
                onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                className="manager-appointments-filter-select"
              >
                <option value="deze-week">Deze week</option>
                <option value="volgende-week">Volgende week</option>
                <option value="deze-maand">Deze maand</option>
                <option value="aangepast">Aangepast bereik</option>
              </select>
            </div>

            {/* Clear Filters Button */}
            <div className="manager-appointments-filter-group">
              <button
                onClick={() => setFilters({
                  nameFilter: '',
                  serviceType: 'alle',
                  mechanic: 'alle',
                  status: 'alle',
                  dateRange: 'deze-week'
                })}
                className="manager-appointments-clear-filters"
              >
                Filters wissen
              </button>
            </div>
          </div>
        </div>

        {/* Week View */}
        <div className="manager-appointments-week-grid">
          {filteredWeekData.map((day, dayIndex) => (
            <div key={dayIndex} className="manager-appointments-day-column">
              {/* Day Header */}
              <div className="manager-appointments-day-header">
                <div className="manager-appointments-day-name">{day.day}</div>
                <div className="manager-appointments-day-date">{day.date}</div>
              </div>

              {/* Appointments List */}
              <div className="manager-appointments-day-content">
                {day.appointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className={`manager-appointments-appointment-card ${appointment.type.includes('Reparatie') ? 'repair' : 'apk'}`}
                  >
                    <div className="manager-appointments-appointment-header">
                      <span className="manager-appointments-appointment-type">{appointment.type}</span>
                      <span className="manager-appointments-appointment-time">{appointment.time}</span>
                    </div>
                    
                    <div className="manager-appointments-appointment-status">
                      <span className={`manager-appointments-status-badge ${appointment.status}`}>
                        {appointment.status}
                      </span>
                      <span className="manager-appointments-appointment-code">{appointment.code}</span>
                    </div>
                    
                    <div className="manager-appointments-appointment-vehicle">
                      <div className="manager-appointments-car-icon">🚗</div>
                      <span className="manager-appointments-vehicle-name">{appointment.vehicle}</span>
                    </div>

                    <div className="manager-appointments-appointment-mechanic">
                      Monteur: {appointment.mechanic}
                    </div>
                  </div>
                ))}

                {day.appointments.length === 0 && (
                  <div className="manager-appointments-no-appointments">
                    Geen afspraken
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManagerTimeTable;