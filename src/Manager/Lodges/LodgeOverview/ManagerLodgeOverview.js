import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./ManagerLodgeOverview.css";

const AMENITY_COLUMNS = [
  [
    { key: "gratisWifi",      icon: "📶", text: "Gratis wifi" },
    { key: "airco",           icon: "❄️", text: "Airco" },
    { key: "wasmachine",      icon: "🧺", text: "Wasmachine" },
    { key: "droger",          icon: "👕", text: "Droger" },
  ],
  [
    { key: "parkeerplaats",   icon: "🚗", text: "Parkeerplaats" },
    { key: "bbqBuitenkeuken", icon: "🍖", text: "BBQ / Buitenkeuken" },
    { key: "televisie",       icon: "📺", text: "Televisie" },
    { key: "hottub",          icon: "🛁", text: "Hottub" },
  ],
];

const DEFAULT_AMENITIES = {
  gratisWifi: false,
  parkeerplaats: false,
  airco: false,
  wasmachine: false,
  droger: false,
  bbqBuitenkeuken: false,
  televisie: false,
  hottub: false,
};

const Toggle = ({ checked, onChange }) => (
  <div
    className="lodge-details-toggle-wrapper"
    onClick={onChange}
    role="switch"
    aria-checked={checked}
  >
    <div className={`lodge-details-toggle-track ${checked ? "on" : "off"}`}>
      <div className={`lodge-details-toggle-knob ${checked ? "on" : "off"}`} />
    </div>
  </div>
);

const Counter = ({ label, value, onChange }) => (
  <div className="lodge-details-counter">
    <span className="lodge-details-label">{label}</span>
    <div className="lodge-details-counter-controls">
      <button
        className="lodge-details-counter-btn"
        onClick={() => onChange(Math.max(1, value - 1))}
      >−</button>
      <span className="lodge-details-counter-value">{value}</span>
      <button
        className="lodge-details-counter-btn"
        onClick={() => onChange(value + 1)}
      >+</button>
    </div>
  </div>
);

