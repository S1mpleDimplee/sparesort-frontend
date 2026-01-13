import React, { useEffect, useState } from 'react';
import './verify.css';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../toastmessage/toastmessage';
import apiCall from '../../Calls/calls';

const Verify = () => {
  const [verificationCode, setVerificationCode] = useState('');

  const { openToast } = useToast();

  const navigate = useNavigate();


  const email = JSON.parse(localStorage.getItem('verificationinfo')).email;
  const userid = JSON.parse(localStorage.getItem('userdata')).userid;
  const name = JSON.parse(localStorage.getItem('verificationinfo')).name;

  const handleCodeChange = (e) => {
    // Only allow numbers and format as XX-XX-XX
    let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length <= 6) {
      // Format as XX-XX-XX
      if (value.length > 2 && value.length <= 4) {
        value = value.slice(0, 2) + '-' + value.slice(2);
      } else if (value.length > 4) {
        value = value.slice(0, 2) + '-' + value.slice(2, 4) + '-' + value.slice(4);
      }
      setVerificationCode(value);
    }
  };

  const handleSubmit = async () => {
    const response = await apiCall("checkverificationcode", {
      email: email,
      code: verificationCode.replace(/-/g, ''),
      userid: userid
    });

    if (response.isSuccess) {
      openToast('E-mail succesvol geverifieerd! U wordt nu doorgestuurd naar de inlogpagina.');
      navigate('/inloggen');
    } else {
      openToast(response.message);
      return;
    }
  };

  const handleResendCode = () => {
    apiCall("sendverificationcode", {
      email: email,
      name: name
    });
    openToast('Een nieuwe verificatiecode is verzonden naar uw e-mailadres.');
  };

  return (
    <div className="verification-page">
      <div className="verification-container">
        <div className="verification-card">
          <h2 className="verification-title">Verficatie</h2>
          <div className="title-underline"></div>

          <div className="verification-content">
            <p className="verification-message">
              Er is een 6-cijferige code gestuurd naar
              voer deze in om uw e-mailadres te verifiëren.
            </p>
            <p className="email-address">{email}</p>

            <div className="code-input-container">
              <input
                type="text"
                value={verificationCode}
                onChange={handleCodeChange}
                placeholder="67-02-12"
                className="code-input"
                maxLength="8" // XX-XX-XX format
              />
            </div>

            <button onClick={handleSubmit} className="verify-button">
              Inloggen
            </button>

            <div className="verification-footer">
              <p className="resend-text">Geen code ontvangen?</p>
              <button onClick={handleResendCode} className="resend-button">
                Code opnieuw versturen
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verify;