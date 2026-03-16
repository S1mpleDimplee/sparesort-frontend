import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./ViewBooking.css";
import apiCall from "../../../Calls/calls";

const statusses = {
  bevestigd: "Bevestigd",
  gepland: "Gepland",
  geannuleerd: "Geannuleerd",
  terugbetaling: "Terugbetaling",
};

const statusclass = {
  bevestigd: "bevestigd",
  gepland: "in-behandeling",
  geannuleerd: "geannuleerd",
  terugbetaling: "terugbetaling",
};

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("nl-NL", {
    day: "numeric", month: "long", year: "numeric",
  });
};

const formatWeekday = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("nl-NL", { weekday: "long" });
};

const calcNights = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0;
  const diff = new Date(checkOut) - new Date(checkIn);
  return Math.max(0, Math.round(diff / (1000 * 60 * 60 * 24)));
};

const getInitials = (name) => {
  if (!name) return "??";
  const parts = name.trim().split(" ");
  return parts.length >= 2
    ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
    : name.slice(0, 2).toUpperCase();
};

const ConfirmModal = ({ title, description, confirmLabel, confirmClass, onConfirm, onClose }) => (
  <div className="booking-info-modal-overlay" onClick={onClose}>
    <div className="booking-info-modal" onClick={(e) => e.stopPropagation()}>
      <h3>{title}</h3>
      <p>{description}</p>
      <div className="booking-info-modal-actions">
        <button className="booking-info-modal-cancel-btn" onClick={onClose}>
          Annuleren
        </button>
        <button
          className={`booking-info-modal-confirm-btn ${confirmClass}`}
          onClick={onConfirm}
        >
          {confirmLabel}
        </button>
      </div>
    </div>
  </div>
);

