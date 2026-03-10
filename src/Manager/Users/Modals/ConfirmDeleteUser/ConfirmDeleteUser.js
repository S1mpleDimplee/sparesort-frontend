import React, { useState } from "react";
import "./ConfirmDeleteUser.css";

// ConfirmDeleteUser Component
const ConfirmDeleteUser = ({ isOpen, onClose, onConfirm}) => {
  if (!isOpen) return null;

  return (
    <div className="ConfirmDeleteUser-overlay">
      <div className="ConfirmDeleteUser-container">
        <button onClick={onClose} className="ConfirmDeleteUser-close-btn">
          ✕
        </button>

        <h2 className="ConfirmDeleteUser-title">Account verwijderen</h2>

        <div>
          <p className="ConfirmDeleteUser-message">
            Weet je zeker dat je dit account wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.
          </p>
          <button onClick={onConfirm} className="ConfirmDeleteUser-confirm-btn">
            Ja, account verwijderen
          </button>
          <button onClick={onClose} className="ConfirmDeleteUser-cancel-btn">
            Nee, annuleren
          </button>

        </div>
      </div>
    </div >
  );
};

export default ConfirmDeleteUser;