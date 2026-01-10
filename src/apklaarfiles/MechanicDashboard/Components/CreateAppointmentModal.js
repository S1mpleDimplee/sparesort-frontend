import React, { useState } from 'react';
import postCall from '../../Calls/calls';
import { useToast } from '../../toastmessage/toastmessage';

const CreateAppointmentModal = ({ isOpen, onClose, date, startTime, refreshAppointments }) => {
  const { openToast } = useToast();
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async () => {
    try {
      const loggedInData = JSON.parse(localStorage.getItem('loggedInData'));
      const response = await postCall('createappointment', {
        userid: loggedInData.userid,
        repid: 1,       // replace with selected mechanic id
        moid: 1,        // replace with selected car id
        apk: 1,         // example: set 1 for APK, 0 for repair
        note,
        time: startTime,
        date,
        duration: 1     // duration in hours
      });

      if (response.success) {
        openToast('Afspraak succesvol aangemaakt!');
        onClose();
        refreshAppointments();  // refresh parent timetable
      } else {
        openToast('Kon afspraak niet maken: ' + response.message);
      }
    } catch (err) {
      console.error(err);
      openToast('Er is iets misgegaan bij het aanmaken van de afspraak.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Nieuwe Afspraak</h2>
        <p>Datum: {date}</p>
        <p>Tijd: {startTime}</p>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Notitie"
        />
        <div className="modal-buttons">
          <button onClick={handleSubmit}>Maak afspraak</button>
          <button onClick={onClose}>Annuleer</button>
        </div>
      </div>
    </div>
  );
};

export default CreateAppointmentModal;