const ManagerViewBooking = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [booking, setBooking] = useState(null);
  const [invoice, setInvoice] = useState(null);
  const [repairs, setRepairs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newNote, setNewNote] = useState("");
  const [modal, setModal] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchBooking = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiCall("GetBookingById", { id });
      if (response.isSuccess) {
        setBooking(response.data.booking);
        setInvoice(response.data.invoice);
        setRepairs(response.data.repairs || []);
      } else {
        setError(response.message);
      }
    } catch {
      setError("Er is een fout opgetreden bij het laden van de boeking.");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchBooking(); }, [fetchBooking]);

  const confirmAction = async () => {
    const statusMap = {
      approve: "bevestigd",
      cancel: "geannuleerd",
      terugbetaling: "terugbetaling",
    };
    const newStatus = statusMap[modal];
    setSaving(true);
    try {
      const response = await apiCall("UpdateBookingStatus", {
        id,
        status: newStatus,
      });
      if (response.isSuccess) {
        setBooking((prev) => ({ ...prev, booking_status: newStatus }));
      } else {
        alert(response.message || "Er is iets misgegaan.");
      }
    } catch {
      alert("Er is een fout opgetreden.");
    } finally {
      setSaving(false);
      setModal(null);
    }
  };

  if (isLoading) {
    return (
      <div className="booking-info-page">
        <button className="booking-info-back-btn" onClick={() => navigate(-1)}>
          Terug naar boekingen
        </button>
        <div style={{ color: "rgba(255,255,255,0.4)", marginTop: "4rem", textAlign: "center" }}>
          Boeking laden...
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="booking-info-page">
        <button className="booking-info-back-btn" onClick={() => navigate(-1)}>
          Terug naar boekingen
        </button>
        <div style={{ color: "var(--red)", marginTop: "4rem", textAlign: "center" }}>
          {error || "Boeking niet gevonden."}
        </div>
      </div>
    );
  }

  const nights = calcNights(booking.check_in, booking.check_out);
  const initials = getInitials(booking.user_name);
  const status = booking.booking_status;

  const config = {
    approve: {
      title: "Boeking bevestigen",
      description: `Weet je zeker dat je boeking #${booking.booking_id} wilt bevestigen?`,
      confirmLabel: "Ja, bevestigen",
      confirmClass: "primary",
    },
    cancel: {
      title: "Boeking annuleren",
      description: `Weet je zeker dat je boeking #${booking.booking_id} wilt annuleren? Dit kan niet ongedaan worden gemaakt.`,
      confirmLabel: "Ja, annuleren",
      confirmClass: "danger",
    },
    terugbetaling: {
      title: "Terugbetaling starten",
      description: `Weet je zeker dat je een terugbetaling wilt starten voor boeking #${booking.booking_id}?`,
      confirmLabel: "Ja, terugbetalen",
      confirmClass: "danger",
    },
  };

  return (
    <div className="booking-info-page">

      <button className="booking-info-back-btn" onClick={() => navigate(-1)}>
        Terug naar boekingen
      </button>

      <div className="booking-info-page-header">
        <div className="booking-info-title-block">
          <h1>Boeking #{booking.booking_id}</h1>
          <p>Inchecken op {formatDate(booking.check_in)}</p>
        </div>
        <span className={`booking-info-status-badge ${statusclass[status] ?? "in-behandeling"}`}>
          {statusses[status] ?? status}
        </span>
      </div>

      <div className="booking-info-two-col">
        <div className="booking-info-card">
          <h2 className="booking-info-section-title">Gastgegevens</h2>

          <div className="booking-info-guest-header">
            <div className="booking-info-avatar">{initials}</div>
            <div>
              <p className="booking-info-guest-name">{booking.user_name}</p>
            </div>
          </div>

          <div className="booking-info-row">
            <span className="booking-info-label">E-mailadres</span>
            <span className="booking-info-value">{booking.user_email}</span>
          </div>
          <div className="booking-info-row">
            <span className="booking-info-label">Telefoonnummer</span>
            <span className="booking-info-value">{booking.user_phone || "—"}</span>
          </div>
          <div className="booking-info-row">
            <span className="booking-info-label">Klantprofiel</span>
            <span
              className="booking-info-value"
              style={{ color: "var(--blue)", cursor: "pointer" }}
              onClick={() => navigate(`/dashboard/gebruikers/${booking.user_id}`)}
            >
              Bekijk profiel
            </span>
          </div>
        </div>

        <div className="booking-info-card">
          <h2 className="booking-info-section-title">Lodge & Datums</h2>

          <div className="booking-info-lodge-preview">
            {booking.lodge_image ? (
              <img
                src={booking.lodge_image}
                alt={booking.lodge_name}
                className="booking-info-lodge-img"
              />
            ) : (
              <div className="booking-info-lodge-img-placeholder">🏡</div>
            )}
            <div>
              <p className="booking-info-lodge-name">{booking.lodge_name}</p>
              <div className="booking-info-lodge-meta">
                <span>max {booking.lodge_people}</span>
                <span>{booking.lodge_bedrooms} slaapkamers</span>
              </div>
            </div>
          </div>

          <div className="booking-info-dates">
            <div className="booking-info-date-block">
              <span className="booking-info-date-label">Inchecken</span>
              <span className="booking-info-date-value">{formatDate(booking.check_in)}</span>
              <span className="booking-info-date-weekday">{formatWeekday(booking.check_in)}</span>
            </div>
            <div className="booking-info-date-arrow">
              <span className="booking-info-nights-badge">
                {nights} nacht{nights !== 1 ? "en" : ""}
              </span>
            </div>
            <div className="booking-info-date-block end">
              <span className="booking-info-date-label">Uitchecken</span>
              <span className="booking-info-date-value">{formatDate(booking.check_out)}</span>
              <span className="booking-info-date-weekday">{formatWeekday(booking.check_out)}</span>
            </div>
          </div>

          <div className="booking-info-row">
            <span className="booking-info-label">Lodge bekijken</span>
            <span
              className="booking-info-value"
              style={{ color: "var(--blue)", cursor: "pointer" }}
              onClick={() => navigate(`/dashboard/lodges/${booking.lodge_id}`)}
            >
              Lodge #{booking.lodge_id} →
            </span>
          </div>
        </div>
      </div>

      <div className="booking-info-two-col">
        <div className="booking-info-card">
          <h2 className="booking-info-section-title">💶Factuur & Betaling</h2>

          {invoice ? (
            <>
              <div className="booking-info-row">
                <span className="booking-info-label">Factuur ID</span>
                <span className="booking-info-value">#{invoice.id}</span>
              </div>
              <div className="booking-info-row">
                <span className="booking-info-label">Factuurdatum</span>
                <span className="booking-info-value">{formatDate(invoice.invoice_date)}</span>
              </div>
              <div className="booking-info-row">
                <span className="booking-info-label">Factuurbedrag</span>
                <span className="booking-info-value highlight">
                  €{Number(invoice.total_amount).toFixed(2)}
                </span>
              </div>
            </>
          ) : (
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.875rem", marginBottom: "1rem" }}>
              Geen factuur gevonden voor deze boeking.
            </p>
          )}

          <div className="booking-info-payment-row total">
            <span className="booking-info-payment-label">Totaal boeking</span>
            <span className="booking-info-payment-value">
              €{Number(booking.total_price).toFixed(2)}
            </span>
          </div>

          <div>
            <span className={`booking-info-paid-badge ${status === "geannuleerd" ? "openstaand" : "betaald"}`}>
              {status === "geannuleerd" ? "Geannuleerd" : "Betaald"}
            </span>
          </div>
        </div>

        <div className="booking-info-card">
          <h2 className="booking-info-section-title">Reparaties & Notities</h2>

          {repairs.length > 0 && (
            <div style={{ marginBottom: "1.25rem" }}>
              <p className="booking-info-label" style={{ marginBottom: "0.5rem" }}>
                Reparaties lodge #{booking.lodge_id}
              </p>
              {repairs.map((r) => (
                <div key={r.id} className="booking-info-note-item" style={{ borderLeftColor: "var(--red)" }}>
                  <div className="booking-info-note-meta">
                    <span>Reparatie #{r.id} — {r.description}</span>
                    <span style={{
                      color: r.status === "afgerond" ? "var(--green)"
                        : r.status === "bezig" ? "var(--blue)"
                          : "var(--orange)",
                      fontWeight: 600,
                    }}>
                      {r.status}
                    </span>
                  </div>
                  {r.task_description && (
                    <p className="booking-info-note-text">{r.task_description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="booking-info-actions">
        {status !== "bevestigd" && status !== "geannuleerd" && (
          <button
            className="booking-info-btn approve"
            onClick={() => setModal("approve")}
            disabled={saving}
          >
            Boeking bevestigen
          </button>
        )}
        {status !== "geannuleerd" && status !== "terugbetaling" && (
          <button
            className="booking-info-btn refund"
            onClick={() => setModal("terugbetaling")}
            disabled={saving}
          >
            Terugbetaling starten
          </button>
        )}
        {status !== "geannuleerd" && (
          <button
            className="booking-info-btn cancel"
            onClick={() => setModal("cancel")}
            disabled={saving}
          >
            Boeking annuleren
          </button>
        )}
      </div>

      {modal && (
        <ConfirmModal
          {...config[modal]}
          onConfirm={confirmAction}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
};

export default ManagerViewBooking;