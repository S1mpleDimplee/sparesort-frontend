import React, { useEffect, useState } from "react";
import "./Mijnboekingen.css";

const API_ROUTER_URL = "http://localhost/sparesort-api/router/router.php";

const StatusBadge = ({ status }) => {
  const cls =
    status === "bevestigd" ? "mb-status-bevestigd" :
    status === "gepland" ? "mb-status-gepland" :
    status === "geannuleerd" ? "mb-status-geannuleerd" :
    status === "ingechecked" ? "mb-status-ingechecked" :
    status === "uitgechecked" ? "mb-status-uitgechecked" :
    "mb-status-default";
  return <span className={`mb-status-badge ${cls}`}>{status}</span>;
};

const MijnBoekingen = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);

  const userData = JSON.parse(localStorage.getItem("userdata") || "{}");
  const userId = userData?.userid ?? null;

  useEffect(() => {
    const fetchBookings = async () => {
      if (!userId) {
        setError("Niet ingelogd.");
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(API_ROUTER_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            function: "getbookingsbyuserid",
            data: { user_id: userId },
          }),
        });
        const json = await res.json();
        if (!json.success) throw new Error(json.message || "Kon boekingen niet ophalen");
        setBookings(Array.isArray(json.data) ? json.data : []);
      } catch (e) {
        setError(e?.message || "Onbekende fout");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [userId]);

  const calcNights = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 0;
    const diff = (new Date(checkOut) - new Date(checkIn)) / 86400000;
    return diff > 0 ? Math.round(diff) : 0;
  };

  const cancelBooking = async (bookingId) => {
    if (!window.confirm("Weet je zeker dat je deze boeking wilt annuleren?")) return;
    try {
      const res = await fetch(API_ROUTER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          function: "cancelbooking",
          data: { id: bookingId },
        }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      setBookings((prev) =>
        prev.map((b) => b.id === bookingId ? { ...b, status: "geannuleerd" } : b)
      );
      setSelectedBooking(null);
    } catch (e) {
      alert("Annuleren mislukt: " + e.message);
    }
  };

  return (
    <div className="mb-page">

      {/* Detail Modal */}
      {selectedBooking && (
        <div className="mb-modal-overlay" onClick={() => setSelectedBooking(null)}>
          <div className="mb-modal" onClick={(e) => e.stopPropagation()}>
            <div className="mb-modal-header">
              <h2>Boeking details</h2>
              <button className="mb-modal-close" onClick={() => setSelectedBooking(null)}>✕</button>
            </div>

            <div className="mb-modal-body">
              {selectedBooking.lodge_image && (
                <img
                  src={`data:image/jpeg;base64,${selectedBooking.lodge_image}`}
                  alt={selectedBooking.lodge_name}
                  className="mb-modal-img"
                />
              )}

              <div className="mb-modal-grid">
                <div className="mb-modal-section">
                  <h3>🏡 Lodge</h3>
                  <p><span>Naam</span><strong>{selectedBooking.lodge_name ?? "-"}</strong></p>
                </div>

                <div className="mb-modal-section">
                  <h3>📅 Boeking</h3>
                  <p><span>Check-in datum</span><strong>{selectedBooking.check_in ?? "-"}</strong></p>
                  <p><span>Check-in tijd</span><strong>{selectedBooking.check_in_time || "Nog niet ingechecked"}</strong></p>
                  <p><span>Check-out datum</span><strong>{selectedBooking.check_out ?? "-"}</strong></p>
                  <p><span>Check-out tijd</span><strong>{selectedBooking.check_out_time || "Nog niet uitgechecked"}</strong></p>
                  <p><span>Aantal nachten</span><strong>{calcNights(selectedBooking.check_in, selectedBooking.check_out)}</strong></p>
                  <p><span>Totaalprijs</span><strong>€{selectedBooking.total_price ?? "-"}</strong></p>
                  <p><span>Status</span><StatusBadge status={selectedBooking.status} /></p>
                </div>
              </div>
            </div>

            <div className="mb-modal-footer">
              <a className="mb-btn-phone" href="tel:+31201234567">
                📞 +31 20 123 4567
              </a>
              {selectedBooking.status !== "geannuleerd" && (
                <button
                  className="mb-btn-cancel"
                  onClick={() => cancelBooking(selectedBooking.id)}
                >
                  Annuleer boeking
                </button>
              )}
              <button className="mb-btn-primary" onClick={() => setSelectedBooking(null)}>
                Sluiten
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page header */}
      <div className="mb-page-header">
        <h1>Mijn boekingen</h1>
        <p>Overzicht van al jouw boekingen</p>
      </div>

      {loading && <p className="mb-state-msg">Laden...</p>}
      {error && <p className="mb-state-msg mb-error">⚠️ {error}</p>}
      {!loading && !error && bookings.length === 0 && (
        <div className="mb-empty">
          <p>🏝️ Je hebt nog geen boekingen.</p>
        </div>
      )}

      {!loading && !error && bookings.length > 0 && (
        <>
          <p className="mb-results-count">{bookings.length} boeking(en) gevonden</p>
          <div className="mb-bookings-grid">
            {bookings.map((booking, index) => (
              <div key={index} className="mb-booking-card">
                <div className="mb-card-img-wrapper">
                  <img
                    src={booking.lodge_image ? `data:image/jpeg;base64,${booking.lodge_image}` : "https://via.placeholder.com/200x150"}
                    alt={booking.lodge_name}
                    className="mb-card-img"
                  />
                </div>

                <div className="mb-card-body">
                  <div className="mb-card-header">
                    <h3 className="mb-lodge-name">{booking.lodge_name}</h3>
                    <StatusBadge status={booking.status} />
                  </div>

                  <div className="mb-card-details">
                    <div className="mb-card-detail">
                      <span className="mb-detail-label">Check-in</span>
                      <span className="mb-detail-value">{booking.check_in}</span>
                    </div>
                    <div className="mb-card-detail">
                      <span className="mb-detail-label">Check-out</span>
                      <span className="mb-detail-value">{booking.check_out}</span>
                    </div>
                    <div className="mb-card-detail">
                      <span className="mb-detail-label">Nachten</span>
                      <span className="mb-detail-value">{calcNights(booking.check_in, booking.check_out)}</span>
                    </div>
                    <div className="mb-card-detail">
                      <span className="mb-detail-label">Totaal</span>
                      <span className="mb-detail-value mb-price">€{booking.total_price}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-card-actions">
  <button className="mb-btn-primary" onClick={() => setSelectedBooking(booking)}>
    Inzien
  </button>
  {booking.status !== "geannuleerd" && booking.status !== "uitgechecked" && (
    <button className="mb-btn-betalen" onClick={() => window.location.href = "/404"}>
      Betalen
    </button>
  )}
</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MijnBoekingen;