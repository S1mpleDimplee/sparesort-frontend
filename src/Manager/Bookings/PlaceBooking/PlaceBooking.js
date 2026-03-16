import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./PlaceBooking.css";
import { useToast } from "../../../toastmessage/toastmessage";
import apiCall from "../../../Calls/calls";

const PlaceBooking = () => {
  const { openToast } = useToast();
  const navigate = useNavigate();

  const [lodges, setLodges] = useState([]);
  const [formData, setFormData] = useState({
    lodge_id: "",
    check_in: "",
    check_out: "",
  });
  const [selectedLodge, setSelectedLodge] = useState(null);
  const [totalPrice, setTotalPrice] = useState(null);
  const [nights, setNights] = useState(0);

  // User search
  const [userSearch, setUserSearch] = useState("");
  const [userResults, setUserResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchLodges();
  }, []);
  useEffect(() => {
    calculatePrice();
  }, [formData, lodges]);

  const fetchLodges = async () => {
    const response = await apiCall("getalllodges", {});
    if (response.isSuccess) {
      setLodges(response.data.filter((l) => l.status === "beschikbaar"));
    }
  };

  const calculatePrice = () => {
    if (!formData.lodge_id || !formData.check_in || !formData.check_out) {
      setTotalPrice(null);
      setNights(0);
      return;
    }
    const lodge = lodges.find((l) => l.id == formData.lodge_id);
    if (!lodge) return;
    setSelectedLodge(lodge);

    const n = Math.round(
      (new Date(formData.check_out) - new Date(formData.check_in)) / 86400000,
    );
    if (n <= 0) {
      setTotalPrice(null);
      setNights(0);
      return;
    }

    const month = new Date(formData.check_in).getMonth() + 1;
    const isWinter = [11, 12, 1, 2].includes(month);
    const price = isWinter ? lodge.price_winter : lodge.price;
    setNights(n);
    setTotalPrice((n * price).toFixed(2));
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUserSearch = async (e) => {
    const data = await apiCall("getallusers", {});
    if (data.isSuccess) setUsers(data.data);
    const value = e.target.value;
    if (searchTimeout) clearTimeout(searchTimeout);
    setSearchTimeout(
      setTimeout(() => {
        const results = users.filter(
          (u) =>
            u.name?.toLowerCase().includes(value.toLowerCase()) ||
            u.email?.toLowerCase().includes(value.toLowerCase()),
        );
        setUserResults(results);
      }, 300),
    );
  };

  const selectUser = (user) => {
    setSelectedUser(user);
    setUserSearch(user.name || user.email);
    setUserResults([]);
  };

  const handleSubmit = async () => {
    if (!selectedUser) {
      openToast("Selecteer een gebruiker");
      return;
    }
    if (!formData.lodge_id || !formData.check_in || !formData.check_out) {
      openToast("Vul alle velden in");
      return;
    }
    if (formData.check_out <= formData.check_in) {
      openToast("Uitcheckdatum moet na inchecknatum zijn");
      return;
    }

    const response = await apiCall("createbooking", {
      user_id: selectedUser.id,
      lodge_id: formData.lodge_id,
      check_in: formData.check_in,
      check_out: formData.check_out,
    });

    openToast(response.message);
    if (response.isSuccess) navigate("/dashboard/boekingen");
  };

  return (
    <div className="place-booking-page">
      <h1 className="place-booking-title">📅 Boeking aanmaken</h1>

      <div className="place-booking-card">
        <div className="place-booking-group">
          <label>Gast zoeken</label>
          <div className="place-booking-user-search">
            <input
              type="text"
              placeholder="Zoek op naam of email..."
              value={userSearch}
              onChange={(e) => {
                setUserSearch(e.target.value);
                handleUserSearch(e);
              }}
              className="place-booking-input"
            />
            {userResults.length > 0 && (
              <div className="place-booking-user-dropdown">
                {userResults.map((u) => (
                  <div
                    key={u.id}
                    className="place-booking-user-option"
                    onClick={() => selectUser(u)}
                  >
                    <div className="place-booking-user-avatar">
                      {(u.name || u.email)[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="place-booking-user-name">
                        {u.name || "Geen naam"}
                      </div>
                      <div className="place-booking-user-email">{u.email}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {selectedUser && (
            <div className="place-booking-selected-user">
              ✓ {selectedUser.name || selectedUser.email} geselecteerd
            </div>
          )}
        </div>

        <div className="place-booking-group">
          <label>Lodge</label>
          <select
            name="lodge_id"
            value={formData.lodge_id}
            onChange={handleChange}
            className="place-booking-input"
          >
            <option value="">Selecteer een lodge...</option>
            {lodges.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name} — €{l.price}/nacht ({l.people} personen, {l.bedrooms}{" "}
                slaapkamers)
              </option>
            ))}
          </select>
        </div>

        {selectedLodge?.image && (
          <img
            src={`data:image/jpeg;base64,${selectedLodge.image}`}
            alt={selectedLodge.name}
            className="place-booking-image"
          />
        )}

        <div className="place-booking-dates">
          <div className="place-booking-group">
            <label>Inchecken</label>
            <input
              type="date"
              name="check_in"
              value={formData.check_in}
              min={new Date().toISOString().split("T")[0]}
              onChange={handleChange}
              className="place-booking-input"
            />
          </div>
          <div className="place-booking-group">
            <label>Uitchecken</label>
            <input
              type="date"
              name="check_out"
              value={formData.check_out}
              min={formData.check_in || new Date().toISOString().split("T")[0]}
              onChange={handleChange}
              className="place-booking-input"
            />
          </div>
        </div>

        {totalPrice && nights > 0 && (
          <div className="place-booking-summary">
            <span>
              {nights} nacht{nights !== 1 ? "en" : ""}
            </span>
            <span className="place-booking-price">€{totalPrice}</span>
          </div>
        )}

        <button className="place-booking-btn" onClick={handleSubmit}>
          ✓ Boeking bevestigen
        </button>
      </div>
    </div>
  );
};

export default PlaceBooking;
