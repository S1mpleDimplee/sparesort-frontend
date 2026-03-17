import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./ManagerLodgeOverview.css";
import apiCall from "../../../Calls/calls";
import { useToast } from "../../../toastmessage/toastmessage";


const Voorzieningen = [
  [
    { key: "gratisWifi", icon: "", text: "Gratis wifi" },
    { key: "airco", icon: "", text: "Airco" },
    { key: "wasmachine", icon: "", text: "Wasmachine" },
    { key: "droger", icon: "", text: "Droger" },
  ],
  [
    { key: "parkeerplaats", icon: "", text: "Parkeerplaats" },
    { key: "bbqBuitenkeuken", icon: "", text: "BBQ / Buitenkeuken" },
    { key: "televisie", icon: "", text: "Televisie" },
    { key: "hottub", icon: "", text: "Hottub" },
  ],
];

const Standard_Voorzieningen = {
  gratisWifi: false, parkeerplaats: false, airco: false,
  wasmachine: false, droger: false, bbqBuitenkeuken: false,
  televisie: false, hottub: false,
};


const Toggle = ({ checked, onChange }) => (
  <div className="lodge-details-toggle-wrapper" onClick={onChange} role="switch" aria-checked={checked}>
    <div className={`lodge-details-toggle-track ${checked ? "on" : "off"}`}>
      <div className={`lodge-details-toggle-knob ${checked ? "on" : "off"}`} />
    </div>
  </div>
);

const Counter = ({ label, value, onChange }) => (
  <div className="lodge-details-counter">
    <span className="lodge-details-label">{label}</span>
    <div className="lodge-details-counter-controls">
      <button className="lodge-details-counter-btn" onClick={() => onChange(Math.max(1, value - 1))}>−</button>
      <span className="lodge-details-counter-value">{value}</span>
      <button className="lodge-details-counter-btn" onClick={() => onChange(value + 1)}>+</button>
    </div>
  </div>
);

