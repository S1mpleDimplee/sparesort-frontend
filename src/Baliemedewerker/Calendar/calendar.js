import React, { useState, useEffect } from 'react';
import './calendar.css';
import { getISOWeek, startOfISOWeek, setISOWeek, addDays, getISOWeeksInYear, format } from 'date-fns';
import apiCall from '../../../Calls/calls';

const CleaningCalendar = () => {
    const today = new Date();
    const [currentWeek, setCurrentWeek] = useState(getISOWeek(today));
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [schedule, setSchedule] = useState({});
    const [loading, setLoading] = useState(false);

    // Generate the actual date objects for the current week (Monday-Friday)
    const weekDateObjects = Array.from({ length: 5 }, (_, i) => {
        const monday = startOfISOWeek(setISOWeek(new Date(currentYear, 0, 1), currentWeek));
        return addDays(monday, i);
    });

    const weekDays = ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag'];

    // These IDs should match the lodge_id in your database
    const lodges = [
        { id: 1, name: 'Lodge 1' },
        { id: 2, name: 'Lodge 2' },
        { id: 3, name: 'Lodge 3' },
        { id: 4, name: 'Lodge 4' },
        { id: 5, name: 'Lodge 5' },
    ];

    useEffect(() => {
        fetchSchedule();
    }, [currentWeek, currentYear]);

    const fetchSchedule = async () => {
        setLoading(true);
        const response = await apiCall('GetCleaningSchedule', {
            week: currentWeek,
            year: currentYear
        });

        if (response.isSuccess && response.data) {
            const organized = {};
            response.data.forEach(item => {
                // We group by date string (YYYY-MM-DD) and lodge_id
                const dateKey = item.cleaning_date;
                if (!organized[dateKey]) organized[dateKey] = {};
                organized[dateKey][item.lodge_id] = item;
            });
            setSchedule(organized);
        } else {
            setSchedule({});
        }
        setLoading(false);
    };

    const navigateWeek = (dir) => {
        let nextW = dir === 'next' ? currentWeek + 1 : currentWeek - 1;
        let nextY = currentYear;
        const total = getISOWeeksInYear(new Date(currentYear, 0, 1));
        if (nextW > total) { nextW = 1; nextY++; }
        else if (nextW < 1) { nextY--; nextW = getISOWeeksInYear(new Date(nextY, 0, 1)); }
        setCurrentWeek(nextW);
        setCurrentYear(nextY);
    };

    return (
        <div className="rooster-container">
            <div className="schedule-content">
                <div className="week-header">
                    <h2>Schoonmaakrooster</h2>
                    <div className="week-controls">
                        <div className="week-display">Week {currentWeek}, {currentYear}</div>
                        <button className="week-nav-btn" onClick={() => navigateWeek('prev')}>←</button>
                        <button className="week-nav-btn" onClick={() => navigateWeek('next')}>→</button>
                    </div>
                </div>

                <div className="calendar-grid">
                    <div className="calendar-header">
                        <div className="day-header label-cell">Lodge</div>
                        {weekDays.map((day, i) => (
                            <div key={day} className="day-header">
                                <div className="day-name">{day}</div>
                                <div className="day-date">
                                    {weekDateObjects[i].toLocaleDateString('nl-NL', { day: '2-digit', month: 'short' })}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="time-slots-grid">
                        {lodges.map((lodge) => (
                            <div key={lodge.id} className="time-row">
                                <div className="time-slot lodge-label">{lodge.name}</div>
                                {weekDateObjects.map((dateObj) => {
                                    const dateKey = format(dateObj, 'yyyy-MM-dd');
                                    const task = schedule[dateKey]?.[lodge.id];

                                    return (
                                        <div key={`${dateKey}-${lodge.id}`} className="time-slot">
                                            {task ? (
                                                <div className={`appointment-card ${task.status}`}>
                                                    <div className="appointment-patient">Status: {task.status}</div>
                                                    {task.Time && <div className="appointment-time">{task.Time}</div>}
                                                </div>
                                            ) : (
                                                <div className="empty-slot-text">Vrij</div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CleaningCalendar;