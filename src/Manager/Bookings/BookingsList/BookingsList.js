import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./BookingsList.css";
import { useToast } from "../../../toastmessage/toastmessage";
import apiCall from "../../../Calls/calls";
import * as Icons from "../../../Icons/Icons";

const STATUS_COLORS = {
  bevestigd: { bg: "#22c55e", color: "white" },
  geannuleerd: { bg: "#ef4444", color: "white" },
  gepland: { bg: "#f59e0b", color: "white" },
  pending: { bg: "#6b7280", color: "white" },
};

const BookingList = () => {
  const { openToast } = useToast();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("alle");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    setIsLoading(true);
    const response = await apiCall("getallbookings", {});
    if (response.isSuccess) setBookings(response.data);
    else openToast(response.message);
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

  const getInitials = (name, email) => {
    if (name) return name.split(" ").map(n => n[0]).join("").toUpperCase();
    return ((email?.[0] || "") + (email?.[1] || "")).toUpperCase();
  };

  if (isLoading) return <div className="booking-overview-loading">Laden...</div>;

  return (
    <div className="manager-users-page">

      <div className="manager-users-header">
        <div>
          <div className="manager-list-header-content">
            <img src={Icons.calendar} alt="Calendar Icon" className="manager-list-icon" width={"40px"} />
            <h1 className="manager-list-title">Boekingen</h1>
          </div>
          <p className="manager-list-subtitle">{filtered.length} boeking{filtered.length !== 1 ? "en" : ""} gevonden</p>
        </div>
        <div className="manager-list-filters">
          <input
            type="text"
            className="manager-list-search"
            placeholder="Zoek op naam, email, lodge..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            className="manager-users-filter-select"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="alle">Alle statussen</option>
            <option value="bevestigd">Bevestigd</option>
            <option value="gepland">Gepland</option>
            <option value="geannuleerd">Geannuleerd</option>
          </select>
          <button
            className="manager-users-create-btn"
            onClick={() => navigate("/dashboard/boekingen/nieuw")}
          >
            + Nieuwe boeking
          </button>
        </div>
      </div>

      <div className="manager-users-table-section">
        <div className="manager-users-table-wrapper">
          <table className="manager-users-table">
            <thead>
              <tr className="manager-users-table-header">
                <th className="manager-users-header-cell">#</th>
                <th className="manager-users-header-cell">Gast</th>
                <th className="manager-users-header-cell">Lodge</th>
                <th className="manager-users-header-cell">Inchecken</th>
                <th className="manager-users-header-cell">Uitchecken</th>
                <th className="manager-users-header-cell">Nachten</th>
                <th className="manager-users-header-cell">Totaal</th>
                <th className="manager-users-header-cell">Status</th>
                <th className="manager-users-header-cell">Actie</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? filtered.map(b => (
                <tr key={b.id} className="manager-users-table-row">

                  <td className="manager-users-table-cell">
                    <span className="manager-users-date">#{b.id}</span>
                  </td>

                  <td className="manager-users-table-cell">
                    <div className="manager-users-user-info">
                      <div className="manager-users-user-avatar">
                        <span className="manager-users-avatar-text">
                          {getInitials(b.user_name, b.user_email)}
                        </span>
                      </div>
                      <div>
                        <span className="manager-users-user-name">{b.user_name || "Onbekend"}</span>
                        <div className="manager-users-email">{b.user_email}</div>
                      </div>
                    </div>
                  </td>

                  <td className="manager-users-table-cell">
                    <div className="manager-users-user-info">
                      {b.lodge_image
                        ? <img src={`data:image/jpeg;base64,${b.lodge_image}`} alt={b.lodge_name} className="booking-lodge-img" />
                        : <div className="booking-lodge-placeholder">🏡</div>
                      }
                      <span className="manager-users-user-name">{b.lodge_name}</span>
                    </div>
                  </td>

                  <td className="manager-users-table-cell">
                    <span className="manager-users-date">{formatDate(b.check_in)}</span>
                  </td>

                  <td className="manager-users-table-cell">
                    <span className="manager-users-date">{formatDate(b.check_out)}</span>
                  </td>

                  <td className="manager-users-table-cell">
                    <span className="manager-users-date">{nights(b.check_in, b.check_out)}n</span>
                  </td>

                  <td className="manager-users-table-cell">
                    <span className="booking-price">€{parseFloat(b.total_price).toFixed(2)}</span>
                  </td>

                  <td className="manager-users-table-cell">
                    <span
                      className="manager-users-status-badge"
                      style={{
                        background: STATUS_COLORS[b.status]?.bg ?? "#6b7280",
                        color: STATUS_COLORS[b.status]?.color ?? "white",
                        boxShadow: `0 2px 8px ${STATUS_COLORS[b.status]?.bg ?? "#6b7280"}55`
                      }}
                    >
                      {b.status}
                    </span>
                  </td>

                  <td className="manager-users-table-cell">
                    <div className="manager-users-actions">
                      <button
                        className="manager-users-action-btn manager-users-view-btn"
                        onClick={() => navigate(`/dashboard/boekingen/${b.id}`)}
                      >
                        Inzien
                      </button>
                      {b.status !== "geannuleerd" && (
                        <button
                          className="manager-users-action-btn manager-users-deactivate-btn"
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
                  <td colSpan="9" className="manager-users-table-cell" style={{ textAlign: "center", padding: "3rem", color: "#aaa" }}>
                    Geen boekingen gevonden
                  </td>
                </tr>
              )}
            </tbody>
            <td className="manager-users-table-footer">
              <span className="manager-users-end-message">Einde van de lijst</span>
            </td>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BookingList;