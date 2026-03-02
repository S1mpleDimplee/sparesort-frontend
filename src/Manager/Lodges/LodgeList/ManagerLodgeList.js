import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ManagerLodgeList.css";
import apiCall from "../../../Calls/calls";
import { useToast } from "../../../toastmessage/toastmessage";

const type_of_status = {
  beschikbaar: "Beschikbaar",
  bezet: "Bezet",
  onderhoud: "Onderhoud",
};

const LodgeCard = ({ lodge, delay, onEdit }) => (
  <div className="manager-card" style={{ animationDelay: `${delay}s` }}>
    {lodge.image ? (
      <img src={`data:image/jpeg;base64,${lodge.image}`} alt={lodge.name} className="manager-card-image" />
    ) : (
      <div className="manager-card-image-placeholder">🏡</div>
    )}

    <div className="manager-card-body">
      <div className="manager-card-top-row">
        <h3 className="manager-card-name">{lodge.name}</h3>
        <span className={`manager-status-badge ${lodge.status}`}>
          {type_of_status[lodge.status] ?? lodge.status}
        </span>
      </div>

      <div className="manager-card-meta">
        <span>👤 {lodge.people} personen</span>
        <span>🛏️ {lodge.bedrooms} slaapkamer{lodge.bedrooms !== 1 ? "s" : ""}</span>
      </div>

      <div className="manager-card-price">
        €{parseFloat(lodge.price).toFixed(2)}
        <span className="manager-card-price-sub">/ nacht</span>
      </div>

      <div className="manager-card-visibility">
        <div className={`manager-visibility-dot ${lodge.visable ? "visible" : "hidden"}`} />
        {lodge.visable ? "Zichtbaar voor klanten" : "Verborgen voor klanten"}
      </div>

      <div className="manager-card-actions">
        <button className="manager-card-edit-btn" onClick={() => onEdit(lodge)}>✏️ Bewerken</button>
        <button className="manager-card-view-btn" onClick={() => onEdit(lodge)}>Inzien →</button>
      </div>
    </div>
  </div>
);

const ManagerLodgeList = () => {
  const navigate = useNavigate();
  const { openToast } = useToast();
  const [lodges, setLodges] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("alle");

  useEffect(() => {
    const fetchLodges = async () => {
      const response = await apiCall("getalllodges", {});
      if (response.isSuccess) {
        setLodges(response.data);
      } else {
        openToast(response.message);
      }
    };
    fetchLodges();
  }, []);

  const filtered = lodges.filter((l) => {
    const matchesSearch = l.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "alle" || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleEdit = (lodge) => navigate(`/dashboard/lodges/${lodge.id}`);
  const handleCreate = () => navigate("/dashboard/lodges/nieuw");

  return (
    <div className="manager-list-page">
      <div className="manager-list-header">
        <div>
          <h1 className="manager-list-title">🏡 Lodges</h1>
          <p className="manager-list-subtitle">Beheer al je lodges op één plek</p>
        </div>
        <button className="manager-list-create-btn" onClick={handleCreate}>+ Nieuwe lodge</button>
      </div>

      <div className="manager-list-filters">
        <input
          type="text"
          className="manager-list-search"
          placeholder="Zoek op naam..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="manager-list-filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="alle">Alle statussen</option>
          <option value="beschikbaar">Beschikbaar</option>
          <option value="bezet">Bezet</option>
          <option value="onderhoud">Onderhoud</option>
        </select>
      </div>

      <p className="manager-list-count">
        {filtered.length} lodge{filtered.length !== 1 ? "s" : ""} gevonden
      </p>

      <div className="manager-list-grid">
        {filtered.length > 0 ? (
          filtered.map((lodge, i) => (
            <LodgeCard key={lodge.id} lodge={lodge} delay={i * 0.07} onEdit={handleEdit} />
          ))
        ) : (
          <div className="manager-list-empty">
            <p>Geen lodges gevonden voor deze zoekopdracht, of er zijn nog geen lodges aangemaakt.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerLodgeList;