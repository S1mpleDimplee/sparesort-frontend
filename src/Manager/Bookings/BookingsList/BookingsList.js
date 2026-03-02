import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./BookingsList.css";
import { useToast } from "../../../toastmessage/toastmessage";
import apiCall from "../../../Calls/calls";

const STATUS_COLORS = {
  bevestigd: { bg: "#1a3a2a", color: "#40f1b6" },
  geannuleerd: { bg: "#3a1a1a", color: "#ff7272" },
  gepland: { bg: "#2a2a1a", color: "#d9ff72" },
};

const BookingsList = () => {
  const { openToast } = useToast();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("alle");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setIsLoading(true);
    const response = await apiCall("getallbookings", {});
    if (response.isSuccess) {
      setBookings(response.data);
    } else {
      openToast(response.message);
    }
    setIsLoading(false);
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Weet je zeker dat je deze boeking wilt annuleren?")) return;
    const response = await apiCall("cancelbooking", { id });
    openToast(response.message);
    if (response.isSuccess) fetchBookings();
  };

  const filtered = bookings.filter(b => {
    const matchSearch =
      b.user_name?.toLowerCase().includes(search.toLowerCase()) ||
      b.user_email?.toLowerCase().includes(search.toLowerCase()) ||
      b.lodge_name?.toLowerCase().includes(search.toLowerCase()) ||
      String(b.id).includes(search);
    const matchStatus = statusFilter === "alle" || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const nights = (checkIn, checkOut) =>
    Math.round((new Date(checkOut) - new Date(checkIn)) / 86400000);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("nl-NL", { day: "numeric", month: "short", year: "numeric" });

  if (isLoading) return <div className="booking-overview-loading">Laden...</div>;

  return (
    <div className="booking-overview-page">

      <div className="booking-overview-header">
        <div>
          <h1 className="booking-overview-title">📋 Boekingen</h1>
          <p className="booking-overview-subtitle">{filtered.length} boeking{filtered.length !== 1 ? "en" : ""} gevonden</p>
        </div>
        <button className="booking-overview-create-btn" onClick={() => navigate("/dashboard/boekingen/nieuw")}>
          + Nieuwe boeking
        </button>
      </div>

      <div className="booking-overview-filters">
        <input
          type="text"
          placeholder="🔍 Zoek op naam, email, lodge..."
          className="booking-overview-search"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="booking-overview-select"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="alle">Alle statussen</option>
          <option value="bevestigd">Bevestigd</option>
          <option value="gepland">Gepland</option>
          <option value="geannuleerd">Geannuleerd</option>
        </select>
      </div>

      <div className="booking-overview-table-wrapper">
        <table className="booking-overview-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Gast</th>
              <th>Lodge</th>
              <th>Inchecken</th>
              <th>Uitchecken</th>
              <th>Nachten</th>
              <th>Totaal</th>
              <th>Status</th>
              <th>Actie</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? filtered.map(b => (
              <tr key={b.id} className="booking-overview-row">

                <td className="booking-overview-id">#{b.id}</td>

                <td>
                  <div className="booking-overview-guest">
                    <div className="booking-overview-avatar">
                      {(b.user_name || b.user_email || "?")[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="booking-overview-guest-name">{b.user_name || "Onbekend"}</div>
                      <div className="booking-overview-guest-email">{b.user_email}</div>
                    </div>
                  </div>
                </td>

                <td>
                  <div className="booking-overview-lodge">
                    {b.lodge_image
                      ? <img src={`data:image/jpeg;base64,${b.lodge_image}`} alt={b.lodge_name} className="booking-overview-lodge-img" />
                      : <div className="booking-overview-lodge-placeholder">🏡</div>
                    }
                    <span>{b.lodge_name}</span>
                  </div>
                </td>

                <td>{formatDate(b.check_in)}</td>
                <td>{formatDate(b.check_out)}</td>
                <td>{nights(b.check_in, b.check_out)} nachten</td>
                <td className="booking-overview-price">€{parseFloat(b.total_price).toFixed(2)}</td>

                <td>
                  <span
                    className="booking-overview-status"
                    style={{
                      background: STATUS_COLORS[b.status]?.bg ?? "#2a2a3e",
                      color: STATUS_COLORS[b.status]?.color ?? "#fff"
                    }}
                  >
                    {b.status}
                  </span>
                </td>

                <td>
                  <div className="booking-overview-actions">
                    <button
                      className="booking-overview-btn-view"
                      onClick={() => navigate(`/dashboard/boekingen/${b.id}`)}
                    >
                      Inzien
                    </button>
                    {b.status !== "geannuleerd" && (
                      <button
                        className="booking-overview-btn-cancel"
                        onClick={() => handleCancel(b.id)}
                      >
                        Annuleren
                      </button>
                    )}
                  </div>
                </td>

              </tr>
            )) : (
              <tr>
                <td colSpan="9" className="booking-overview-empty">Geen boekingen gevonden</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingsList;