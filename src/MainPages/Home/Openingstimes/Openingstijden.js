import React from "react";
import "./OpeningsTijden.css";

const schedule = [
  { day: "Maandag",    open: "09:00", close: "18:00", today: false },
  { day: "Dinsdag",    open: "09:00", close: "18:00", today: false },
  { day: "Woensdag",   open: "09:00", close: "18:00", today: false },
  { day: "Donderdag",  open: "09:00", close: "20:00", today: false },
  { day: "Vrijdag",    open: "09:00", close: "20:00", today: true  },
  { day: "Zaterdag",   open: "10:00", close: "17:00", today: false },
  { day: "Zondag",     open: "11:00", close: "16:00", today: false },
];

const extras = [
  { label: "Inchecktijd",   value: "vanaf 15:00" },
  { label: "Uitchecktijd",  value: "voor 11:00"  },
  { label: "Receptie",      value: "09:00 – 20:00" },
  { label: "24/7 Noodlijn", value: "+62 361 000 000" },
];

const OpeningsTijden = () => {
  return (
    <div className="ot-page">
      {/* ── Hero ── */}
      <section className="ot-hero fade-slide">
        <div className="ot-hero-overlay">
          <div className="ot-hero-content">
            <p className="ot-eyebrow fade-in">SPARESORT BALI</p>
            <h1 className="ot-hero-title fade-in">Openingstijden</h1>
            <p className="ot-hero-subtitle fade-in">
              Onze receptie staat voor u klaar — kom gerust langs of neem contact op.
            </p>
          </div>
        </div>
      </section>

      {/* ── Content ── */}
      <section className="ot-section">
        <div className="ot-container">

          {/* Schedule card */}
          <div className="ot-card fade-slide-up">
            <div className="ot-card-header">
              <span className="ot-card-icon">🕐</span>
              <h2 className="ot-card-title">Weekschema receptie</h2>
            </div>

            <ul className="ot-schedule">
              {schedule.map((row) => (
                <li key={row.day} className={`ot-row ${row.today ? "ot-row--today" : ""}`}>
                  <span className="ot-day">
                    {row.day}
                    {row.today && <span className="ot-badge">Vandaag</span>}
                  </span>
                  <span className="ot-divider" />
                  <span className="ot-hours">
                    {row.open} – {row.close}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Extra info cards */}
          <div className="ot-extras fade-slide-up">
            {extras.map((e) => (
              <div key={e.label} className="ot-extra-card">
                <p className="ot-extra-label">{e.label}</p>
                <p className="ot-extra-value">{e.value}</p>
              </div>
            ))}
          </div>

          {/* Notice */}
          <div className="ot-notice fade-slide-up">
            <span className="ot-notice-icon">ℹ️</span>
            <p>
              Buiten openingstijden kunt u ons bereiken via de <strong>24/7 noodlijn</strong>.
              Voor boekingen en algemene vragen raden wij u aan contact op te nemen tijdens
              reguliere openingstijden.
            </p>
          </div>

        </div>
      </section>
    </div>
  );
};

export default OpeningsTijden;
