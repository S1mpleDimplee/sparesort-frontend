import React, { useEffect, useState, useRef } from "react";
import "./verify.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "../../toastmessage/toastmessage";
import apiCall from "../../Calls/calls";

const Verify = () => {
  const [searchParams] = useSearchParams();
  const verificationcodeFromUrl = searchParams.get("verificationcode");
  const emailFromUrl = searchParams.get("email");

  const [verificationCode, setVerificationCode] = useState("");
  const [linkResult, setLinkResult] = useState(null); // null | 'loading' | { success, message }
  const linkConfirmStarted = useRef(false);

  const { openToast } = useToast();
  const navigate = useNavigate();

  const userdata = (() => {
    try {
      return JSON.parse(localStorage.getItem("userdata") || "null");
    } catch {
      return null;
    }
  })();
  const verificationinfo = (() => {
    try {
      return JSON.parse(localStorage.getItem("verificationinfo") || "null");
    } catch {
      return null;
    }
  })();
  const userid = userdata?.userid;
  const name = verificationinfo?.name ?? "";
  const email = emailFromUrl || verificationinfo?.email || "";

  // Als er een link met code en email is: direct bevestigen via API
  useEffect(() => {
    if (!verificationcodeFromUrl || !emailFromUrl || linkConfirmStarted.current)
      return;
    linkConfirmStarted.current = true;
    setLinkResult("loading");

    const confirm = async () => {
      const response = await apiCall("confirmemailwithlink", {
        email: emailFromUrl,
        verificationcode: verificationcodeFromUrl,
      });
      setLinkResult({
        success: response.isSuccess,
        message: response.message,
      });
      if (response.isSuccess) {
        openToast(response.message);
      }
    };
    confirm();
  }, [verificationcodeFromUrl, emailFromUrl, openToast]);

  const handleCodeChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length <= 6) {
      if (value.length > 2 && value.length <= 4) {
        value = value.slice(0, 2) + "-" + value.slice(2);
      } else if (value.length > 4) {
        value =
          value.slice(0, 2) + "-" + value.slice(2, 4) + "-" + value.slice(4);
      }
      setVerificationCode(value);
    }
  };

  const handleSubmit = async () => {
    const response = await apiCall("checkverificationcode", {
      email: email,
      code: verificationCode.replace(/-/g, ""),
      userid: userid,
    });

    if (response.isSuccess) {
      openToast(
        "E-mail succesvol geverifieerd! U wordt nu doorgestuurd naar de inlogpagina.",
      );
      localStorage.removeItem("userdata");
      navigate("/inloggen");
    } else {
      openToast(response.message);
    }
  };

  const handleResendCode = () => {
    apiCall("sendverificationmail", {
      email: email,
      name: name,
      verificationcode: Math.floor(100000 + Math.random() * 900000).toString(),
    });
    openToast("Een nieuwe verificatielink is verzonden naar uw e-mailadres.");
  };

  const goToLogin = () => {
    localStorage.removeItem("userdata");
    navigate("/inloggen");
  };

  // Bevestiging via link: toon alleen resultaat op het scherm
  if (verificationcodeFromUrl && emailFromUrl) {
    return (
      <div className="verification-page">
        <div className="verification-container">
          <div className="verification-card">
            <h2 className="verification-title">E-mail bevestigen</h2>
            <div className="title-underline"></div>
            <div className="verification-content">
              {linkResult === "loading" && (
                <p className="verification-message">Bezig met bevestigen...</p>
              )}
              {linkResult && linkResult !== "loading" && (
                <>
                  <p
                    className={`result-message ${linkResult.success ? "result-success" : "result-error"}`}
                  >
                    {linkResult.message}
                  </p>
                  {linkResult.success && (
                    <button onClick={goToLogin} className="verify-button">
                      Naar inloggen
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Geen link: handmatige code-invoer (als ze net geregistreerd hebben)
  if (!email) {
    return (
      <div className="verification-page">
        <div className="verification-container">
          <div className="verification-card">
            <h2 className="verification-title">Verificatie</h2>
            <div className="title-underline"></div>
            <p className="verification-message">
              Gebruik de link uit uw e-mail om uw adres te bevestigen. Klik in
              de mail op de verificatielink.
            </p>
            <button
              onClick={() => navigate("/inloggen")}
              className="verify-button"
            >
              Naar inloggen
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="verification-page">
      <div className="verification-container">
        <div className="verification-card">
          <h2 className="verification-title">Verificatie</h2>
          <div className="title-underline"></div>

          <div className="verification-content">
            <p className="verification-message">
              Er is een 6-cijferige code gestuurd naar uw e-mail. Voer deze in,
              of klik op de link in de e-mail.
            </p>
            <p className="email-address">{email}</p>

            <div className="code-input-container">
              <input
                type="text"
                value={verificationCode}
                onChange={handleCodeChange}
                placeholder="67-02-12"
                className="code-input"
                maxLength="8"
              />
            </div>

            <button onClick={handleSubmit} className="verify-button">
              Bevestigen
            </button>

            <div className="verification-footer">
              <p className="resend-text">Geen code ontvangen?</p>
              <button onClick={handleResendCode} className="resend-button">
                Verificatielink opnieuw versturen
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verify;
