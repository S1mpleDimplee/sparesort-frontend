import React, { useState } from "react";
import "./Dashboard.css";

const BalieDashboard = () => {
  const [searchFilters, setSearchFilters] = useState({
    naam: "",
    checkIn: "1/12/2006",
    checkOut: "1/12/2006",
    lodge: "Tropical beach resort lodge",
  });

  const todayCheckIns = [
    {
      name: "Stefan brookhuis",
      lodge: "Tropical beach resort lodge",
      checkIn: "12/1/2026",
      checkOut: "12/1/2026",
      time: "10:06",
      status: "ingechecked",
    },
    {
      name: "Stefan brookhuis",
      lodge: "Tropical beach resort lodge",
      checkIn: "12/1/2026",
      checkOut: "12/1/2026",
      time: "10:06",
      status: "niet ingechecked",
    },
    {
      name: "Stefan brookhuis",
      lodge: "Tropical beach resort lodge",
      checkIn: "12/1/2026",
      checkOut: "12/1/2026",
      time: "10:06",
      status: "niet ingechecked",
    },
  ];

  const todayCheckOuts = [
    {
      name: "Stefan brookhuis",
      lodge: "Tropical beach resort lodge",
      checkIn: "12/1/2026",
      checkOut: "12/1/2026",
      time: "10:06",
      status: "ingechecked",
    },
    {
      name: "Stefan brookhuis",
      lodge: "Tropical beach resort lodge",
      checkIn: "12/1/2026",
      checkOut: "12/1/2026",
      time: "10:06",
      status: "niet ingechecked",
    },
    {
      name: "Stefan brookhuis",
      lodge: "Tropical beach resort lodge",
      checkIn: "12/1/2026",
      checkOut: "12/1/2026",
      time: "10:06",
      status: "niet ingechecked",
    },
  ];

  const bookingDetails = {
    name: "Stefan brookhuis",
    lodge: "Tropical beach resort lodge",
    checkIn: "12/1/2026",
    checkOut: "12/1/2026",
    time: "10:06",
    bedrooms: 3,
    pool: true,
    wifi: true,
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&q=80",
  };

  return (
    <div className="balie-dash-dashboard-page">
      {/* Stats Cards */}
      <div className="balie-dash-stats-section">
        <div className="balie-dash-stat-card balie-dash-time-card">
          <div className="balie-dash-stat-header">
            <h3>Actuele tijd</h3>
          </div>
          <div className="balie-dash-stat-content">
            <div className="balie-dash-clock-icon">
              <div className="balie-dash-clock-circle">
                <span className="balie-dash-clock-symbol">🕐</span>
              </div>
            </div>
            <div className="balie-dash-time-info">
              <div className="balie-dash-date">12/1/2026</div>
              <div className="balie-dash-time">10:06</div>
            </div>
          </div>
          <div className="balie-dash-stat-footer">
            <span className="balie-dash-timezone">West-Europe Bali</span>
          </div>
        </div>

        <div className="balie-dash-stat-card">
          <div className="balie-dash-stat-header">
            <h3>Check-ins</h3>
          </div>
          <div className="balie-dash-stat-content">
            <div className="balie-dash-stat-icon">
              <div className="balie-dash-icon-circle">
                <span className="balie-dash-arrow-icon">→</span>
              </div>
            </div>
            <div className="balie-dash-stat-info">
              <div className="balie-dash-stat-number">
                10 van de 15 Check-ins zijn gedaan
              </div>
              <div className="balie-dash-stat-description">
                Momenteel zijn er 2 Check-ins telaat
              </div>
            </div>
          </div>
          <div className="balie-dash-stat-footer">
            <span className="balie-dash-timezone">West-Europe Bali</span>
          </div>
        </div>

        <div className="balie-dash-stat-card">
          <div className="balie-dash-stat-header">
            <h3>Check-outs</h3>
          </div>
          <div className="balie-dash-stat-content">
            <div className="balie-dash-stat-icon">
              <div className="balie-dash-icon-circle">
                <span className="balie-dash-arrow-icon">←</span>
              </div>
            </div>
            <div className="balie-dash-stat-info">
              <div className="balie-dash-stat-number">
                10 van de 15 Check-outs zijn gedaan
              </div>
              <div className="balie-dash-stat-description">
                Momenteel zijn er 2 Check-outs telaat
              </div>
            </div>
          </div>
          <div className="balie-dash-stat-footer">
            <span className="balie-dash-timezone">West-Europe Bali</span>
          </div>
        </div>
      </div>

      {/* Check-ins and Check-outs Lists */}
      <div className="balie-dash-lists-section">
        <div className="balie-dash-check-list">
          <div className="balie-dash-list-header">
            <div className="balie-dash-list-icon">📋</div>
            <h3>Check-ins vandaag</h3>
          </div>

          {todayCheckIns.map((item, index) => (
            <div key={index} className="balie-dash-check-item">
              <div className="balie-dash-check-info">
                <h4 className="balie-dash-guest-name">{item.name}</h4>
                <p className="balie-dash-lodge-name">{item.lodge}</p>
                <div className="balie-dash-check-details">
                  <span className="balie-dash-check-label">Check-in:</span>
                  <span className="balie-dash-check-date">{item.checkIn}</span>
                  <span className="balie-dash-check-time">{item.time}</span>
                  <span className="balie-dash-check-label">Check-out:</span>
                  <span className="balie-dash-check-date">{item.checkOut}</span>
                  <span className="balie-dash-check-time">{item.time}</span>
                </div>
              </div>
              <div className="balie-dash-check-actions">
                <span
                  className={`balie-dash-status-badge ${
                    item.status === "ingechecked"
                      ? "balie-dash-checked-in"
                      : "balie-dash-not-checked"
                  }`}
                >
                  {item.status}
                </span>
                <button className="balie-dash-action-btn balie-dash-inzien-btn">
                  Inzien
                </button>
                <button className="balie-dash-action-btn balie-dash-checkin-btn">
                  Check-in
                </button>
              </div>
            </div>
          ))}

          <div className="balie-dash-list-footer">
            <button className="balie-dash-view-all-btn">
              Eind van de lijst
            </button>
          </div>
        </div>

        <div className="balie-dash-check-list">
          <div className="balie-dash-list-header">
            <div className="balie-dash-list-icon">📋</div>
            <h3>Check-outs vandaag</h3>
          </div>

          {todayCheckOuts.map((item, index) => (
            <div key={index} className="balie-dash-check-item">
              <div className="balie-dash-check-info">
                <h4 className="balie-dash-guest-name">{item.name}</h4>
                <p className="balie-dash-lodge-name">{item.lodge}</p>
                <div className="balie-dash-check-details">
                  <span className="balie-dash-check-label">Check-in:</span>
                  <span className="balie-dash-check-date">{item.checkIn}</span>
                  <span className="balie-dash-check-time">{item.time}</span>
                  <span className="balie-dash-check-label">Check-out:</span>
                  <span className="balie-dash-check-date">{item.checkOut}</span>
                  <span className="balie-dash-check-time">{item.time}</span>
                </div>
              </div>
              <div className="balie-dash-check-actions">
                <span
                  className={`balie-dash-status-badge ${
                    item.status === "ingechecked"
                      ? "balie-dash-checked-in"
                      : "balie-dash-not-checked"
                  }`}
                >
                  {item.status}
                </span>
                <button className="balie-dash-action-btn balie-dash-inzien-btn">
                  Inzien
                </button>
                <button className="balie-dash-action-btn balie-dash-checkin-btn">
                  Check-in
                </button>
              </div>
            </div>
          ))}

          <div className="balie-dash-list-footer">
            <button className="balie-dash-view-all-btn">
              Eind van de lijst
            </button>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="balie-dash-search-section">
        <div className="balie-dash-search-filters">
          <div className="balie-dash-filter-group">
            <label>Naam boeker</label>
            <input
              type="text"
              className="balie-dash-search-input"
              value={searchFilters.naam}
              onChange={(e) =>
                setSearchFilters({ ...searchFilters, naam: e.target.value })
              }
            />
          </div>

          <div className="balie-dash-filter-group">
            <label>In</label>
            <div className="balie-dash-date-input-wrapper">
              <span className="balie-dash-calendar-icon">📅</span>
              <input
                type="text"
                className="balie-dash-search-input balie-dash-date-input"
                value={searchFilters.checkIn}
                onChange={(e) =>
                  setSearchFilters({
                    ...searchFilters,
                    checkIn: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className="balie-dash-filter-group">
            <label>Uit</label>
            <div className="balie-dash-date-input-wrapper">
              <span className="balie-dash-calendar-icon">📅</span>
              <input
                type="text"
                className="balie-dash-search-input balie-dash-date-input"
                value={searchFilters.checkOut}
                onChange={(e) =>
                  setSearchFilters({
                    ...searchFilters,
                    checkOut: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className="balie-dash-filter-group balie-dash-lodge-filter">
            <label>Lodge</label>
            <input
              type="text"
              className="balie-dash-search-input balie-dash-lodge-input"
              value={searchFilters.lodge}
              onChange={(e) =>
                setSearchFilters({ ...searchFilters, lodge: e.target.value })
              }
            />
          </div>
        </div>
      </div>

      {/* Booking Search Results */}
      <div className="balie-dash-booking-section">
        <div className="balie-dash-section-header">
          <h3>Boekingen zoeken</h3>
        </div>

        <div className="balie-dash-booking-result">
          <div className="balie-dash-booking-image">
            <img src={bookingDetails.image} alt={bookingDetails.lodge} />
          </div>

          <div className="balie-dash-booking-info">
            <h4 className="balie-dash-booking-guest-name">
              {bookingDetails.name}
            </h4>
            <p className="balie-dash-booking-lodge-name">
              {bookingDetails.lodge}
            </p>

            <div className="balie-dash-booking-features">
              <div className="balie-dash-feature-item">
                <span className="balie-dash-feature-icon">🛏️</span>
                <span className="balie-dash-feature-text">
                  {bookingDetails.bedrooms} Slaapkamers
                </span>
              </div>
              <div className="balie-dash-feature-item">
                <span className="balie-dash-feature-icon">🏊</span>
                <span className="balie-dash-feature-text">Privé zwembad</span>
              </div>
              <div className="balie-dash-feature-item">
                <span className="balie-dash-feature-icon">📶</span>
                <span className="balie-dash-feature-text">Gratis wifi</span>
              </div>
              <div className="balie-dash-feature-item">
                <span className="balie-dash-feature-icon">🛏️</span>
                <span className="balie-dash-feature-text">
                  {bookingDetails.bedrooms} slaapkamers
                </span>
              </div>
            </div>
          </div>

          <div className="balie-dash-booking-dates">
            <div className="balie-dash-date-section">
              <h5>Check-in</h5>
              <p className="balie-dash-date-value">{bookingDetails.checkIn}</p>
              <p className="balie-dash-time-value">{bookingDetails.time}</p>
            </div>
            <div className="balie-dash-date-section">
              <h5>Check-out</h5>
              <p className="balie-dash-date-value">{bookingDetails.checkOut}</p>
              <p className="balie-dash-time-value">{bookingDetails.time}</p>
            </div>
          </div>

          <div className="balie-dash-booking-actions">
            <button className="balie-dash-action-btn balie-dash-inzien-btn">
              Inzien
            </button>
            <button className="balie-dash-action-btn balie-dash-checkin-btn">
              Check-in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalieDashboard;
