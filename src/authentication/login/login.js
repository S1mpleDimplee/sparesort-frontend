import React, { useState } from "react";
import "./login.css";
import { useNavigate } from "react-router-dom";
import apiCall from "../../Calls/calls";
import { useToast } from "../../toastmessage/toastmessage";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { openToast } = useToast();

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    const response = await apiCall("loginuser", formData);

    if (response.isSuccess) {
      openToast(response.message);
      localStorage.setItem("userdata", JSON.stringify(response.data));
      setTimeout(() => {
        navigate("/dashboard");
      }, 500);
    } else {
      openToast(response.message);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <h2 className="login-title">Inloggen</h2>
          <div className="title-underline"></div>

          <div className="login-form">
            <div className="form-group">
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Bijv. Klaas van den Hof"
                className="form-input-login"
              />
              <label className="form-label-login">
                Vaar hier uw voor en achternaam in (inclusief tussenvoegsels)
              </label>
            </div>

            <div className="form-group">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="EenSterkWachtwoord123"
                className="form-input-login"
              />
              <label className="form-label-login">
                Herhaal hier uw wachtwoord
              </label>
            </div>

            <button onClick={handleSubmit} className="login-button">
              Inloggen
            </button>

            <div className="login-footer">
              <button
                className="forgot-password-link"
                onClick={() => navigate("/registreren")}
              >
                Ik heb heb nog geen accountc
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
