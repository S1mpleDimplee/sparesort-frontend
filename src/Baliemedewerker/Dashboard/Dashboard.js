import React, { useEffect, useState } from "react";
import "./Dashboard.css";

const API_ROUTER_URL = "http://localhost/sparesort-api/router/router.php";

const StatusBadge = ({ status }) => {
  const cls =
    status === "bevestigd" ? "balie-dash-status-bevestigd" :
    status === "gepland" ? "balie-dash-status-gepland" :
    status === "geannuleerd" ? "balie-dash-status-geannuleerd" :
    status === "ingechecked" ? "balie-dash-status-ingechecked" :
    status === "uitgechecked" ? "balie-dash-status-uitgechecked" :
    "balie-dash-status-default";
  return <span className={`balie-dash-status-badge ${cls}`}>{status}</span>;
};

const BalieDashboard = () => {
  const [now, setNow] = useState(new Date());
  const [allBookings, setAllBookings] = useState([]);
  const [checkIns, setCheckIns] = useState([]);
  const [checkOuts, setCheckOuts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [filters, setFilters] = useState({
    naam: "",
    datum: "",
    lodge: "",
    status: "",
  });

  // Live clock
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch bookings
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await fetch(API_ROUTER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ function: "getallbookings", data: {} }),
      });
      const json = await res.json();
      if (!json.success) return;
      const today = new Date().toISOString().split("T")[0];
      setAllBookings(json.data);
      setCheckIns(json.data.filter((b) => b.check_in?.startsWith(today) && b.status !== "geannuleerd"));
      setCheckOuts(json.data.filter((b) => b.check_out?.startsWith(today) && b.status !== "geannuleerd"));
    } catch (e) {
      console.error("Fout bij ophalen boekingen:", e);
    } finally {
      setLoading(false);
    }
  };

  // Update a booking in all state lists
  const updateBookingInState = (id, updates) => {
    const update = (list) => list.map((b) => b.id === id ? { ...b, ...updates } : b);
    setAllBookings(update);
    setCheckIns(update);
    setCheckOuts(update);
    if (selectedBooking?.id === id) {
      setSelectedBooking((prev) => ({ ...prev, ...updates }));
    }
  };

  const handleCheckIn = async (booking) => {
    if (!window.confirm(`Weet je zeker dat je ${booking.user_name} wilt inchecken?`)) return;
    setActionLoading(true);
    try {
      const res = await fetch(API_ROUTER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ function: "checkinbooking", data: { id: booking.id } }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      updateBookingInState(booking.id, { status: "ingechecked", check_in_time: json.time });
    } catch (e) {
      alert("Inchecken mislukt: " + e.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async (booking) => {
    if (!window.confirm(`Weet je zeker dat je ${booking.user_name} wilt uitchecken?`)) return;
    setActionLoading(true);
    try {
      const res = await fetch(API_ROUTER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ function: "checkoutbooking", data: { id: booking.id } }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      updateBookingInState(booking.id, { status: "uitgechecked", check_out_time: json.time });
    } catch (e) {
      alert("Uitchecken mislukt: " + e.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (bookingId) => {
    if (!window.confirm("Weet je zeker dat je deze geannuleerde boeking wilt verwijderen?")) return;
    setActionLoading(true);
    try {
      const res = await fetch(API_ROUTER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ function: "cancelbooking", data: { id: bookingId } }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      setAllBookings((prev) => prev.filter((b) => b.id !== bookingId));
      setCheckIns((prev) => prev.filter((b) => b.id !== bookingId));
      setCheckOuts((prev) => prev.filter((b) => b.id !== bookingId));
      setSelectedBooking(null);
    } catch (e) {
      alert("Verwijderen mislukt: " + e.message);
    } finally {
      setActionLoading(false);
    }
  };

  const getCheckInButton = (item) => {
    if (item.status === "geannuleerd") return null;
    if (item.status === "ingechecked") {
      return (
        <button
          className="balie-dash-action-btn balie-dash-checkout-btn"
          onClick={() => handleCheckOut(item)}
          disabled={actionLoading}
        >
          Check-out
        </button>
      );
    }
    if (item.status === "uitgechecked") return null;
    return (
      <button
        className="balie-dash-action-btn balie-dash-checkin-btn"
        onClick={() => handleCheckIn(item)}
        disabled={actionLoading}
      >
        Check-in
      </button>
    );
  };

  const formattedDate = now.toLocaleDateString("nl-NL");
  const formattedTime = now.toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  const baseList =
    activeTab === "checkins" ? checkIns :
    activeTab === "checkouts" ? checkOuts :
    allBookings;

  const displayedBookings = baseList.filter((b) => {
    if (filters.naam && !b.user_name?.toLowerCase().includes(filters.naam.toLowerCase())) return false;
    if (filters.lodge && !b.lodge_name?.toLowerCase().includes(filters.lodge.toLowerCase())) return false;
    if (filters.status && b.status !== filters.status) return false;
    if (filters.datum && !b.check_in?.startsWith(filters.datum)) return false;
    return true;
  });

  return (
    <div className="balie-dash-dashboard-page">

      {/* ── Detail modal ── */}
      {selectedBooking && (
        <div className="balie-dash-modal-overlay" onClick={() => setSelectedBooking(null)}>
          <div className="balie-dash-modal" onClick={(e) => e.stopPropagation()}>
            <div className="balie-dash-modal-header">
              <h2>Boeking details</h2>
              <button className="balie-dash-modal-close" onClick={() => setSelectedBooking(null)}>✕</button>
            </div>

            <div className="balie-dash-modal-body">
              {selectedBooking.lodge_image && (
                <img
                  src={`data:image/jpeg;base64,${selectedBooking.lodge_image}`}
                  alt={selectedBooking.lodge_name}
                  className="balie-dash-modal-img"
                />
              )}

              <div className="balie-dash-modal-grid">
                <div className="balie-dash-modal-section">
                  <h3>👤 Klant</h3>
                  <p><span>Naam</span><strong>{selectedBooking.user_name ?? "-"}</strong></p>
                  <p><span>E-mail</span><strong>{selectedBooking.user_email ?? "-"}</strong></p>
                </div>

                <div className="balie-dash-modal-section">
                  <h3>🏡 Lodge</h3>
                  <p><span>Naam</span><strong>{selectedBooking.lodge_name ?? "-"}</strong></p>
                </div>

                <div className="balie-dash-modal-section">
                  <h3>📅 Boeking</h3>
                  <p><span>Check-in datum</span><strong>{selectedBooking.check_in ?? "-"}</strong></p>
                  <p><span>Check-in tijd</span><strong>{selectedBooking.check_in_time ?? "Nog niet ingechecked"}</strong></p>
                  <p><span>Check-out datum</span><strong>{selectedBooking.check_out ?? "-"}</strong></p>
                  <p><span>Check-out tijd</span><strong>{selectedBooking.check_out_time ?? "Nog niet uitgechecked"}</strong></p>
                  <p><span>Totaalprijs</span><strong>€{selectedBooking.total_price ?? "-"}</strong></p>
                  <p><span>Status</span><StatusBadge status={selectedBooking.status} /></p>
                </div>
              </div>
            </div>

            <div className="balie-dash-modal-footer">
              {selectedBooking.status === "geannuleerd" && (
                <button
                  className="balie-dash-action-btn balie-dash-delete-btn"
                  onClick={() => handleDelete(selectedBooking.id)}
                  disabled={actionLoading}
                >
                  Verwijderen
                </button>
              )}
              {selectedBooking.status !== "geannuleerd" && selectedBooking.status !== "uitgechecked" && selectedBooking.status !== "ingechecked" && (
                <button
                  className="balie-dash-action-btn balie-dash-checkin-btn"
                  onClick={() => handleCheckIn(selectedBooking)}
                  disabled={actionLoading}
                >
                  Check-in
                </button>
              )}
              {selectedBooking.status === "ingechecked" && (
                <button
                  className="balie-dash-action-btn balie-dash-checkout-btn"
                  onClick={() => handleCheckOut(selectedBooking)}
                  disabled={actionLoading}
                >
                  Check-out
                </button>
              )}
              <button className="balie-dash-action-btn balie-dash-inzien-btn" onClick={() => setSelectedBooking(null)}>
                Sluiten
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Time Card ── */}
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
              <div className="balie-dash-date">{formattedDate}</div>
              <div className="balie-dash-time">{formattedTime}</div>
            </div>
          </div>
          <div className="balie-dash-stat-footer">
            <span className="balie-dash-timezone">West-Europe Bali</span>
          </div>
        </div>
      </div>

      {/* ── Bookings Grid ── */}
      <div className="balie-dash-bookings-section">
        <div className="balie-dash-bookings-toolbar">
          <div className="balie-dash-tabs">
            <button className={`balie-dash-tab ${activeTab === "all" ? "active" : ""}`} onClick={() => setActiveTab("all")}>
              Alle boekingen
            </button>
            <button className={`balie-dash-tab ${activeTab === "checkins" ? "active" : ""}`} onClick={() => setActiveTab("checkins")}>
              Check-ins vandaag
            </button>
            <button className={`balie-dash-tab ${activeTab === "checkouts" ? "active" : ""}`} onClick={() => setActiveTab("checkouts")}>
              Check-outs vandaag
            </button>
          </div>

          <div className="balie-dash-filters">
            <input
              type="text"
              placeholder="Naam boeker..."
              className="balie-dash-search-input"
              value={filters.naam}
              onChange={(e) => setFilters({ ...filters, naam: e.target.value })}
            />
            <input
              type="date"
              className="balie-dash-search-input"
              value={filters.datum}
              onChange={(e) => setFilters({ ...filters, datum: e.target.value })}
            />
            <input
              type="text"
              placeholder="Lodge naam..."
              className="balie-dash-search-input"
              value={filters.lodge}
              onChange={(e) => setFilters({ ...filters, lodge: e.target.value })}
            />
            <select
              className="balie-dash-search-input"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="">Alle statussen</option>
              <option value="bevestigd">Bevestigd</option>
              <option value="gepland">Gepland</option>
              <option value="geannuleerd">Geannuleerd</option>
              <option value="ingechecked">Ingechecked</option>
              <option value="uitgechecked">Uitgechecked</option>
            </select>
            <button
              className="balie-dash-reset-btn"
              onClick={() => setFilters({ naam: "", datum: "", lodge: "", status: "" })}
            >
              Reset
            </button>
          </div>
        </div>

        <p className="balie-dash-results-count">
          {loading ? "Laden..." : `${displayedBookings.length} boeking(en) gevonden`}
        </p>

        <div className="balie-dash-bookings-grid">
          {loading ? (
            <p style={{ color: "#aaa" }}>Laden...</p>
          ) : displayedBookings.length === 0 ? (
            <p style={{ color: "#aaa" }}>Geen boekingen gevonden</p>
          ) : (
            displayedBookings.map((item, index) => (
              <div key={index} className="balie-dash-check-item">
                <div className="balie-dash-check-info">
                  <h4 className="balie-dash-guest-name">{item.user_name}</h4>
                  <p className="balie-dash-lodge-name">{item.lodge_name}</p>
                  <div className="balie-dash-check-details">
                    <span className="balie-dash-check-label">Check-in:</span>
                    <span className="balie-dash-check-date">{item.check_in}</span>
                    <span className="balie-dash-check-time">{item.check_in_time || "-"}</span>
                    <span className="balie-dash-check-label">Check-out:</span>
                    <span className="balie-dash-check-date">{item.check_out}</span>
                    <span className="balie-dash-check-time">{item.check_out_time || "-"}</span>
                  </div>
                </div>
                <div className="balie-dash-check-actions">
                  <StatusBadge status={item.status} />
                  <button
                    className="balie-dash-action-btn balie-dash-inzien-btn"
                    onClick={() => setSelectedBooking(item)}
                  >
                    Inzien
                  </button>
                  {getCheckInButton(item)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BalieDashboard;