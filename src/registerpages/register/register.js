import React, { useState } from "react";
import "./register.css";
import { useNavigate } from "react-router-dom";
import apiCall from "../../Calls/calls";
import { useToast } from "../../toastmessage/toastmessage";

const Register = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    country: "",
    city: "",
    postcode: "",
    streetname: "",
    addition: "",
    housenumber: "",
    phonenumber: "",
  });


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
    const response = await apiCall("addUser", {
      ...formData,
      phonenumber: countryCode + formData.phonenumber,
    });

    if (response.isSuccess) {
      openToast(response.message);

      localStorage.setItem("verificationinfo", JSON.stringify({
        email: formData.email,
        userid: response.userid,
        name: formData.firstname
      }));

      localStorage.setItem("userdata", JSON.stringify({
        userid: response.data.userid
      }));

      apiCall("sendverificationcode", {
        email: formData.email,
        name: formData.firstname,
      });

      setTimeout(() => {
        navigate("/verificatie");
      }, 500);
    }
    else {
      openToast(response.message);
    }
  };


  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-card">
          <h2 className="register-title">Maak een account aan</h2>
          <div className="title-underline"></div>

          <div className="register-form">
            <div className="form-columns">
              {/* Left Column - Personal Information */}
              <div className="form-column personal-info">

                <div className="form-group">
                  <input
                    type="text"
                    name="firstname"
                    value={formData.firstname}
                    onChange={handleChange}
                    placeholder="Voornaam"
                    className="form-input-register"
                  />
                  <label className="form-label-register">Voer hier uw voornaam in</label>
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleChange}
                    placeholder="Achternaam"
                    className="form-input-register"
                  />
                  <label className="form-label-register">
                    Voer hier uw achternaam in (inclusief tussenvoegsels)
                  </label>
                </div>

                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="uwemailadres@gmail.com"
                    className="form-input-register"
                  />
                  <label className="form-label-register">
                    Voer hier uw email adres in
                  </label>
                </div>

                <div className="form-group">
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="EenSterkWachtwoord123"
                    className="form-input-register"
                  />
                  <label className="form-label-register">
                    Minimaal 8 karakters waarvan 1 hoofdletter en 1 cijfer
                  </label>
                </div>

                <div className="form-group">
                  <div className="phone-group">
                    <select
                      value={countryCode}
                      onChange={handleCountryCodeChange}
                      className="phone-select"
                    >
                      <option value="+31">+31</option>
                      <option value="+32">+32</option>
                      <option value="+49">+49</option>
                      <option value="+33">+33</option>
                      <option value="+44">+44</option>
                    </select>
                    <input
                      type="tel"
                      name="phonenumber"
                      value={formData.phonenumber}
                      onChange={handleChange}
                      placeholder="0612345789"
                      className="form-input-register"
                    />
                  </div>
                  <label className="form-label-register">
                    Voer hier uw telefoonnummer in
                  </label>
                </div>
              </div>

              {/* Right Column - Address Information */}
              <div className="form-column address-info">

                <div className="form-group">
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="Land"
                    className="form-input-register"
                  />
                  <label className="form-label-register">Voer hier uw land in</label>
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Stad"
                    className="form-input-register"
                  />
                  <label className="form-label-register">Voer hier uw stad in</label>
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    name="postcode"
                    value={formData.postcode}
                    onChange={handleChange}
                    placeholder="Postcode"
                    className="form-input-register"
                  />
                  <label className="form-label-register">
                    Voer hier uw postcode in zoals 1234XX
                  </label>
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    name="streetname"
                    value={formData.streetname}
                    onChange={handleChange}
                    placeholder="Straatnaam"
                    className="form-input-register"
                  />
                  <label className="form-label-register">
                    Voer hier uw huidige straatnaam in
                  </label>
                </div>

                <div className="form-group-row">
                  <div className="form-group">
                    <input
                      type="text"
                      name="housenumber"
                      value={formData.housenumber}
                      onChange={handleChange}
                      placeholder="Huisnummer"
                      className="form-input-register"
                    />
                    <label className="form-label-register">Voer hier uw huisnummer in</label>
                  </div>

                  <div className="form-group">
                    <input
                      type="text"
                      name="addition"
                      value={formData.addition}
                      onChange={handleChange}
                      placeholder="Toevoeging"
                      className="form-input-register"
                    />
                    <label className="form-label-register">
                      Voer hier het tussenvoegsel in
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="button-row">
              <button onClick={handleSubmit} className="register-button">
                Registreren
              </button>
            </div>

            {/* Footer */}
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
    </div>
  );
};

export default Register;