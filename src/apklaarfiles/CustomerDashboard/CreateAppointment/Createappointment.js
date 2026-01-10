import React, { useEffect, useState } from 'react';
import './Createappointment.css';
import apiCall from '../../Calls/calls';
import { useToast } from '../../toastmessage/toastmessage';

const CreateAppointment = ({ onClose, carData }) => {
  const [repairs, setRepairs] = useState([]);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [availableMechanics, setAvailableMechanics] = useState([]);
  const [mechanic, setMechanic] = useState('');

  const [selectedReparationID, setSelectedReparationID] = useState(null);
  const [reperationsTypes, setReperationsTypes] = useState([]);
  const [labercostPerHour, setLabercostPerHour] = useState(0);
  const [labortaxRate, setLabortaxRate] = useState(21);

  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState([]);

  const [totalNet, setTotalNet] = useState(0);
  const [totalGross, setTotalGross] = useState(0);
  const [totalLaborTime, setTotalLaborTime] = useState(0);

  const { openToast } = useToast();

  useEffect(() => {
    fetchReparations();
    fetchCars();
    fetchMechanics();
  }, []);

  useEffect(() => {
    calculateTotals();
  }, [repairs, labercostPerHour]);

  const fetchMechanics = async () => {
    const response = await apiCall('fetchmechanics', {});
    if (response.isSuccess) {
      setAvailableMechanics(response.data);
    };
  };

  const fetchCars = async () => {
    const userid = JSON.parse(localStorage.getItem('userdata')).userid;
    const response = await apiCall('getcars', { userid });

    if (response.isSuccess) {
      setCars(response.data);
    }
  }

  const fetchReparations = async () => {
    const response = await apiCall('fetchreparations', {});

    if (response.isSuccess) {
      setReperationsTypes(response.data);
      const laborCost = response.data.find(type => type.reparation === 'Arbeitskosten (per uur)')?.netprice || 0;
      setLabercostPerHour(parseFloat(laborCost));
      const laborTax = response.data.find(type => type.reparation === 'Arbeitskosten (per uur)')?.tax || 21;
      setLabortaxRate(parseFloat(laborTax));
    }
  }

  const addRepair = () => {
    if (!selectedReparationID) return;
    const selectedType = reperationsTypes.find(type => type.id === selectedReparationID);

    if (selectedType) {
      const newRepair = {
        id: selectedType.id,
        repairationType: selectedType.reparation,
        netPrice: parseFloat(selectedType.netprice) || 0,
        tax: parseFloat(selectedType.tax) || 0,
        grossPrice: parseFloat(calculateGrossPrice(selectedType.netprice, selectedType.tax)) || 0,
        laborTime: parseFloat(selectedType.labor_time) || 0  // FIX: Changed from laborTime to labor_time
      };

      setRepairs([...repairs, newRepair]);
    }
  };


  const removeRepair = (index) => {
    setRepairs(repairs.filter((_, i) => i !== index));
  };

  const calculateTotals = () => {
    let netTotal = 0;
    let grossTotal = 0;
    let laborTimeTotal = 0;

    repairs.forEach(repair => {
      netTotal += parseFloat(repair.netPrice) || 0;
      grossTotal += parseFloat(repair.grossPrice) || 0;
      laborTimeTotal += parseFloat(repair.laborTime) || 0;
    });

    const laborCostNet = laborTimeTotal * labercostPerHour;
    const laborCostGross = laborCostNet * 1.21;

    netTotal += laborCostNet;
    grossTotal += laborCostGross;

    setTotalNet(netTotal);
    setTotalGross(grossTotal);
    setTotalLaborTime(laborTimeTotal);
  }

  const calculateGrossPrice = (netPrice, tax) => {
    if (!netPrice || isNaN(netPrice)) return '0.00';
    const gross = parseFloat(netPrice) * (1 + parseFloat(tax) / 100);
    return gross.toFixed(2);
  };

  const handleSubmit = async () => {
    const data = {
      carId: carData?.carid,
      carname: carData?.carnickname,
      appointmentDate,
      appointmentTime,
      userid: JSON.parse(localStorage.getItem('userdata')).userid,
      mechanicid: mechanic,
      carid: selectedCar?.carid,
      repairs: repairs.filter(r => r.repairationType),
      totals: {
        netPrice: totalNet,
        grossPrice: totalGross,
        totalLaborTime
      }
    };

    const response = await apiCall('createAppointment', data);

    if (response.isSuccess) {
      openToast('Afspraak succesvol aangemaakt!');
      onClose();
    } else {
      openToast(response.message || 'Er is een fout opgetreden bij het aanmaken van de afspraak');
    }
  };

  return (
    <div className="repairs-modal-overlay">
      <div className="repairs-modal-container">
        <button onClick={onClose} className="repairs-modal-close">
          ✕
        </button>

        <h2 className="repairs-modal-title">Behandelingen</h2>

        <div className="repairs-modal-content">
          <div className="repairs-section">
            <div className="repairs-type-select">
              <select
                value={selectedReparationID || ''}
                onChange={(e) => setSelectedReparationID(e.target.value)}
                className="repairs-select"
              >
                <option value="">Selecteer een behandeling</option>
                {reperationsTypes.filter((type) => type.reparation !== 'Arbeitskosten (per uur)').map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.reparation}
                  </option>
                ))}
              </select>
              <button onClick={addRepair} className="repairs-add-btn">
                Toevoegen+
              </button>
            </div>

            <div className="repairs-table-container">
              <table className="repairs-table">
                <thead>
                  <tr>
                    <th>Behandeling</th>
                    <th>Kosten</th>
                    <th>BTW</th>
                    <th>Totaal</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {repairs.length > 0 ? (
                    repairs.map((repair, index) => (
                      <tr key={repair.id || index}>
                        <td>
                          <span className="repairs-repairation-type-label">{repair.repairationType}</span>
                        </td>
                        <td>
                          <span>€ {repair.netPrice.toFixed(2)}</span>
                        </td>
                        <td>
                          <span>{repair.tax}%</span>
                        </td>
                        <td className="repairs-price">€{repair.grossPrice.toFixed(2)}</td>
                        <td>
                          <button
                            onClick={() => removeRepair(index)}
                            className="repairs-remove-btn"
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5">Geen behandelingen toegevoegd</td>
                    </tr>
                  )}

                  {totalLaborTime > 0 && (
                    <tr className="repairs-labor-row">
                      <td>Werktijd werknemer ({totalLaborTime.toFixed(0)} UUR)</td>
                      <td>
                        <span>€{(totalLaborTime * labercostPerHour).toFixed(2)}</span>
                      </td>
                      <td>{labortaxRate}%</td>
                      <td className="repairs-price">
                        €{(totalLaborTime * labercostPerHour * (1 + labortaxRate / 100)).toFixed(2)}
                      </td>
                      <td></td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="repairs-note">OPGELET: Werktijd werknemer is een schatting, in het eindfactuur kan dit verschillen met wat hier staat!</div>

            <div className="repairs-total">
              Geschatte bedrag: €{totalGross.toFixed(2)}
            </div>
          </div>

          <div className="repairs-sidebar">
            <div className="repairs-car-info">
              <h3 className="repairs-car-title">Auto</h3>
              <select className="repairs-car-select"
                value={carData?.carid || ''}
                onChange={(e) => {
                  const selected = cars.find(car => car.carid === e.target.value);
                  setSelectedCar(selected);
                }}
              >
                <option value="">Selecteer een auto</option>
                {cars.map((car) => (
                  <option key={car.carid} value={car.carid}>
                    {car.carnickname}
                  </option>
                ))}
              </select>
              <div className="repairs-car-details">
                <div className="repairs-detail-row">
                  <span>Merk</span>
                  <strong>{selectedCar?.brand || ''}</strong>
                </div>
                <div className="repairs-detail-row">
                  <span>Model</span>
                  <strong>{selectedCar?.model || ''}</strong>
                </div>
                <div className="repairs-detail-row">
                  <span>Bouw jaar</span>
                  <strong>{selectedCar?.buildyear || ''}</strong>
                </div>
                <div className="repairs-detail-row">
                  <span>Kenteken</span>
                  <strong>{selectedCar?.licenseplatecountry}{selectedCar?.licenseplate || ''}</strong>
                </div>
                <div className="repairs-detail-row">
                  <span>Laatste keuring</span>
                  <strong>{selectedCar?.lastinspection || ''}</strong>
                </div>
                <div className="repairs-detail-row">
                  <span>Geregistreerd sinds</span>
                  <strong>{selectedCar?.registered_at?.split(' ')[0] || ''}</strong>
                </div>
              </div>
            </div>

            <div className="repairs-appointment">
              <h3 className="repairs-appointment-title">Datum | Tijd</h3>
              <div className="repairs-appointment-form">
                <input
                  type="date"
                  value={appointmentDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  className="repairs-date-input"
                />

                <div className="repairs-time-input">
                  <input
                    type="number"
                    min="8"
                    max="16"
                    placeholder="8"
                    value={appointmentTime.split(':')[0] || ''}
                    onChange={(e) => {
                      const hour = e.target.value.padStart(2, '0');
                      const minute = appointmentTime.split(':')[1] || '00';
                      setAppointmentTime(`${hour}:${minute}`);
                    }}
                    className="repairs-hour-input"
                  />
                  <span>:</span>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    placeholder="00"
                    value={appointmentTime.split(':')[1] || ''}
                    onChange={(e) => {
                      const hour = appointmentTime.split(':')[0] || '00';
                      const minute = e.target.value.padStart(2, '0');
                      setAppointmentTime(`${hour}:${minute}`);
                    }}
                    className="repairs-minute-input"
                  />
                </div>

                <div className="repairs-mechanic-select">
                  <label>Voorkeur monteur <span>(optioneel)</span></label>
                  <select
                    value={mechanic}
                    onChange={(e) => setMechanic(e.target.value)}
                    className="repairs-select choose-mechanic-select"
                  >
                    <option value="">-</option>

                    {availableMechanics.map((mech) => (
                      <option key={mech.userid} value={mech.userid}>
                        {mech.firstname} {mech.lastname}
                      </option>
                    ))}
                  </select>
                </div>

                <button onClick={handleSubmit} className="repairs-submit-btn">
                  Afspraak plannen
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAppointment;