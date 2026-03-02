import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ManagerLodgeList.css";
// ─── Mock data — replace with real API call ───────────────────────────────────
const MOCK_LODGES = [
  {
    id: 1,
    name: "Near Cliff Lodge",
    image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600&q=80",
    priceRegular: 430.12,
    status: "beschikbaar",
    visible: true,
    aantalPersonen: 4,
    slaapkamers: 2,
  },
  {
    id: 2,
    name: "Forest Retreat",
    image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=600&q=80",
    priceRegular: 310.0,
    status: "bezet",
    visible: true,
    aantalPersonen: 2,
    slaapkamers: 1,
  },
  {
    id: 3,
    name: "Mountain View Cabin",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",
    priceRegular: 560.0,
    status: "onderhoud",
    visible: false,
    aantalPersonen: 6,
    slaapkamers: 3,
  },
  {
    id: 4,
    name: "Lakeside Haven",
    image: "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=600&q=80",
    priceRegular: 275.5,
    status: "beschikbaar",
    visible: true,
    aantalPersonen: 2,
    slaapkamers: 1,
  },
  {
    id: 5,
    name: "Hilltop Escape",
    image: null,
    priceRegular: 195.0,
    status: "beschikbaar",
    visible: true,
    aantalPersonen: 2,
    slaapkamers: 1,
  },
];

const STATUS_LABELS = {
  beschikbaar: "Beschikbaar",
  bezet: "Bezet",
  onderhoud: "Onderhoud",
};

// ─── LodgeCard ────────────────────────────────────────────────────────────────
const LodgeCard = ({ lodge, delay, onEdit }) => (
  <div className="lodge-card" style={{ animationDelay: `${delay}s` }}>
    {lodge.image ? (
      <img src={lodge.image} alt={lodge.name} className="lodge-card-image" />
    ) : (
      <div className="lodge-card-image-placeholder">🏡</div>
    )}

    <div className="lodge-card-body">
      <div className="lodge-card-top-row">
        <h3 className="lodge-card-name">{lodge.name}</h3>
        <span className={`lodge-status-badge ${lodge.status}`}>
          {STATUS_LABELS[lodge.status] ?? lodge.status}
        </span>
      </div>

      <div className="lodge-card-meta">
        <span>👤 {lodge.aantalPersonen} personen</span>
        <span>🛏️ {lodge.slaapkamers} slaapkamer{lodge.slaapkamers !== 1 ? "s" : ""}</span>
      </div>

      <div className="lodge-card-price">
        €{lodge.priceRegular.toFixed(2)}
        <span className="lodge-card-price-sub">/ nacht</span>
      </div>

      <div className="lodge-card-visibility">
        <div className={`lodge-visibility-dot ${lodge.visible ? "visible" : "hidden"}`} />
        {lodge.visible ? "Zichtbaar voor klanten" : "Verborgen voor klanten"}
      </div>

      <div className="lodge-card-actions">
        <button className="lodge-card-edit-btn" onClick={() => onEdit(lodge)}>
          ✏️ Bewerken
        </button>
        <button className="lodge-card-view-btn" onClick={() => onEdit(lodge)}>
          Inzien →
        </button>
      </div>
    </div>
  </div>
);

// ─── Main page ────────────────────────────────────────────────────────────────
const ManagerLodgeList = () => {
  const navigate = useNavigate();
  const [lodges] = useState(MOCK_LODGES);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("alle");

  const filtered = lodges.filter((l) => {
    const matchesSearch = l.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "alle" || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleEdit = (lodge) => navigate(`/dashboard/lodges/${lodge.id}`);
  const handleCreate = () => navigate("/dashboard/lodges/nieuw");

  return (
    <div className="lodge-list-page">
      {/* Header */}
      <div className="lodge-list-header">
        <div>
          <h1 className="lodge-list-title">🏡 Lodges</h1>
          <p className="lodge-list-subtitle">Beheer al je lodges op één plek</p>
        </div>
        <button className="lodge-list-create-btn" onClick={handleCreate}>
          + Nieuwe lodge
        </button>
      </div>

      {/* Filters */}
      <div className="lodge-list-filters">
        <input
          type="text"
          className="lodge-list-search"
          placeholder="🔍  Zoek op naam..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="lodge-list-filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="alle">Alle statussen</option>
          <option value="beschikbaar">Beschikbaar</option>
          <option value="bezet">Bezet</option>
          <option value="onderhoud">Onderhoud</option>
        </select>
      </div>

      <p className="lodge-list-count">
        {filtered.length} lodge{filtered.length !== 1 ? "s" : ""} gevonden
      </p>

      {/* Grid */}
      <div className="lodge-list-grid">
        {filtered.length > 0 ? (
          filtered.map((lodge, i) => (
            <LodgeCard
              key={lodge.id}
              lodge={lodge}
              delay={i * 0.07}
              onEdit={handleEdit}
            />
          ))
        ) : (
          <div className="lodge-list-empty">
            <div className="lodge-list-empty-icon">🏜️</div>
            <p>Geen lodges gevonden voor deze zoekopdracht.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerLodgeList;