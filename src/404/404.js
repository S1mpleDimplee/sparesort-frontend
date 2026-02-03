import React from 'react';
import { useNavigate } from 'react-router-dom';
import './404.css';

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="notfound-container">
      <div className="notfound-overlay">
        <div className="notfound-content slide-up">
          <h1 className="notfound-title">404</h1>
          <div className="notfound-underline"></div>
          <p className="notfound-text">Deze pagina bestaat niet!</p>
          <p className="notfound-text">
            Komt dit vaker voor? mail ons via{' '}
            <a href="mailto:email@email.com" className="notfound-email">
              email@email.com
            </a>
          </p>
          <button className="notfound-button" onClick={handleGoBack}>
            Ga terug
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;