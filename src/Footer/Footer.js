import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* APKKlaar Section */}
          <div className="footer-section apk-section">
            <h3 className="footer-title">APKKlaar</h3>
            <p className="footer-description">
              Bij Spa Resort Bali maakt u uw vakantie compleet.
              Met een perfecte balans tussen ontspanning en plezier.
              Slaap in een van onze hotel kamers, geniet van de wellness faciliteiten
            </p>
          </div>

          {/* Snelle links Section */}
          <div className="footer-section">
            <h3 className="footer-title">Snelle links</h3>
            <ul className="footer-links">
              <li>
                <a href="#" className="footer-link">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Over Ons
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="footer-section">
            <h3 className="footer-title">Contact</h3>
            <div className="contact-info">
              <div className="contact-item">
                <span className="contact-icon location">📍</span>
                <span className="contact-text">
                  Hoofdstraat 123, Hengelo
                </span>
              </div>
              <div className="contact-item">
                <span className="contact-icon email">📧</span>
                <a
                  href="mailto:info@apkklaar.nl"
                  className="contact-link"
                >
                  info@apkklaar.nl
                </a>
              </div>
            </div>
          </div>

          {/* Openingstijden Section */}
          <div className="footer-section">
            <h3 className="footer-title">Openingstijden</h3>
            <div className="opening-hours">
              <div className="hours-item">Maandag: 8:00 - 18:00</div>
              <div className="hours-item">Dinsdag: 8:00 - 18:00</div>
              <div className="hours-item">Woensdag: 8:00 - 18:00</div>
              <div className="hours-item">Donderdag: 8:00 - 18:00</div>
              <div className="hours-item">Vr-Za-Zo: Gesloten</div>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="footer-copyright">
          <p className="copyright-text">
            © 2025 APKklaar. Alle rechten voorbehouden.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;