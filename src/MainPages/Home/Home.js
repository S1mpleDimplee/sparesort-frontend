import React, { useEffect, useMemo, useState } from "react";
import "./Home.css";

const API_ROUTER_URL = "http://localhost/sparesort-api/router/router.php";

const parsePrice = (value) => {
  if (value === null || value === undefined) return NaN;
  const s = String(value)
    .replace(/\s/g, "")
    .replace("€", "")
    .replace(/eur/i, "")
    .replace(",", ".");
  const num = Number(s);
  return Number.isFinite(num) ? num : NaN;
};

const Home = () => {
  // editable inputs
  const [filters, setFilters] = useState({
    priceFrom: "",
    priceTo: "",
    bedrooms: 1,
  });

  // only applied when clicking "Filteren"
  const [applied, setApplied] = useState({
    priceFrom: "",
    priceTo: "",
    bedrooms: 1,
  });

  const [lodges, setLodges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadLodges = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(API_ROUTER_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          // You don't need cookies for getalllodges; removing avoids CORS pain.
          // If your backend requires session cookies, add back: credentials: "include",
          body: JSON.stringify({ function: "getalllodges", data: {} }),
        });

        const json = await res.json();

        if (!json.success) throw new Error(json.message || "Kon lodges niet ophalen");
        setLodges(Array.isArray(json.data) ? json.data : []);
      } catch (e) {
        setError(e?.message || "Onbekende fout");
      } finally {
        setLoading(false);
      }
    };

    loadLodges();
  }, []);

 const filteredLodges = useMemo(() => {
  const min = parsePrice(applied.priceFrom);
  const max = parsePrice(applied.priceTo);
  const minBedrooms = Number(applied.bedrooms) || 1;

  return lodges.filter((l) => {
    // ✅ Only available lodges
    if (Number(l.visable) !== 1) return false;
    if (String(l.status || "").toLowerCase() !== "beschikbaar") return false;

    // Bedrooms
    const lodgeBedrooms = Number(l.bedrooms) || 0;
    if (lodgeBedrooms < minBedrooms) return false;

    // Price (only if parseable)
    const lodgePrice = parsePrice(l.price);
    if (Number.isFinite(lodgePrice)) {
      if (applied.priceFrom !== "" && Number.isFinite(min) && lodgePrice < min) return false;
      if (applied.priceTo !== "" && Number.isFinite(max) && lodgePrice > max) return false;
    }

    return true;
  });
}, [lodges, applied]);

  const onChange = (key) => (e) => {
    setFilters((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const decBedrooms = () => {
    setFilters((prev) => ({
      ...prev,
      bedrooms: Math.max(1, Number(prev.bedrooms || 1) - 1),
    }));
  };

  const incBedrooms = () => {
    setFilters((prev) => ({
      ...prev,
      bedrooms: Math.min(20, Number(prev.bedrooms || 1) + 1),
    }));
  };

  const applyFilters = () => {
    setApplied({
      priceFrom: filters.priceFrom,
      priceTo: filters.priceTo,
      bedrooms: Number(filters.bedrooms) || 1,
    });
  };

  const resetFilters = () => {
    const cleared = { priceFrom: "", priceTo: "", bedrooms: 1 };
    setFilters(cleared);
    setApplied(cleared);
  };

  return (
    <div className="home-page">
      <section className="hero-section fade-slide">
        <div className="hero-overlay">
          <div className="hero-content">
            <h1 className="hero-title fade-in">Vind jou droom lodge</h1>
            <p className="hero-subtitle fade-in">
              Kies uit een van onze 15 luxe lodges in de wonders van bali
            </p>

            <div className="filter-bar fade-in">
              <div className="filter-group">
                <label>Van (€)</label>
                <input
                  type="number"
                  inputMode="decimal"
                  value={filters.priceFrom}
                  onChange={onChange("priceFrom")}
                  className="filter-input"
                  placeholder="0"
                  min="0"
                />
              </div>

              <div className="filter-group">
                <label>Tot (€)</label>
                <input
                  type="number"
                  inputMode="decimal"
                  value={filters.priceTo}
                  onChange={onChange("priceTo")}
                  className="filter-input"
                  placeholder="9999"
                  min="0"
                />
              </div>

              {/* rating UI stays, but doesn't affect filtering */}
              <div className="filter-group filter-rating">
                <div className="rating-display" title="Rating filter komt later">
                  <span className="stars">★★★★★</span>
                  <span className="dropdown-arrow">▼</span>
                </div>
              </div>

              <div className="filter-group">
                <label>Slaapkamers</label>
                <div className="bedrooms-badge" style={{ justifyContent: "space-between" }}>
                  <button
                    type="button"
                    onClick={decBedrooms}
                    style={{ border: "none", background: "transparent", cursor: "pointer" }}
                    aria-label="Minder slaapkamers"
                  >
                    −
                  </button>
                  <span style={{ minWidth: 24, textAlign: "center" }}>{filters.bedrooms}</span>
                  <button
                    type="button"
                    onClick={incBedrooms}
                    style={{ border: "none", background: "transparent", cursor: "pointer" }}
                    aria-label="Meer slaapkamers"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="filter-group" style={{ flexDirection: "row", gap: "0.75rem" }}>
                <button type="button" className="filter-button" onClick={applyFilters}>
                  Filteren
                </button>

                <button
                  type="button"
                  onClick={resetFilters}
                  style={{
                    padding: "0.75rem 1.25rem",
                    borderRadius: 6,
                    border: "1px solid #ddd",
                    background: "transparent",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="lodges-section">
        <div className="container">
          <h2 className="section-title fade-slide-up">Ontdek onze luxe lodges</h2>

          {loading && <p>Loading...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}

          {!loading && !error && (
            <p style={{ color: "var(--text)" }}>
              Resultaten: <strong>{filteredLodges.length}</strong>
            </p>
          )}

          <div className="lodges-grid">
            {filteredLodges.map((lodge) => (
              <div key={lodge.id} className="lodge-card slide-up">
                <div className="lodge-image-wrapper">
                  <img
                    src={lodge.image || "https://via.placeholder.com/800x600"}
                    alt={lodge.name}
                    className="lodge-image"
                  />
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
                      <span className="feature-icon">🛏️</span>
                      <span className="feature-text">{lodge.bedrooms} slaapkamers</span>
                    </div>
                    <div className="feature-item">
                      <span className="feature-icon">👥</span>
                      <span className="feature-text">{lodge.people} personen</span>
                    </div>
                  </div>

                  <div className="lodge-footer">
                    <p className="lodge-description">
                      {lodge.description || "Meer informatie over de lodge? Klik op de knop"}
                    </p>
                    <button className="book-button">Boek nu</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {!loading && !error && filteredLodges.length === 0 && (
            <p>Geen lodges gevonden met deze filters.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;