const ManagerLodgeOverview = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // "nieuw" = create mode, any other id = edit mode
  const isCreate = id === "nieuw" || !id;

  const [lodgeData, setLodgeData] = useState({
    name: "",
    image: "",
    priceRegular: "",
    priceWinter: "",
    visible: true,
    status: "beschikbaar",
    aantalPersonen: 2,
    slaapkamers: 1,
  });

  const [amenities, setAmenities] = useState({ ...DEFAULT_AMENITIES });
  const [extraAmenities, setExtraAmenities] = useState([]);
  const [newAmenity, setNewAmenity] = useState("");
  const [description, setDescription] = useState("");

  // Fetch lodge by id when editing
  useEffect(() => {
    if (!isCreate && id) {
      // TODO: replace with real API call, e.g.:
      // fetchLodgeById(id).then(data => populate(data));
      //
      // For now we prefill with example data so the form isn't empty:
      setLodgeData({
        name: "Near Cliff Lodge",
        image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600&q=80",
        priceRegular: 430.12,
        priceWinter: 430.12,
        visible: true,
        status: "beschikbaar",
        aantalPersonen: 4,
        slaapkamers: 2,
      });
      setDescription("Lorem ipsum dolor sit amet, consectetur adipiscing elit.");
    }
  }, [id, isCreate]);

  // ── helpers ──────────────────────────────────────────────────────────────────
  const updateField = (key, value) =>
    setLodgeData((prev) => ({ ...prev, [key]: value }));

  const toggleAmenity = (key) =>
    setAmenities((prev) => ({ ...prev, [key]: !prev[key] }));

  const addExtraAmenity = () => {
    if (newAmenity.trim()) {
      setExtraAmenities((prev) => [
        ...prev,
        { id: Date.now(), name: newAmenity.trim() },
      ]);
      setNewAmenity("");
    }
  };

  const removeExtraAmenity = (extraId) =>
    setExtraAmenities((prev) => prev.filter((a) => a.id !== extraId));

  const handleSave = () => {
    const payload = { ...lodgeData, amenities, extraAmenities, description };
    console.log("Opslaan:", payload);
    // TODO: call API, then navigate back
    navigate("/dashboard/lodges");
  };

  const handleDelete = () => {
    if (window.confirm("Weet je zeker dat je deze lodge wilt verwijderen?")) {
      console.log("Verwijder lodge id:", id);
      // TODO: call delete API
      navigate("/dashboard/lodges");
    }
  };

  return (
    <div className="lodge-details-page">
      {/* Back */}
      <button
        className="lodge-details-back-btn"
        onClick={() => navigate("/dashboard/lodges")}
      >
        ← Terug naar overzicht
      </button>

      {/* Title */}
      <div className="lodge-details-page-header">
        <h1 className="lodge-details-page-title">
          {isCreate ? "➕ Nieuwe lodge aanmaken" : `✏️ ${lodgeData.name || "Lodge bewerken"}`}
        </h1>
      </div>

      {/* ── Basis informatie ──────────────────────────────────────────── */}
      <div className="lodge-details-card">
        <h2 className="lodge-details-section-title">Basis informatie</h2>

        <div className="lodge-details-top-grid">
          {/* Image */}
          <div>
            {lodgeData.image ? (
              <img
                src={lodgeData.image}
                alt={lodgeData.name}
                className="lodge-details-image"
              />
            ) : (
              <div className="lodge-details-image-placeholder">🏡</div>
            )}
            <button className="lodge-details-image-btn">📷 Afbeelding wijzigen</button>
          </div>

          {/* Name & prices */}
          <div className="lodge-details-field-group">
            <div>
              <label className="lodge-details-label">Lodge naam *</label>
              <input
                className="lodge-details-input"
                value={lodgeData.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="Bijv. Near Cliff Lodge"
              />
            </div>
            <div className="lodge-details-price-row">
              <div>
                <label className="lodge-details-label">Prijs regulier (€)</label>
                <input
                  className="lodge-details-input"
                  type="number"
                  value={lodgeData.priceRegular}
                  onChange={(e) => updateField("priceRegular", e.target.value)}
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="lodge-details-label">Prijs winter (€)</label>
                <input
                  className="lodge-details-input"
                  type="number"
                  value={lodgeData.priceWinter}
                  onChange={(e) => updateField("priceWinter", e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          {/* Status / visibility / counters */}
          <div>
            <div className="lodge-details-status-row">
              <span className="lodge-details-status-label">Zichtbaar voor klanten</span>
              <Toggle
                checked={lodgeData.visible}
                onChange={() => updateField("visible", !lodgeData.visible)}
              />
            </div>

            <div className="lodge-details-status-row">
              <span className="lodge-details-status-label">Status</span>
              <select
                className="lodge-details-status-select"
                value={lodgeData.status}
                onChange={(e) => updateField("status", e.target.value)}
              >
                <option value="beschikbaar">Beschikbaar</option>
                <option value="bezet">Bezet</option>
                <option value="onderhoud">Onderhoud</option>
              </select>
            </div>

            <div className="lodge-details-counters-row">
              <Counter
                label="Aantal personen"
                value={lodgeData.aantalPersonen}
                onChange={(v) => updateField("aantalPersonen", v)}
              />
              <Counter
                label="Slaapkamers"
                value={lodgeData.slaapkamers}
                onChange={(v) => updateField("slaapkamers", v)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Beschrijving ──────────────────────────────────────────────── */}
      <div className="lodge-details-card">
        <h2 className="lodge-details-section-title">Beschrijving</h2>
        <textarea
          className="lodge-details-textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Beschrijf de lodge, unieke kenmerken, locatie, sfeer..."
        />
      </div>

      {/* ── Voorzieningen ─────────────────────────────────────────────── */}
      <div className="lodge-details-card">
        <h2 className="lodge-details-section-title">Voorzieningen</h2>

        <div className="lodge-details-amenities-grid">
          {/* Column 1 */}
          <div>
            <h4 className="lodge-details-amenities-col-title">Standaard</h4>
            {AMENITY_COLUMNS[0].map((item) => (
              <div key={item.key} className="lodge-details-amenity-item">
                <span>{item.icon}</span>
                <span className="lodge-details-amenity-text">{item.text}</span>
                <input
                  type="checkbox"
                  className="lodge-details-amenity-checkbox"
                  checked={amenities[item.key]}
                  onChange={() => toggleAmenity(item.key)}
                />
              </div>
            ))}
          </div>

          {/* Column 2 */}
          <div>
            <h4 className="lodge-details-amenities-col-title">&nbsp;</h4>
            {AMENITY_COLUMNS[1].map((item) => (
              <div key={item.key} className="lodge-details-amenity-item">
                <span>{item.icon}</span>
                <span className="lodge-details-amenity-text">{item.text}</span>
                <input
                  type="checkbox"
                  className="lodge-details-amenity-checkbox"
                  checked={amenities[item.key]}
                  onChange={() => toggleAmenity(item.key)}
                />
              </div>
            ))}
          </div>

          {/* Column 3 — Extra */}
          <div>
            <h4 className="lodge-details-amenities-col-title">Extra voorzieningen</h4>

            {extraAmenities.map((a) => (
              <div key={a.id} className="lodge-details-amenity-item">
                <span>📋</span>
                <span className="lodge-details-amenity-text">{a.name}</span>
                <button
                  className="lodge-details-remove-btn"
                  onClick={() => removeExtraAmenity(a.id)}
                >✖</button>
              </div>
            ))}

            <div className="lodge-details-add-amenity-row">
              <input
                type="text"
                className="lodge-details-add-input"
                placeholder="Nieuwe voorziening..."
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addExtraAmenity()}
              />
              <button className="lodge-details-add-btn" onClick={addExtraAmenity}>
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Actions ───────────────────────────────────────────────────── */}
      <div className="lodge-details-actions">
        {!isCreate && (
          <button className="lodge-details-delete-btn" onClick={handleDelete}>
            🗑 Verwijderen
          </button>
        )}
        <button className="lodge-details-save-btn" onClick={handleSave}>
          {isCreate ? "✓ Lodge aanmaken" : "✓ Wijzigingen opslaan"}
        </button>
      </div>
    </div>
  );
};

export default ManagerLodgeOverview;
