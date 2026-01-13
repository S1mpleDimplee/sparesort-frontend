import React, { useState } from 'react';
import './Lodges.css';

const BalieLodges = () => {
  const [filters, setFilters] = useState({
    beschikbaar: true,
    slaapkamers: 1,
    sauna: false,
    priveZwembad: false,
    wifi: false,
    keuken: false
  });

  const statsData = {
    vandaag: {
      title: 'Vandaag',
      description: 'Vandaag zijn 10/15 lodges geboekt',
      icon: '🏠'
    },
    morgen: {
      title: 'Morgen',
      description: 'Morgen zijn 10/15 lodges geboekt',
      icon: '📅'
    },
    werkzaam: {
      title: 'Werkzaam heden',
      mainText: 'Momenteel zijn er 1 lodge(s) in onderhoud',
      subText: 'Er zijn er 1 lodge(s) gepland voor onderhoud',
      icon: '🔧'
    }
  };

  const lodgesData = [
    {
      id: 1,
      name: 'Tropical beach resort lodge',
      price: 525,
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80',
      status: 'beschikbaar',
      features: {
        slaapkamers: 3,
        priveZwembad: true,
        wifi: true
      }
    },
    {
      id: 2,
      name: 'Sunny Bay Treat',
      price: 219,
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80',
      status: 'geboekt',
      features: {
        slaapkamers: 3,
        wifi: true
      }
    },
    {
      id: 3,
      name: 'Bing bang bong lodge',
      price: 301,
      image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600&q=80',
      status: 'onderhoud',
      features: {
        slaapkamers: 3,
        priveZwembad: true,
        wifi: true
      }
    },
    {
      id: 4,
      name: 'Tropical beach resort lodge',
      price: 525,
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80',
      status: 'beschikbaar',
      features: {
        slaapkamers: 3,
        priveZwembad: true,
        wifi: true
      }
    },
    {
      id: 5,
      name: 'Sunny Bay Treat',
      price: 219,
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80',
      status: 'geboekt',
      features: {
        slaapkamers: 3,
        wifi: true
      }
    },
    {
      id: 6,
      name: 'Bing bang bong lodge',
      price: 301,
      image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600&q=80',
      status: 'onderhoud',
      features: {
        slaapkamers: 3,
        priveZwembad: true,
        wifi: true
      }
    }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'beschikbaar': return 'green';
      case 'geboekt': return 'blue';
      case 'onderhoud': return 'red';
      default: return 'gray';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'beschikbaar': return 'Beschikbaar';
      case 'geboekt': return 'Geboekt';
      case 'onderhoud': return 'In onderhoud';
      default: return status;
    }
  };

  const getActionButton = (status) => {
    switch(status) {
      case 'beschikbaar': return { text: 'Boek nu', action: 'book' };
      case 'geboekt': return { text: 'Inzien', action: 'view' };
      case 'onderhoud': return { text: 'Inzien', action: 'view' };
      default: return { text: 'Inzien', action: 'view' };
    }
  };

  return (
    <div className="balie-lodges-page">
      {/* Stats Section */}
      <div className="balie-lodges-stats-section">
        <div className="balie-lodges-stat-card">
          <div className="balie-lodges-stat-header">
            <h3>{statsData.vandaag.title}</h3>
          </div>
          <div className="balie-lodges-stat-content">
            <div className="balie-lodges-stat-icon">
              <div className="balie-lodges-icon-circle">
                <span className="balie-lodges-icon-symbol">{statsData.vandaag.icon}</span>
              </div>
            </div>
            <div className="balie-lodges-stat-info">
              <p className="balie-lodges-stat-description">{statsData.vandaag.description}</p>
            </div>
          </div>
          <div className="balie-lodges-stat-footer">
            <span className="balie-lodges-timezone">West-Europe Bali</span>
          </div>
        </div>

        <div className="balie-lodges-stat-card">
          <div className="balie-lodges-stat-header">
            <h3>{statsData.morgen.title}</h3>
          </div>
          <div className="balie-lodges-stat-content">
            <div className="balie-lodges-stat-icon">
              <div className="balie-lodges-icon-circle">
                <span className="balie-lodges-icon-symbol">{statsData.morgen.icon}</span>
              </div>
            </div>
            <div className="balie-lodges-stat-info">
              <p className="balie-lodges-stat-description">{statsData.morgen.description}</p>
            </div>
          </div>
          <div className="balie-lodges-stat-footer">
            <span className="balie-lodges-timezone">West-Europe Bali</span>
          </div>
        </div>

        <div className="balie-lodges-stat-card">
          <div className="balie-lodges-stat-header">
            <h3>{statsData.werkzaam.title}</h3>
          </div>
          <div className="balie-lodges-stat-content">
            <div className="balie-lodges-stat-icon">
              <div className="balie-lodges-icon-circle">
                <span className="balie-lodges-icon-symbol">{statsData.werkzaam.icon}</span>
              </div>
            </div>
            <div className="balie-lodges-stat-info">
              <p className="balie-lodges-stat-main">{statsData.werkzaam.mainText}</p>
              <p className="balie-lodges-stat-sub">{statsData.werkzaam.subText}</p>
            </div>
          </div>
          <div className="balie-lodges-stat-footer">
            <span className="balie-lodges-timezone">West-Europe Bali</span>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="balie-lodges-filter-section">
        <div className="balie-lodges-filter-group balie-lodges-status-filter">
          <button className={`balie-lodges-status-btn ${filters.beschikbaar ? 'active' : ''}`}>
            ✓ Beschikbaar
          </button>
        </div>

        <div className="balie-lodges-filter-group balie-lodges-bedrooms-filter">
          <span className="balie-lodges-filter-label">Slaapkamers</span>
          <span className="balie-lodges-bedrooms-badge">
            <span className="balie-lodges-bedroom-number">{filters.slaapkamers}</span>
          </span>
        </div>

        <div className="balie-lodges-amenities-filters">
          <div className="balie-lodges-amenity-filter">
            <span className="balie-lodges-amenity-text">Sauna</span>
            <span className="balie-lodges-amenity-check">✓</span>
          </div>

          <div className="balie-lodges-amenity-filter">
            <span className="balie-lodges-amenity-text">Privé zwembad</span>
            <span className="balie-lodges-amenity-check">✓</span>
          </div>

          <div className="balie-lodges-amenity-filter">
            <span className="balie-lodges-amenity-text">Wifi</span>
            <span className="balie-lodges-amenity-check">✓</span>
          </div>

          <div className="balie-lodges-amenity-filter balie-lodges-unchecked">
            <span className="balie-lodges-amenity-text">Keuken</span>
            <span className="balie-lodges-amenity-check">○</span>
          </div>
        </div>
      </div>

      {/* Lodges Grid */}
      <div className="balie-lodges-grid">
        {lodgesData.map((lodge) => (
          <div key={lodge.id} className="balie-lodges-card">
            <div className="balie-lodges-card-image">
              <img src={lodge.image} alt={lodge.name} />
              <div className={`balie-lodges-status-badge balie-lodges-status-${getStatusColor(lodge.status)}`}>
                {getStatusText(lodge.status)}
              </div>
            </div>

            <div className="balie-lodges-card-content">
              <div className="balie-lodges-card-header">
                <h3 className="balie-lodges-card-title">{lodge.name}</h3>
                <div className="balie-lodges-card-price">
                  <span className="balie-lodges-price-amount">€{lodge.price}</span>
                  <span className="balie-lodges-price-period">/ nacht</span>
                </div>
              </div>

              <div className="balie-lodges-card-features">
                <div className="balie-lodges-feature-row">
                  <div className="balie-lodges-feature-item">
                    <span className="balie-lodges-feature-icon">🛏️</span>
                    <span className="balie-lodges-feature-text">{lodge.features.slaapkamers} Slaapkamers</span>
                  </div>
                  {lodge.features.priveZwembad && (
                    <div className="balie-lodges-feature-item">
                      <span className="balie-lodges-feature-icon">🏊</span>
                      <span className="balie-lodges-feature-text">Privé zwembad</span>
                    </div>
                  )}
                </div>

                <div className="balie-lodges-feature-row">
                  {lodge.features.wifi && (
                    <div className="balie-lodges-feature-item">
                      <span className="balie-lodges-feature-icon">📶</span>
                      <span className="balie-lodges-feature-text">Gratis wifi</span>
                    </div>
                  )}
                  <div className="balie-lodges-feature-item">
                    <span className="balie-lodges-feature-icon">🛏️</span>
                    <span className="balie-lodges-feature-text">{lodge.features.slaapkamers} Slaapkamers</span>
                  </div>
                </div>
              </div>

              <div className="balie-lodges-card-actions">
                {lodge.status === 'beschikbaar' && (
                  <button className="balie-lodges-action-btn balie-lodges-secondary-btn">
                    Reparatie
                  </button>
                )}
                <button className={`balie-lodges-action-btn ${lodge.status === 'beschikbaar' ? 'balie-lodges-primary-btn' : 'balie-lodges-view-btn'}`}>
                  {getActionButton(lodge.status).text}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BalieLodges;