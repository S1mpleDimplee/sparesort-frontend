import React, { useState } from "react";
import "./register.css";
import { useNavigate } from "react-router-dom";
import apiCall from "../../Calls/calls";
import { useToast } from "../../toastmessage/toastmessage";
import ConfirmUser from "../../Manager/Users/Modals/ConfirmUser/ConfirmUser";

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    phonenumber: "",
  });

  const [showConfirmUser, setShowConfirmUser] = useState(false);

  const { openToast } = useToast();
  const [countryCode, setCountryCode] = useState("+31");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCountryCodeChange = (e) => {
    setCountryCode(e.target.value);
  };

  const handleSubmit = async () => {
    const verificationcode = Math.floor(100000 + Math.random() * 900000).toString();

    const response = await apiCall("addUser", {
      ...formData,
      phonenumber: countryCode + formData.phonenumber,
    });

    if (response.isSuccess) {
      setShowConfirmUser(true);

      localStorage.setItem("verificationinfo", JSON.stringify({
        email: formData.email,
        userid: response.userid,
        name: formData.firstname
      }));

      localStorage.setItem("userdata", JSON.stringify({
        userid: response.data.userid
      }));

      apiCall("sendverificationmail", {
        email: formData.email,
        name: formData.firstname,
        verificationcode: verificationcode
      });
    }
    else {
      openToast(response.message);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-card slide-up">
          <h2 className="register-title ">Registreren</h2>
          <div className="register-title-underline"></div>

          <div className="register-form">
            <div className="form-group">
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="uwemail@example.com"
                className="form-input-register"
              />
              <label className="form-label-register">
                Voer hier uw voor en achternaam in inclusief tussenvoegsel
              </label>
            </div>

            <div className="form-group">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Wachtwoord"
                className="form-input-register"
              />
              <label className="form-label-register">
                Voer hier uw gewenste wachtwoord in
              </label>
            </div>

            <div className="form-group">
              <div className="phone-group">
                <select
                  value={countryCode}
                  onChange={handleCountryCodeChange}
                  className="phone-select"
                >
                  <option value="+31">🇳🇱 +31</option>
                  <option value="+32">🇧🇪 +32</option>
                  <option value="+49">🇩🇪 +49</option>
                  <option value="+33">🇫🇷 +33</option>
                  <option value="+44">🇬🇧 +44</option>
                </select>
                <input
                  type="text"
                  name="phonenumber"
                  value={formData.phonenumber}
                  onChange={e => {
                    const value = e.target.value.replace(/\D/g, "");
                    setFormData({
                      ...formData,
                      phonenumber: value
                    });
                  }}
                  placeholder="0600000000"
                  className="form-input-register"
                />
              </div>
              <label className="form-label-register">
                Voer hier uw telefoonnummer in
              </label>
            </div>

            <button onClick={handleSubmit} className="register-button">
              Registreren
            </button>

            <div className="register-footer">
              <button
                onClick={() => navigate("/inloggen")}
                className="login-redirect-link"
              >
                Ik heb al een account
              </button>
            </div>
          </div>
        </div>
      </div>
      <ConfirmUser isOpen={showConfirmUser} onClose={() => navigate("/inloggen")} />
    </div>
  );
};

export default Register;