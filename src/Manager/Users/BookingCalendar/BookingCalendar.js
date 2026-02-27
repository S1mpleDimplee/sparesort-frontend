
import React, { useState } from 'react';
import './BookingCalendar.css';

const BookingCalendar = ({ 
  onDateClick, 
  bookedDates = [], 
  unavailableDates = [],
  selectedDate = null,
  showSearch = true,
  showRoleFilter = true 
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('');

  // Dutch month names
  const monthNames = [
    'Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni',
    'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'
  ];

  // Get current month and year
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Get first day of month and number of days
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const firstDayWeekday = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  // Get previous month's last days to fill the calendar
  const prevMonth = new Date(currentYear, currentMonth - 1, 0);
  const daysInPrevMonth = prevMonth.getDate();

  // Navigation functions
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  // Check if a date is booked
  const isDateBooked = (date) => {
    return bookedDates.some(bookedDate => 
      bookedDate.getDate() === date && 
      bookedDate.getMonth() === currentMonth && 
      bookedDate.getFullYear() === currentYear
    );
  };

  // Check if a date is unavailable
  const isDateUnavailable = (date) => {
    return unavailableDates.some(unavailableDate => 
      unavailableDate.getDate() === date && 
      unavailableDate.getMonth() === currentMonth && 
      unavailableDate.getFullYear() === currentYear
    );
  };

  // Handle date click
  const handleDateClick = (date, isCurrentMonth = true) => {
    if (isCurrentMonth && onDateClick) {
      const clickedDate = new Date(currentYear, currentMonth, date);
      onDateClick(clickedDate);
    }
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const days = [];

    // Previous month's trailing days
    const trailingDays = firstDayWeekday === 0 ? 6 : firstDayWeekday - 1;
    for (let i = trailingDays; i > 0; i--) {
      const date = daysInPrevMonth - i + 1;
      days.push(
        <div 
          key={`prev-${date}`} 
          className="calendar-day calendar-day-other-month"
        >
          {date}
        </div>
      );
    }

    // Current month days
    for (let date = 1; date <= daysInMonth; date++) {
      const isBooked = isDateBooked(date);
      const isUnavailable = isDateUnavailable(date);
      const isSelected = selectedDate && 
        selectedDate.getDate() === date && 
        selectedDate.getMonth() === currentMonth && 
        selectedDate.getFullYear() === currentYear;

      days.push(
        <div 
          key={`current-${date}`}
          className={`calendar-day calendar-day-current-month ${
            isSelected ? 'calendar-day-selected' : ''
          } ${isBooked ? 'calendar-day-booked' : ''} ${
            isUnavailable ? 'calendar-day-unavailable' : ''
          }`}
          onClick={() => handleDateClick(date, true)}
        >
          <span className="calendar-day-number">{date}</span>
          {isBooked && <span className="booking-status">VOL</span>}
        </div>
      );
    }

    // Next month's leading days to fill the grid
    const remainingDays = 42 - days.length; // 6 rows × 7 days
    for (let date = 1; date <= remainingDays; date++) {
      days.push(
        <div 
          key={`next-${date}`} 
          className="calendar-day calendar-day-other-month"
        >
          {date}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="booking-calendar-container page-enter">
      {/* Header Controls */}
      {(showSearch || showRoleFilter) && (
        <div className="calendar-header-controls fade-in">
          {showSearch && (
            <div className="calendar-search">
              <input
                type="text"
                placeholder="Zoeken..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="calendar-search-input"
              />
            </div>
          )}
          
          {showRoleFilter && (
            <div className="calendar-filters">
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="calendar-role-select"
              >
                <option value="">Role</option>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="staff">Staff</option>
              </select>
              
              <button className="calendar-action-btn">
                Account aanmaken
              </button>
            </div>
          )}
        </div>
      )}

      {/* Calendar */}
      <div className="booking-calendar card-entrance">
        {/* Calendar Header */}
        <div className="calendar-header">
          <button 
            className="calendar-nav-btn hover-scale" 
            onClick={goToPreviousMonth}
            aria-label="Previous month"
          >
            ‹
          </button>
          
          <h2 className="calendar-month-title">
            {monthNames[currentMonth]} {currentYear}
          </h2>
          
          <button 
            className="calendar-nav-btn hover-scale" 
            onClick={goToNextMonth}
            aria-label="Next month"
          >
            ›
          </button>
        </div>

        {/* Days of week header */}
        <div className="calendar-weekdays">
          {['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'].map((day, index) => (
            <div key={index} className="calendar-weekday">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="calendar-grid slide-up">
          {generateCalendarDays()}
        </div>
      </div>
    </div>
  );
};

export default BookingCalendar;