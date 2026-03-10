import React, { useState } from "react";
import "./ConfirmUser.css";

// ConfirmUser Component
const ConfirmUser = ({ isOpen, onClose, onConfirm}) => {
  if (!isOpen) return null;

  return (
    <div className="ConfirmUser-overlay">
      <div className="ConfirmUser-container">
        <button onClick={onClose} className="ConfirmUser-close-btn">
          ✕
        </button>

        <h2 className="ConfirmUser-title">Acount aangemaakt</h2>

        <div>
          <p className="ConfirmUser-message">
            Je account is succesvol aangemaakt.
            Verifieer je e-mailadres door op de link in de bevestigingsmail te klikken die we zojuist naar je hebben gestuurd. 
            Als je de mail niet ziet, controleer dan je spamfolder.
          </p>
          <button onClick={onClose} className="ConfirmUser-cancel-btn">
            confirm
          </button>
        </div>
      </div>
    </div >
  );
};

export default ConfirmUser;