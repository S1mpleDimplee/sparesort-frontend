
import React, { useState } from 'react';
import './Dashboard.css';
import * as icons from '../../Icons/Icons';

const ManagerDashboard = () => {
  const [filters, setFilters] = useState({
    priceFrom: '0.00€',
    priceTo: '0.00€',
    rating: 5,
    bedrooms: 1
  });

  const statsData = {
    vandaag: {
      title: 'Vandaag',
      description: 'Vandaag zijn 10/15 lodges geboekt',
      icon: icons.dashboardHouse
    },
    morgen: {
      title: 'Morgen',
      description: 'Morgen zijn 10/15 lodges geboekt',
      icon: icons.dashboardCalendar
    },
    werkzaam: {
      title: 'Werkzaam heden',
      mainText: 'Momenteel zijn er 1 lodge(s) in onderhoud',
      subText: 'Er zijn er 1 lodge(s) gepland voor onderhoud',
      icon: icons.dashboardMainenance
    }
  };

  const lodgesData = [
    {
      id: 1,
      name: 'Tropical beach resort lodge',
      price: 525,
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&q=80',
      features: {
        wifi: true,
        sauna: true,
        priveZwembad: true,
        slaapkamers: 3
      },
      description: 'Meer informatie over de lodge? Klik op de knop'
    },
    {
      id: 2,
      name: 'Sunny Bay Treat',
      price: 491,
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&q=80',
      features: {
        wifi: true,
        priveZwembad: true,
        slaapkamers: 3
      },
      description: 'Meer informatie over de lodge? Klik op de knop'
    },
    {
      id: 3,
      name: 'Near Cliff Lodge',
      price: 229,
      image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=400&q=80',
      features: {
        wifi: true,
        slaapkamers: 1
      },
      description: 'Meer informatie over de lodge? Klik op de knop'
    }
  ];

  return (
    <div className="manager-dash-page">
      {/* Stats Section */}
      <div className="manager-dash-stats-section">
        <div className="manager-dash-stat-card">
          <div className="manager-dash-stat-header fade-in-from-up">
            <h3>{statsData.vandaag.title}</h3>
          </div>
          <div className="manager-dash-stat-content">
            <div className="manager-dash-stat-icon">
              <div className="manager-dash-icon-circle">
                <img className="manager-dash-icon-symbol" src={statsData.vandaag.icon} alt="House Icon" />
              </div>
            </div>
            <div className="manager-dash-stat-info">
              <p className="manager-dash-stat-description">{statsData.vandaag.description}</p>
            </div>
          </div>
          <div className="manager-dash-stat-footer">
            <span className="manager-dash-timezone">West-Europe Bali</span>
          </div>
        </div>

        <div className="manager-dash-stat-card">
          <div className="manager-dash-stat-header">
            <h3>{statsData.morgen.title}</h3>
          </div>
          <div className="manager-dash-stat-content">
            <div className="manager-dash-stat-icon">
              <div className="manager-dash-icon-circle">
                <img className="manager-dash-icon-symbol" src={statsData.morgen.icon} alt="Calendar Icon" />
              </div>
            </div>
            <div className="manager-dash-stat-info">
              <p className="manager-dash-stat-description">{statsData.morgen.description}</p>
            </div>
          </div>
          <div className="manager-dash-stat-footer">
            <span className="manager-dash-timezone">West-Europe Bali</span>
          </div>
        </div>

        <div className="manager-dash-stat-card">
          <div className="manager-dash-stat-header">
            <h3>{statsData.werkzaam.title}</h3>
          </div>
          <div className="manager-dash-stat-content">
            <div className="manager-dash-stat-icon">
              <div className="manager-dash-icon-circle">
                <img className="manager-dash-icon-symbol" src={statsData.werkzaam.icon} alt="Maintenance Icon" />
              </div>
            </div>
            <div className="manager-dash-stat-info">
              <p className="manager-dash-stat-main">{statsData.werkzaam.mainText}</p>
              <p className="manager-dash-stat-sub">{statsData.werkzaam.subText}</p>
            </div>
          </div>
          <div className="manager-dash-stat-footer">
            <span className="manager-dash-timezone">West-Europe Bali</span>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="manager-dash-filter-section">
        <div className="manager-dash-filter-bar">
          <div className="manager-dash-filter-group">
            <label>Van</label>
            <input
              type="text"
              value={filters.priceFrom}
              className="manager-dash-filter-input"
              placeholder="0.00€"
              onChange={(e) => setFilters({...filters, priceFrom: e.target.value})}
            />
          </div>

          <div className="manager-dash-filter-group">
            <label>Tot</label>
            <input
              type="text"
              value={filters.priceTo}
              className="manager-dash-filter-input"
              placeholder="0.00€"
              onChange={(e) => setFilters({...filters, priceTo: e.target.value})}
            />
          </div>

          <div className="manager-dash-filter-group manager-dash-filter-rating">
            <div className="manager-dash-rating-display">
              <span className="manager-dash-stars">★★★★★</span>
              <span className="manager-dash-dropdown-arrow">▼</span>
            </div>
          </div>

          <div className="manager-dash-filter-group">
            <label>Slaapkamers</label>
            <div className="manager-dash-bedrooms-badge">
              <span className="manager-dash-bedroom-number">{filters.bedrooms}</span>
            </div>
          </div>

          <button className="manager-dash-filter-button">Filteren</button>
        </div>
      </div>

      {/* Lodges Section */}
      <div className="manager-dash-lodges-section">
        <h2 className="manager-dash-section-title">Ontdek onze luxe lodges</h2>

        <div className="manager-dash-lodges-list">
          {lodgesData.map((lodge) => (
            <div key={lodge.id} className="manager-dash-lodge-card">
              <div className="manager-dash-lodge-image-wrapper">
                <img src={lodge.image} alt={lodge.name} className="manager-dash-lodge-image" />
              </div>

              <div className="manager-dash-lodge-info">
                <div className="manager-dash-lodge-header">
                  <h3 className="manager-dash-lodge-name">{lodge.name}</h3>
                  <div className="manager-dash-lodge-price">
                    <span className="manager-dash-price-amount">€{lodge.price}</span>
                    <span className="manager-dash-price-period">/nacht</span>
                  </div>
                </div>

                <div className="manager-dash-lodge-features">
                  <div className="manager-dash-feature-row">
                    {lodge.features.wifi && (
                      <div className="manager-dash-feature-item">
                        <span className="manager-dash-feature-icon">📶</span>
                        <span className="manager-dash-feature-text">Gratis wifi</span>
                      </div>
                    )}
                    {lodge.features.sauna && (
                      <div className="manager-dash-feature-item">
                        <span className="manager-dash-feature-icon">🧖</span>
                        <span className="manager-dash-feature-text">Sauna</span>
                      </div>
                    )}
                  </div>
                  <div className="manager-dash-feature-row">
                    {lodge.features.priveZwembad && (
                      <div className="manager-dash-feature-item">
                        <span className="manager-dash-feature-icon">🏊</span>
                        <span className="manager-dash-feature-text">Privé zwembad</span>
                      </div>
                    )}
                    <div className="manager-dash-feature-item">
                      <span className="manager-dash-feature-icon">🛏️</span>
                      <span className="manager-dash-feature-text">{lodge.features.slaapkamers} Slaapkamer{lodge.features.slaapkamers !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </div>

                <div className="manager-dash-lodge-footer">
                  <p className="manager-dash-lodge-description">{lodge.description}</p>
                  <button className="manager-dash-update-button">Bijwerken</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;