import React, { useState } from 'react';
import './Home.css';

const Home = () => {
  const [filters, setFilters] = useState({
    priceFrom: '0.00€',
    priceTo: '0.00€',
    rating: 5,
    bedrooms: 1
  });

  const lodgeData = [
    {
      id: 1,
      name: "Tropical beach resort lodge",
      price: 521,
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
      rating: 5,
      features: {
        wifi: true,
        pool: true,
        bedrooms: 3
      },
      description: "Meer informatie over de lodge? Klik op de knop"
    },
    {
      id: 2,
      name: "Tropical beach resort lodge",
      price: 521,
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
      rating: 5,
      features: {
        wifi: true,
        pool: true,
        bedrooms: 3
      },
      description: "Meer informatie over de lodge? Klik op de knop"
    },
    {
      id: 3,
      name: "Tropical beach resort lodge",
      price: 521,
      image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&q=80",
      rating: 5,
      features: {
        wifi: true,
        pool: true,
        bedrooms: 3
      },
      description: "Meer informatie over de lodge? Klik op de knop"
    }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay">
          <div className="hero-content">
            <h1 className="hero-title">Vind jou droom lodge</h1>
            <p className="hero-subtitle">Kies uit een van onze 15 luxe lodges in de wonders van bali</p>

            {/* Filter Bar */}
            <div className="filter-bar">
              <div className="filter-group">
                <label>Van</label>
                <input
                  type="text"
                  value={filters.priceFrom}
                  className="filter-input"
                  placeholder="0.00€"
                />
              </div>

              <div className="filter-group">
                <label>Tot</label>
                <input
                  type="text"
                  value={filters.priceTo}
                  className="filter-input"
                  placeholder="0.00€"
                />
              </div>

              <div className="filter-group filter-rating">
                <div className="rating-display">
                  <span className="stars">★★★★★</span>
                  <span className="dropdown-arrow">▼</span>
                </div>
              </div>

              <div className="filter-group">
                <label>Slaapkamers</label>
                <div className="bedrooms-badge">
                  <span className="bedroom-icon">ℹ️</span>
                  <span>{filters.bedrooms}</span>
                </div>
              </div>

              <button className="filter-button">Filteren</button>
            </div>
          </div>
        </div>
      </section>

      {/* Lodges Section */}
      <section className="lodges-section">
        <div className="container">
          <h2 className="section-title">Ontdek onze luxe lodges</h2>

          <div className="lodges-grid">
            {lodgeData.map((lodge) => (
              <div key={lodge.id} className="lodge-card">
                <div className="lodge-image-wrapper">
                  <img src={lodge.image} alt={lodge.name} className="lodge-image" />
                </div>

                <div className="lodge-info">
                  <div className="lodge-header">
                    <h3 className="lodge-name">{lodge.name}</h3>
                    <div className="lodge-price">
                      <span className="price-amount">€{lodge.price}</span>
                      <span className="price-period">/nacht</span>
                    </div>
                  </div>

                  <div className="lodge-features">
                    <div className="feature-item">
                      <span className="feature-icon">📶</span>
                      <span className="feature-text">Gratis wifi</span>
                    </div>
                    <div className="feature-item">
                      <span className="feature-icon">⭐</span>
                      <span className="feature-text">Gratis wifi</span>
                    </div>
                  </div>

                  <div className="lodge-features">
                    <div className="feature-item">
                      <span className="feature-icon">🏊</span>
                      <span className="feature-text">Privé zwembad</span>
                    </div>
                    <div className="feature-item">
                      <span className="feature-icon">🛏️</span>
                      <span className="feature-text">{lodge.features.bedrooms} slaapkamers</span>
                    </div>
                  </div>

                  <div className="lodge-footer">
                    <p className="lodge-description">{lodge.description}</p>
                    <button className="book-button">Boek nu</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;