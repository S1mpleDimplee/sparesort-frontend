import React from "react";
import "./Openingstijden.css";

const schedule = [
  { day: "Maandag",   open: "08:00", close: "18:00" },
  { day: "Dinsdag",   open: "08:00", close: "18:00" },
  { day: "Woensdag",  open: "08:00", close: "18:00" },
  { day: "Donderdag", open: "08:00", close: "18:00" },
  { day: "Vrijdag",   open: null,    close: null     },
  { day: "Zaterdag",  open: null,    close: null     },
  { day: "Zondag",    open: null,    close: null     },
].map((row) => ({ ...row, today: row.day === ["Zondag","Maandag","Dinsdag","Woensdag","Donderdag","Vrijdag","Zaterdag"][new Date().getDay()] }));

const extras = [
  { label: "Inchecktijd",   value: "vanaf 15:00" },
  { label: "Uitchecktijd",  value: "voor 11:00"  },
  { label: "Receptie",      value: "08:00 – 18:00" },
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
                    {row.open ? `${row.open} – ${row.close}` : "Gesloten"}
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
