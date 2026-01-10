import React, { useEffect, useState } from 'react';
import './ManagersUsers.css';

const roleMap = {
  1: 'Klant',
  2: 'Monteur',
  3: 'Manager'
};

const ManagerUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('http://localhost/apklaarAPI/router/router.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ function: 'getallusers' })
    })
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setUsers(json.data);
        }
      })
      .catch(err => console.error('Error fetching users:', err));
  }, []);

  const filteredUsers = users.filter(user =>
    `${user.firstname} ${user.lastname}`.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase()) ||
    user.userid.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="manager-users-container">
      {/* Header */}
      <div className="manager-users-header">
        <h2>Gebruikersbeheer</h2>
        <span className="manager-users-count">
          {filteredUsers.length} gebruikers
        </span>
      </div>

      {/* Search */}
      <div className="manager-users-search-wrapper">
        <input
          type="text"
          placeholder="Zoek op naam, e-mail of ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="manager-users-search"
        />
      </div>

      {/* Table */}
      <div className="manager-users-table-container">
        <table className="manager-users-table">
          <thead>
            <tr>
              <th>Gebruiker</th>
              <th>Email</th>
              <th>Telefoon</th>
              <th>Rol</th>
              <th>Verificatie</th>
              <th>Aangemaakt</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.userid}>
                <td>
                  <div className="user-info">
                    <strong>{user.firstname} {user.lastname}</strong>
                    <span className="userid">{user.userid}</span>
                  </div>
                </td>
                <td>{user.email}</td>
                <td>{user.phonenumber}</td>
                <td>{roleMap[user.role]}</td>
                <td>
                  <span
                    className={`status-badge ${
                      user.isverified ? 'verified' : 'unverified'
                    }`}
                  >
                    {user.isverified ? 'Geverifieerd' : 'Niet geverifieerd'}
                  </span>
                </td>
                <td>
                  {new Date(user.created_at).toLocaleDateString('nl-NL')}
                </td>
              </tr>
            ))}

            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="6" className="no-results">
                  Geen gebruikers gevonden
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagerUsers;