const ManagerLodgeOverview = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { openToast } = useToast();
  const fileInputRef = useRef(null);

  const isCreate = id === "nieuw" || !id;

  const [lodgeData, setLodgeData] = useState({
    name: "", priceRegular: "", priceWinter: "",
    visible: true, status: "beschikbaar",
    aantalPersonen: 0, slaapkamers: 0,
  });

  const [voorzieningen, setVoorzieningen] = useState({ ...Standard_Voorzieningen });
  const [extraVoorzieningen, setExtraVoorzieningen] = useState([]);
  const [newVoorziening, setNewVoorziening] = useState("");
  const [description, setDescription] = useState("");
  const [imageBase64, setImageBase64] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    if (!isCreate && id) {
      const fetchLodge = async () => {
        const response = await apiCall("getlodgeinfo", { id });
        if (response.isSuccess) {
          const l = response.data;
          setLodgeData({
            name: l.name,
            priceRegular: l.price,
            priceWinter: l.price_winter,
            visible: l.visable == 1,
            status: l.status,
            aantalPersonen: l.people,
            slaapkamers: l.bedrooms,
          });
          setDescription(l.description ?? "");
          setImagePreview(l.image ? `data:image/jpeg;base64,${l.image}` : "");
        } else {
          openToast(response.message);
        }
      };
      fetchLodge();
    }
  }, [id, isCreate]);

  const updateField = (key, value) => setLodgeData((prev) => ({ ...prev, [key]: value }));

  const toggleVoorziening = (key) => setVoorzieningen((prev) => ({ ...prev, [key]: !prev[key] }));

  const addVoorziening = () => {
    if (newVoorziening.trim()) {
      setExtraVoorzieningen((prev) => [...prev, { id: Date.now(), name: newVoorziening.trim() }]);
      setNewVoorziening("");
    }
  };

  const verwijderExtraVoorziening = (extraId) =>
    setExtraVoorzieningen((prev) => prev.filter((a) => a.id !== extraId));

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImagePreview(URL.createObjectURL(file));

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result.split(",")[1];
      setImageBase64(base64);
    };
    reader.readAsDataURL(file);
  };

  const HandleLodgSaved = async () => {
    const payload = {
      name: lodgeData.name,
      description: description,
      status: lodgeData.status,
      visible: lodgeData.visible ? 1 : 0,
      slaapkamers: lodgeData.slaapkamers,
      aantalPersonen: lodgeData.aantalPersonen,
      priceRegular: lodgeData.priceRegular,
      priceWinter: lodgeData.priceWinter,
      image: imageBase64,
    };

    let response;
    if (isCreate) {
      response = await apiCall("addlodge", { ...payload, lodge_type_id: 1 });
    } else {
      response = await apiCall("updatelodge", { ...payload, id });
    }

    openToast(response.message);
    if (response.isSuccess) {
      setTimeout(() => navigate("/dashboard/lodges"), 500);
    }
  };



  const handleDelete = async () => {
    if (window.confirm("Weet je zeker dat je deze lodge wilt verwijderen?")) {
      const response = await apiCall("deletelodge", { id });
      openToast(response.message);
      if (response.isSuccess) {
        setTimeout(() => navigate("/dashboard/lodges"), 500);
      } 
    }
  }

  return (
    <div className="lodge-details-page">
      <button className="lodge-details-back-btn" onClick={() => navigate("/dashboard/lodges")}>
        ← Terug naar overzicht
      </button>

      <div className="lodge-details-page-header">
        <h1 className="lodge-details-page-title">
          {isCreate ? "Nieuwe lodge aanmaken" : `${lodgeData.name || "Lodge bewerken"}`}
        </h1>
      </div>

      <div className="lodge-details-card">
        <h2 className="lodge-details-section-title">Basis informatie</h2>
        <div className="lodge-details-top-grid">
          <div>
            {imagePreview ? (
              <img src={imagePreview} alt="preview" className="lodge-details-image" />
            ) : lodgeData.image ? (
              <img src={lodgeData.image} alt={lodgeData.name} className="lodge-details-image" />
            ) : (
              <div className="lodge-details-image-placeholder">🏡</div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
            <button className="lodge-details-image-btn" onClick={() => fileInputRef.current.click()}>
              Afbeelding wijzigen
            </button>
          </div>

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

          <div>
            <div className="lodge-details-status-row">
              <span className="lodge-details-status-label">Zichtbaar voor klanten</span>
              <Toggle checked={lodgeData.visible} onChange={() => updateField("visible", !lodgeData.visible)} />
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
              <Counter label="Aantal personen" value={lodgeData.aantalPersonen} onChange={(v) => updateField("aantalPersonen", v)} />
              <Counter label="Slaapkamers" value={lodgeData.slaapkamers} onChange={(v) => updateField("slaapkamers", v)} />
            </div>
          </div>
        </div>
      </div>

      <div className="lodge-details-card">
        <h2 className="lodge-details-section-title">Beschrijving</h2>
        <textarea
          className="lodge-details-textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Beschrijf de lodge, unieke kenmerken, locatie, sfeer..."
        />
      </div>

      {/* <div className="lodge-details-card">
        <h2 className="lodge-details-section-title">Voorzieningen</h2>
        <div className="lodge-details-amenities-grid">
          <div>
            <h4 className="lodge-details-amenities-col-title">Standaard</h4>
            {Voorzieningen[0].map((item) => (
              <div key={item.key} className="lodge-details-voorziening-item">
                <span>{item.icon}</span>
                <span className="lodge-details-voorziening-text">{item.text}</span>
                <input type="checkbox" className="lodge-details-voorziening-checkbox"
                  checked={voorzieningen[item.key]} onChange={() => toggleVoorziening(item.key)} />
              </div>
            ))}
          </div>
          <div>
            <h4 className="lodge-details-amenities-col-title"></h4>
            {Voorzieningen[1].map((item) => (
              <div key={item.key} className="lodge-details-voorziening-item">
                <span>{item.icon}</span>
                <span className="lodge-details-voorziening-text">{item.text}</span>
                <input type="checkbox" className="lodge-details-voorziening-checkbox"
                  checked={voorzieningen[item.key]} onChange={() => toggleVoorziening(item.key)} />
              </div>
            ))}
          </div>
          <div>
            <h4 className="lodge-details-amenities-col-title">Extra voorzieningen</h4>
            {extraVoorzieningen.map((a) => (
              <div key={a.id} className="lodge-details-voorziening-item">
                <span>📋</span>
                <span className="lodge-details-voorziening-text">{a.name}</span>
                <button className="lodge-details-remove-btn" onClick={() => verwijderExtraVoorziening(a.id)}>✖</button>
              </div>
            ))}
            <div className="lodge-details-add-voorziening-row">
              <input
                type="text"
                className="lodge-details-add-input"
                placeholder="Nieuwe voorziening..."
                value={newVoorziening}
                onChange={(e) => setNewVoorziening(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addVoorziening()}
              />
              <button className="lodge-details-add-btn" onClick={addVoorziening}>+</button>
            </div>
          </div>
        </div>
      </div> */}

      <div className="lodge-details-actions">
        {!isCreate && (
          <button className="lodge-details-delete-btn" onClick={handleDelete}>Verwijderen</button>
        )}
        <button className="lodge-details-save-btn" onClick={HandleLodgSaved}>
          {isCreate ? "Lodge aanmaken" : "Wijzigingen opslaan"}
        </button>
      </div>
    </div>
  );
};

export default ManagerLodgeOverview;