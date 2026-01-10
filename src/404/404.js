import React, { use } from "react";
import "./404.css";
import { useNavigate } from "react-router-dom";

const NotFound = () => {

    const navigate = useNavigate();
    return (
        <div className="not-found-container">
            <h1 className="not-found-title">404</h1>
            <p className="not-found-message">Pagina niet gevonden!</p>
            <a onClick={() => navigate(-1)} className="not-found-link">Terug</a>
        </div>
    );
};

export default NotFound;