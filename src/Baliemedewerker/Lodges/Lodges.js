import React, { useState, useEffect } from 'react';
import './Lodges.css';
import apiCall from '../../Calls/calls';

const BalieLodges = () => {
  const [lodgesData, setLodgesData] = useState([]);
  const [repairStats, setRepairStats] = useState({ active: 0, planned: 0 });
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    beschikbaar: true,
    slaapkamers: 1,
    sauna: false,
    priveZwembad: false,
    wifi: false,
    keuken: false
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const lodgeResponse = await apiCall('GetAllLodges', {});
        if (lodgeResponse.isSuccess && lodgeResponse.data) {
          const mapped = lodgeResponse.data.map(lodge => ({
            id: lodge.id,
            name: lodge.name,
            description: lodge.description,
            price: lodge.price,
            status: lodge.status || 'beschikbaar',
            image: lodge.image,
            features: {
              slaapkamers: lodge.bedrooms,
              personen: lodge.people
            }
          }));
          setLodgesData(mapped);
        }

        const repairResponse = await apiCall('GetAllRepairs', {});
        if (repairResponse.isSuccess && repairResponse.data) {
          const repairs = repairResponse.data;
          
          const active = repairs.filter(r => r.status === 'bevestigd').length;
          const planned = repairs.filter(r => r.status === 'gepland').length;
          
          setRepairStats({ active, planned });
        }

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'beschikbaar': return 'green';
      case 'geboekt': return 'blue';
      case 'onderhoud': return 'red';
      default: return 'gray';
    }
  };

  const getStatusText = (status) => {
    switch(status?.toLowerCase()) {
      case 'beschikbaar': return 'Beschikbaar';
      case 'geboekt': return 'Geboekt';
      case 'onderhoud': return 'In onderhoud';
      default: return status;
    }
  };

  const getActionButton = (status) => {
    switch(status?.toLowerCase()) {
      case 'beschikbaar': return { text: 'Boek nu', action: 'book' };
      default: return { text: 'Inzien', action: 'view' };
    }
  };

  if (loading) return <div className="balie-lodges-page" style={{color: 'white'}}>Loading data...</div>;

  return (
    <div className="balie-lodges-page">
      <div className="balie-lodges-stats-section">
        <div className="balie-lodges-stat-card">
          <div className="balie-lodges-stat-header"><h3>Vandaag</h3></div>
          <div className="balie-lodges-stat-content">
            <div className="balie-lodges-stat-icon"><div className="balie-lodges-icon-circle"><span className="balie-lodges-icon-symbol">🏠</span></div></div>
            <div className="balie-lodges-stat-info"><p className="balie-lodges-stat-description">Vandaag zijn 10/15 lodges geboekt</p></div>
          </div>
          <div className="balie-lodges-stat-footer"><span className="balie-lodges-timezone">West-Europe Bali</span></div>
        </div>
        
        <div className="balie-lodges-stat-card">
          <div className="balie-lodges-stat-header"><h3>Morgen</h3></div>
          <div className="balie-lodges-stat-content">
            <div className="balie-lodges-stat-icon"><div className="balie-lodges-icon-circle"><span className="balie-lodges-icon-symbol">📅</span></div></div>
            <div className="balie-lodges-stat-info"><p className="balie-lodges-stat-description">Morgen zijn 10/15 lodges geboekt</p></div>
          </div>
          <div className="balie-lodges-stat-footer"><span className="balie-lodges-timezone">West-Europe Bali</span></div>
        </div>

        {/* Repair Card */}
        <div className="balie-lodges-stat-card">
          <div className="balie-lodges-stat-header"><h3>Werkzaam heden</h3></div>
          <div className="balie-lodges-stat-content">
            <div className="balie-lodges-stat-icon"><div className="balie-lodges-icon-circle"><span className="balie-lodges-icon-symbol">🔧</span></div></div>
            <div className="balie-lodges-stat-info">
              <p className="balie-lodges-stat-main">Momenteel zijn er {repairStats.active} lodge(s) in onderhoud</p>
              <p className="balie-lodges-stat-sub">Er zijn er {repairStats.planned} lodge(s) gepland voor onderhoud</p>
            </div>
          </div>
          <div className="balie-lodges-stat-footer"><span className="balie-lodges-timezone">West-Europe Bali</span></div>
        </div>
      </div>

      <div className="balie-lodges-filter-section">
        <div className="balie-lodges-filter-group balie-lodges-status-filter">
          <button className={`balie-lodges-status-btn ${filters.beschikbaar ? 'active' : ''}`}>✓ Beschikbaar</button>
        </div>
        <div className="balie-lodges-filter-group balie-lodges-bedrooms-filter">
          <span className="balie-lodges-filter-label">Slaapkamers</span>
          <span className="balie-lodges-bedrooms-badge"><span className="balie-lodges-bedroom-number">{filters.slaapkamers}</span></span>
        </div>
        <div className="balie-lodges-amenities-filters">
          <div className="balie-lodges-amenity-filter"><span className="balie-lodges-amenity-text">Sauna</span><span className="balie-lodges-amenity-check">✓</span></div>
          <div className="balie-lodges-amenity-filter"><span className="balie-lodges-amenity-text">Privé zwembad</span><span className="balie-lodges-amenity-check">✓</span></div>
          <div className="balie-lodges-amenity-filter"><span className="balie-lodges-amenity-text">Wifi</span><span className="balie-lodges-amenity-check">✓</span></div>
          <div className="balie-lodges-amenity-filter balie-lodges-unchecked"><span className="balie-lodges-amenity-text">Keuken</span><span className="balie-lodges-amenity-check">○</span></div>
        </div>
      </div>

      <div className="balie-lodges-grid">
        {lodgesData.map((lodge) => (
          <div key={lodge.id} className="balie-lodges-card">
            <div className="balie-lodges-card-image">
              <img src={lodge.image.startsWith('data:') ? lodge.image : `data:image/jpeg;base64,${lodge.image}`} alt={lodge.name} />
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
                  <div className="balie-lodges-feature-item">
                    <span className="balie-lodges-feature-icon">👥</span>
                    <span className="balie-lodges-feature-text">{lodge.features.personen} Personen</span>
                  </div>
                </div>
              </div>

              <div className="balie-lodges-card-actions">
                {lodge.status === 'beschikbaar' && (
                  <button className="balie-lodges-action-btn balie-lodges-secondary-btn">Reparatie</button>
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