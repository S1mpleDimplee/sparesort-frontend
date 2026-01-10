import React, { useEffect, useState } from 'react';
import './CarDetails.css';
import AddCar from '../Modals/AddCar/AddCar';
import apiCall from '../../Calls/calls';
import { useToast } from '../../toastmessage/toastmessage';


const CarDetails = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [editedCarDetails, setEditedCarDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const { openToast } = useToast();

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      setLoading(true);
      const userdata = JSON.parse(localStorage.getItem('userdata'));

      if (!userdata || !userdata.userid) {
        openToast('Gebruiker niet gevonden. Log opnieuw in.');
        setLoading(false);
        return;
      }

      const response = await apiCall('getcars', { userid: userdata.userid });


      if (response.isSuccess) {
        setCars(response.data);
        if (response.data.length > 0) {
          setSelectedCar(response.data[0]);
        }
      } else {
        openToast(response.message || 'Fout bij ophalen auto\'s');
      }
    } catch (error) {
      console.error('Error fetching cars:', error);
      openToast('Er is een fout opgetreden bij het ophalen van auto\'s');
    } finally {
      setLoading(false);
    }
  };

  const editCar = async () => {
    const response = await apiCall('editcar', editedCarDetails);
    if (response.isSuccess) {
      openToast(response.message || 'Auto informatie bijgewerkt');
      setIsEditing(false);
      fetchCars();
    } else {
      openToast(response.message || 'Fout bij bijwerken auto informatie');
    }
  }

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    fetchCars();
  };

  const handleCarAdded = () => {
    fetchCars();
    handleClosePopup();
  };

  const handleSelectCar = (car) => {
    setSelectedCar(car);
  };

  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDeleteCar = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      openToast("Weet je zeker dat je deze auto wilt verwijderen? Klik nogmaals om te bevestigen.");
    } else {
      let carid = selectedCar.carid;
      let userid = JSON.parse(localStorage.getItem('userdata')).userid;
      let carname = selectedCar.carnickname || `${selectedCar.brand} ${selectedCar.model}`;

      const response = await apiCall('removecar', { carid, userid, carname });
      if (response.isSuccess) {
        openToast('Auto succesvol verwijderd');
        fetchCars();
      } else {
        openToast(response.message);
      }
      setConfirmDelete(false);
    }
  };


  useEffect(() => {
    const timer = setTimeout(() => setConfirmDelete(false), 3000);
    return () => clearTimeout(timer);
  }, [confirmDelete]);

  const formatDate = (dateString) => {
    if (!dateString || dateString === '0000-00-00') {
      return 'Niet ingevuld';
    }
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const formatYear = (dateString) => {
    if (!dateString || dateString === '0000-00-00') {
      return 'Onbekend';
    }
    const date = new Date(dateString);
    return date.getFullYear();
  };


  if (loading) {
    return (
      <div className="car-main-content">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          Laden...
        </div>
      </div>
    );
  }

  if (cars.length === 0) {
    return (
      <div className="car-main-content">
        <div className="car-content-grid">
          <div className="car-left-section">
            <h2>Geen auto's gevonden</h2>
            <p>U heeft nog geen auto's geregistreerd.</p>
            <button onClick={handleOpenPopup} className="car-modify-btn">
              Registreer je eerste auto
            </button>
          </div>
        </div>
        {isPopupOpen && (
          <AddCar
            isOpen={isPopupOpen}
            onClose={handleClosePopup}
            onCarAdded={handleCarAdded}
          />
        )}
      </div>
    );
  }

  return (
    <div className="car-main-content">
      <div className="car-content-grid">
        <div className="car-left-section">
          {/* Car Tabs */}
          <div className="car-tabs">
            {cars.map((car) => (
              <div
                key={car.carid}
                className={`car-tab ${selectedCar?.carid === car.carid ? 'active' : ''}`}
                onClick={() => { !isEditing && handleSelectCar(car) }}
              >
                {car.carnickname || `${car.brand} ${car.model}`}
              </div>
            ))}
          </div>



          <div className="car-image-container">
            <img
              src={selectedCar?.carimage || "https://placehold.co/500x230"}
              alt={`${selectedCar?.brand} ${selectedCar?.model}`}
              className="car-image"
            />
          </div>

          {selectedCar && (
            <div className="car-details-table">
              <div className="car-detail-row">
                <span className="car-detail-label">Merk</span>
                {isEditing ? (
                  <input
                    type="text"
                    className="car-detail-input"
                    value={editedCarDetails.brand}
                    onChange={(e) => setEditedCarDetails({ ...editedCarDetails, brand: e.target.value })}
                  />
                ) : (
                  <span className="car-detail-value">{selectedCar.brand}</span>
                )}
              </div>
              <div className="car-detail-row">
                <span className="car-detail-label">Model</span>
                {isEditing ? (
                  <input
                    type="text"
                    className="car-detail-input"
                    value={editedCarDetails.model}
                    onChange={(e) => setEditedCarDetails({ ...editedCarDetails, model: e.target.value })}
                  />
                ) : (
                  <span className="car-detail-value">{selectedCar.model}</span>
                )}
              </div>
              <div className="car-detail-row">
                <span className="car-detail-label">Bouw jaar</span>
                {isEditing ? (
                  <input
                    type="text"
                    className="car-detail-input"
                    value={editedCarDetails.buildyear}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      setEditedCarDetails({ ...editedCarDetails, buildyear: value });
                    }}
                  />
                ) : (
                  <span className="car-detail-value">{formatYear(selectedCar.buildyear)}</span>
                )}
              </div>
              <div className="car-detail-row">
                <span className="car-detail-label">Kenteken</span>
                <span className="car-detail-value">
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        className="car-detail-input"
                        value={editedCarDetails.licenseplatecountry}
                        onChange={(e) => setEditedCarDetails({ ...editedCarDetails, licenseplatecountry: e.target.value })}
                      />
                      <input
                        type="text"
                        className="car-detail-input"
                        value={editedCarDetails.licenseplate}
                        onChange={(e) => setEditedCarDetails({ ...editedCarDetails, licenseplate: e.target.value })}
                      />
                    </>
                  ) : (
                    <>
                      {selectedCar.licenseplatecountry} - {selectedCar.licenseplate}
                    </>
                  )}
                </span>
              </div>
              <div className="car-detail-row">
                <span className="car-detail-label">Laatste keuring</span>
                <span className="car-detail-value">{formatDate(selectedCar.lastinspection)}</span>
              </div>
              <div className="car-detail-row">
                <span className="car-detail-label">Geregistreerd sinds</span>
                <span className="car-detail-value">{formatDate(selectedCar.registered_at)}</span>
              </div>
            </div>
          )}

          <div className='inline-buttons'>
            {isEditing ? (
              <>
                <button className="car-modify-btn" onClick={() => editCar()}>Opslaan</button>
                <p className='remove-car-button' onClick={() => setIsEditing(false)}>Bewerken afbreken</p>
              </>
            ) : (
              <>
                <button className="car-modify-btn" onClick={() => {
                  setIsEditing(true)
                  setEditedCarDetails(selectedCar);
                }}>Informatie wijzigen</button>
                <p className='remove-car-button' onClick={() => handleDeleteCar()}>Auto verwijderen</p>
              </>)}
          </div>
        </div>

        {/* Right Side - Car Info */}
        <div className="car-right-section">
          {selectedCar && (
            <div className="car-info-card">
              <div className="car-logo">
                <div className="car-logo-icon">🚗</div>
                <span className="car-logo-text">
                  {selectedCar.carnickname || selectedCar.brand}
                </span>
              </div>

              <h2 className="car-title">
                {selectedCar.brand} {selectedCar.model} {formatYear(selectedCar.buildyear)}
              </h2>
              <p className="car-subtitle">
                {selectedCar.color} | {selectedCar.fueltype} | {selectedCar.licenseplate}
              </p>
            </div>
          )}



          <div className="car-extra-details-section">

            {selectedCar && (
              <div className="car-details-table">
                <div className="car-detail-row">
                  <span className="car-detail-label">Auto bijnaam</span>
                  {isEditing ? (
                    <input
                      type="text"
                      className="car-detail-input"
                      value={editedCarDetails.carnickname || ''}
                      onChange={(e) => setEditedCarDetails({ ...editedCarDetails, carnickname: e.target.value })}
                    />
                  ) : (
                    <span className="car-detail-value">{selectedCar.carnickname}</span>
                  )}
                </div>
                <div className="car-detail-row">
                  <span className="car-detail-label">Kleur</span>
                  {isEditing ? (
                    <input
                      type="text"
                      className="car-detail-input"
                      value={editedCarDetails.color}
                      onChange={(e) => setEditedCarDetails({ ...editedCarDetails, color: e.target.value })}
                    />
                  ) : (
                    <span className="car-detail-value">{selectedCar.color}</span>
                  )}
                </div>
                <div className="car-detail-row">
                  <span className="car-detail-label">Brandstof</span>
                  {isEditing ? (
                    <input
                      type="text"
                      className="car-detail-input"
                      value={editedCarDetails.fueltype}
                      onChange={(e) => setEditedCarDetails({ ...editedCarDetails, fueltype: e.target.value })}
                    />
                  ) : (
                    <span className="car-detail-value">{selectedCar.fueltype}</span>
                  )}
                </div>
              </div>
            )}

          </div>
          <div className="car-register-prompt">
            <span>Wilt u nog een auto registeren? </span>
            <a onClick={handleOpenPopup} className="car-register-link">
              klik hier
            </a>
          </div>
        </div>
      </div>

      {isPopupOpen && (
        <AddCar
          isOpen={isPopupOpen}
          onClose={handleClosePopup}
          onCarAdded={handleCarAdded}
        />
      )}
    </div>
  );
};

export default CarDetails;