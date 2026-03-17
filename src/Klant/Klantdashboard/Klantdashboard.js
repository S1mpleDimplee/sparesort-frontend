import React, { useEffect, useMemo, useState } from "react";
import "./Klantdashboard.css";

const API_ROUTER_URL = "http://localhost/sparesort-api/router/router.php";

const parsePrice = (value) => {
  if (value === null || value === undefined) return NaN;
  const s = String(value).replace(/\s/g, "").replace("€", "").replace(",", ".");
  const num = Number(s);
  return Number.isFinite(num) ? num : NaN;
};
console.log("userdata:", JSON.parse(localStorage.getItem("userdata")));
const KlantDashboard = () => {
  const [lodges, setLodges] = useState([]);
  const [lodgeTypes, setLodgeTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedLodge, setSelectedLodge] = useState(null);   // detail modal
  const [bookingLodge, setBookingLodge] = useState(null);     // booking modal
  const [activeType, setActiveType] = useState(null);

  // Booking form state
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Get logged in user from localStorage
  const userData = JSON.parse(localStorage.getItem("userdata") || "{}");
  const userName = userData?.name ?? "Onbekend";
  const userId = userData?.userid ?? null;

  const [filters, setFilters] = useState({
    search: "", priceFrom: "", priceTo: "", people: "", bedrooms: "",
  });
  const [applied, setApplied] = useState({
    search: "", priceFrom: "", priceTo: "", people: "", bedrooms: "",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [lodgeRes, typeRes] = await Promise.all([
          fetch(API_ROUTER_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ function: "getalllodges", data: {} }),
          }),
          fetch(API_ROUTER_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ function: "getlodgetypes", data: {} }),
          }),
        ]);
        const lodgeJson = await lodgeRes.json();
        const typeJson = await typeRes.json();
        if (!lodgeJson.success) throw new Error(lodgeJson.message || "Kon lodges niet ophalen");
        setLodges(Array.isArray(lodgeJson.data) ? lodgeJson.data : []);
        setLodgeTypes(Array.isArray(typeJson.data) ? typeJson.data : []);
      } catch (e) {
        setError(e?.message || "Onbekende fout");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Calculate nights and total price
  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const diff = (new Date(checkOut) - new Date(checkIn)) / 86400000;
    return diff > 0 ? diff : 0;
  }, [checkIn, checkOut]);

  const totalPrice = useMemo(() => {
    if (!bookingLodge || nights <= 0) return 0;
    return nights * parsePrice(bookingLodge.price);
  }, [bookingLodge, nights]);

  const openBookingModal = (lodge) => {
    setBookingLodge(lodge);
    setSelectedLodge(null); // close detail modal if open
    setCheckIn("");
    setCheckOut("");
    setBookingError("");
    setBookingSuccess(false);
  };

  const closeBookingModal = () => {
    setBookingLodge(null);
    setCheckIn("");
    setCheckOut("");
    setBookingError("");
    setBookingSuccess(false);
  };

  const submitBooking = async () => {
    setBookingError("");

    if (!checkIn || !checkOut) {
      setBookingError("Vul check-in en check-out datum in.");
      return;
    }
    if (nights <= 0) {
      setBookingError("Check-out moet na check-in zijn.");
      return;
    }
    if (!userId) {
      setBookingError("Je bent niet ingelogd.");
      return;
    }

    try {
      setBookingLoading(true);
      const res = await fetch(API_ROUTER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          function: "createbooking",
          data: {
            user_id: userId,
            lodge_id: bookingLodge.id,
            check_in: checkIn,
            check_out: checkOut,
          },
        }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Boeking mislukt");
      setBookingSuccess(true);
    } catch (e) {
      setBookingError(e?.message || "Er is een fout opgetreden");
    } finally {
      setBookingLoading(false);
    }
  };

  const filteredLodges = useMemo(() => {
    const min = parsePrice(applied.priceFrom);
    const max = parsePrice(applied.priceTo);
    const minPeople = Number(applied.people) || 0;
    const minBedrooms = Number(applied.bedrooms) || 0;

    return lodges.filter((l) => {
      if (Number(l.visable) !== 1) return false;
      if (String(l.status || "").toLowerCase() !== "beschikbaar") return false;
      if (applied.search && !l.name?.toLowerCase().includes(applied.search.toLowerCase())) return false;
      if (minPeople > 0 && Number(l.people) < minPeople) return false;
      if (minBedrooms > 0 && Number(l.bedrooms) < minBedrooms) return false;
      if (activeType !== null && Number(l.lodge_type_id) !== Number(activeType)) return false;
      const price = parsePrice(l.price);
      if (Number.isFinite(price)) {
        if (applied.priceFrom !== "" && Number.isFinite(min) && price < min) return false;
        if (applied.priceTo !== "" && Number.isFinite(max) && price > max) return false;
      }
      return true;
    });
  }, [lodges, applied, activeType]);

  const applyFilters = () => setApplied({ ...filters });
  const resetFilters = () => {
    const cleared = { search: "", priceFrom: "", priceTo: "", people: "", bedrooms: "" };
    setFilters(cleared);
    setApplied(cleared);
    setActiveType(null);
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="klant-page">

      {/* ── Detail Modal ── */}
      {selectedLodge && (
        <div className="klant-modal-overlay" onClick={() => setSelectedLodge(null)}>
          <div className="klant-modal" onClick={(e) => e.stopPropagation()}>
            <div className="klant-modal-header">
              <h2>{selectedLodge.name}</h2>
              <button className="klant-modal-close" onClick={() => setSelectedLodge(null)}>✕</button>
            </div>
            <div className="klant-modal-body">
              {selectedLodge.image && (
                <img
                  src={`data:image/jpeg;base64,${selectedLodge.image}`}
                  alt={selectedLodge.name}
                  className="klant-modal-img"
                />
              )}
              <div className="klant-modal-section">
                <h3>🏡 Lodge details</h3>
                <p><span>Naam</span><strong>{selectedLodge.name}</strong></p>
                <p><span>Type</span><strong>{lodgeTypes.find(t => Number(t.id) === Number(selectedLodge.lodge_type_id))?.name ?? "-"}</strong></p>
                <p><span>Prijs per nacht</span><strong>€{selectedLodge.price}</strong></p>
                <p><span>Slaapkamers</span><strong>{selectedLodge.bedrooms}</strong></p>
                <p><span>Personen</span><strong>{selectedLodge.people}</strong></p>
                {selectedLodge.description && (
                  <p><span>Omschrijving</span><strong>{selectedLodge.description}</strong></p>
                )}
              </div>
            </div>
            <div className="klant-modal-footer">
              <button className="klant-btn-secondary" onClick={() => setSelectedLodge(null)}>Sluiten</button>
              <button className="klant-btn-primary" onClick={() => openBookingModal(selectedLodge)}>Nu boeken</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Booking Modal ── */}
      {bookingLodge && (
        <div className="klant-modal-overlay" onClick={closeBookingModal}>
          <div className="klant-modal" onClick={(e) => e.stopPropagation()}>
            <div className="klant-modal-header">
              <h2>Boeking maken</h2>
              <button className="klant-modal-close" onClick={closeBookingModal}>✕</button>
            </div>

            <div className="klant-modal-body">
              {bookingSuccess ? (
                <div className="klant-booking-success">
                  <span className="klant-success-icon">✅</span>
                  <h3>Boeking bevestigd!</h3>
                  <p>Je boeking voor <strong>{bookingLodge.name}</strong> is succesvol aangemaakt.</p>
                  <p>{checkIn} → {checkOut} ({nights} nacht{nights !== 1 ? "en" : ""})</p>
                  <p className="klant-success-price">Totaal: €{totalPrice}</p>
                </div>
              ) : (
                <>
                  {/* Lodge summary */}
                  <div className="klant-modal-section" style={{ marginBottom: "1.25rem" }}>
                    <h3>🏡 {bookingLodge.name}</h3>
                    <p><span>Prijs per nacht</span><strong>€{bookingLodge.price}</strong></p>
                    <p><span>Slaapkamers</span><strong>{bookingLodge.bedrooms}</strong></p>
                    <p><span>Personen</span><strong>{bookingLodge.people}</strong></p>
                  </div>

                  {/* Customer name (read only) */}
                  <div className="klant-booking-form">
                    <div className="klant-booking-row">
                      <div className="klant-booking-field">
                        <label>Check-in datum</label>
                        <input
                          type="date"
                          className="klant-filter-input"
                          value={checkIn}
                          min={today}
                          onChange={(e) => {
                            setCheckIn(e.target.value);
                            if (checkOut && e.target.value >= checkOut) setCheckOut("");
                          }}
                        />
                      </div>
                      <div className="klant-booking-field">
                        <label>Check-out datum</label>
                        <input
                          type="date"
                          className="klant-filter-input"
                          value={checkOut}
                          min={checkIn || today}
                          onChange={(e) => setCheckOut(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Price summary */}
                    {nights > 0 && (
                      <div className="klant-price-summary">
                        <p><span>{nights} nacht{nights !== 1 ? "en" : ""} × €{bookingLodge.price}</span></p>
                        <p className="klant-price-total">Totaal: <strong>€{totalPrice}</strong></p>
                      </div>
                    )}

                    {bookingError && (
                      <p className="klant-booking-error">⚠️ {bookingError}</p>
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="klant-modal-footer">
              {bookingSuccess ? (
                <button className="klant-btn-primary" onClick={closeBookingModal}>Sluiten</button>
              ) : (
                <>
                  <button className="klant-btn-secondary" onClick={closeBookingModal}>Annuleren</button>
                  <button
                    className="klant-btn-primary"
                    onClick={submitBooking}
                    disabled={bookingLoading}
                  >
                    {bookingLoading ? "Bezig..." : "Bevestig boeking"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Page header */}
      <div className="klant-page-header">
        <h1>Beschikbare lodges</h1>
        <p>Kies een lodge en maak een boeking</p>
      </div>

      {/* Filter bar */}
      <div className="klant-filter-bar">
        <div className="klant-filter-group">
          <label>Zoeken</label>
          <input type="text" placeholder="Lodge naam..." className="klant-filter-input" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
        </div>
        <div className="klant-filter-group">
          <label>Prijs van (€)</label>
          <input type="number" placeholder="0" className="klant-filter-input" value={filters.priceFrom} onChange={(e) => setFilters({ ...filters, priceFrom: e.target.value })} min="0" />
        </div>
        <div className="klant-filter-group">
          <label>Prijs tot (€)</label>
          <input type="number" placeholder="9999" className="klant-filter-input" value={filters.priceTo} onChange={(e) => setFilters({ ...filters, priceTo: e.target.value })} min="0" />
        </div>
        <div className="klant-filter-group">
          <label>Personen</label>
          <input type="number" placeholder="1" className="klant-filter-input" value={filters.people} onChange={(e) => setFilters({ ...filters, people: e.target.value })} min="1" />
        </div>
        <div className="klant-filter-group">
          <label>Slaapkamers</label>
          <input type="number" placeholder="1" className="klant-filter-input" value={filters.bedrooms} onChange={(e) => setFilters({ ...filters, bedrooms: e.target.value })} min="1" />
        </div>
        <div className="klant-filter-actions">
          <button className="klant-btn-primary" onClick={applyFilters}>Zoeken</button>
          <button className="klant-btn-secondary" onClick={resetFilters}>Reset</button>
        </div>
      </div>

      {/* Lodge type tabs */}
      {lodgeTypes.length > 0 && (
        <div className="klant-type-tabs">
          <button className={`klant-type-tab ${activeType === null ? "active" : ""}`} onClick={() => setActiveType(null)}>Alle types</button>
          {lodgeTypes.map((type) => (
            <button key={type.id} className={`klant-type-tab ${activeType === type.id ? "active" : ""}`} onClick={() => setActiveType(activeType === type.id ? null : type.id)}>
              {type.name}
            </button>
          ))}
        </div>
      )}

      {!loading && !error && (
        <p className="klant-results-count">{filteredLodges.length} lodge(s) gevonden</p>
      )}

      {loading && <p className="klant-state-msg">Laden...</p>}
      {error && <p className="klant-state-msg klant-error">⚠️ {error}</p>}
      {!loading && !error && filteredLodges.length === 0 && (
        <p className="klant-state-msg">Geen lodges gevonden met deze filters.</p>
      )}

      {/* Lodge grid */}
      <div className="klant-lodge-grid">
        {filteredLodges.map((lodge) => (
          <div key={lodge.id} className="klant-lodge-card">
            <div className="klant-lodge-img-wrapper">
              <img
                src={lodge.image ? `data:image/jpeg;base64,${lodge.image}` : "https://via.placeholder.com/400x250"}
                alt={lodge.name}
                className="klant-lodge-img"
              />
              {lodgeTypes.find(t => Number(t.id) === Number(lodge.lodge_type_id)) && (
                <span className="klant-lodge-type-badge">
                  {lodgeTypes.find(t => Number(t.id) === Number(lodge.lodge_type_id)).name}
                </span>
              )}
            </div>
            <div className="klant-lodge-body">
              <div className="klant-lodge-header">
                <h3 className="klant-lodge-name">{lodge.name}</h3>
                <div className="klant-lodge-price">
                  <span className="klant-price-amount">€{lodge.price}</span>
                  <span className="klant-price-period">/nacht</span>
                </div>
              </div>
              <div className="klant-lodge-features">
                <div className="klant-lodge-feature"><span>🛏️</span><span>{lodge.bedrooms} slaapkamers</span></div>
                <div className="klant-lodge-feature"><span>👥</span><span>{lodge.people} personen</span></div>
              </div>
            </div>
            <div className="klant-lodge-footer">
              <button className="klant-btn-secondary" onClick={() => setSelectedLodge(lodge)}>Meer info</button>
              <button className="klant-btn-primary" onClick={() => openBookingModal(lodge)}>Boek nu</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KlantDashboard;