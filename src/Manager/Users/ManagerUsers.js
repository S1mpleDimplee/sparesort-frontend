import React, { useState } from 'react';
import './ManagerUsers.css';

const ManagerUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const usersData = [
    {
      id: 1,
      naam: 'Jaylano van der veen',
      email: 'Jaylahovanderveen@gmail.com',
      role: 'Manager',
      aangemaakt: '19 Februarie 2025',
      status: 'Actief'
    },
    {
      id: 2,
      naam: 'Johan derksen',
      email: 'johanderksen@gmail.com',
      role: 'Onderhouds monteur',
      aangemaakt: '19 Februarie 2025',
      status: 'Actief'
    },
    {
      id: 3,
      naam: 'Simon kapper',
      email: 'simonkapper@gmail.com',
      role: 'Gast',
      aangemaakt: '19 Februarie 2025',
      status: 'Actief'
    },
    {
      id: 4,
      naam: 'Bregje de bergje',
      email: 'bregjedebergje@gmail.com',
      role: 'Gast',
      aangemaakt: '19 Februarie 2025',
      status: 'Actief'
    },
    {
      id: 5,
      naam: 'Jaylano van der veen',
      email: 'Jaylahovanderveen@gmail.com',
      role: 'Gast',
      aangemaakt: '19 Februarie 2025',
      status: 'Actief'
    }
  ];

  const getRoleColor = (role) => {
    switch(role.toLowerCase()) {
      case 'manager': return 'manager-users-role-manager';
      case 'onderhouds monteur': return 'manager-users-role-maintenance';
      case 'gast': return 'manager-users-role-guest';
      default: return 'manager-users-role-default';
    }
  };

  const filteredUsers = usersData.filter(user =>
    user.naam.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="manager-users-page">
      {/* Header Section */}
      <div className="manager-users-header">
        <div className="manager-users-search-section">
          <div className="manager-users-search-wrapper">
            <input
              type="text"
              placeholder="Zoeken..."
              className="manager-users-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="manager-users-header-actions">
            <div className="manager-users-view-toggle">
              <span className="manager-users-view-option active">w/</span>
            </div>
            <button 
              className="manager-users-create-btn"
              onClick={() => setShowCreateModal(true)}
            >
              Account aanmaken
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="manager-users-table-section">
        <div className="manager-users-table-wrapper">
          <table className="manager-users-table">
            <thead>
              <tr className="manager-users-table-header">
                <th className="manager-users-header-cell">Naam</th>
                <th className="manager-users-header-cell">Email adres</th>
                <th className="manager-users-header-cell">Role</th>
                <th className="manager-users-header-cell">Aangemaakt op</th>
                <th className="manager-users-header-cell">Status</th>
                <th className="manager-users-header-cell">Actie</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="manager-users-table-row">
                  <td className="manager-users-table-cell">
                    <div className="manager-users-user-info">
                      <div className="manager-users-user-avatar">
                        <span className="manager-users-avatar-text">
                          {user.naam.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </span>
                      </div>
                      <span className="manager-users-user-name">{user.naam}</span>
                    </div>
                  </td>
                  <td className="manager-users-table-cell">
                    <span className="manager-users-email">{user.email}</span>
                  </td>
                  <td className="manager-users-table-cell">
                    <span className={`manager-users-role-badge ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="manager-users-table-cell">
                    <span className="manager-users-date">{user.aangemaakt}</span>
                  </td>
                  <td className="manager-users-table-cell">
                    <span className="manager-users-status-badge manager-users-status-active">
                      {user.status}
                    </span>
                  </td>
                  <td className="manager-users-table-cell">
                    <div className="manager-users-actions">
                      <button className="manager-users-action-btn manager-users-deactivate-btn">
                        Deactiveren
                      </button>
                      <button className="manager-users-action-btn manager-users-view-btn">
                        Inzien
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="manager-users-table-footer">
          <span className="manager-users-end-message">Einde van de lijst</span>
        </div>
      </div>

      {/* Create Account Modal (placeholder) */}
      {showCreateModal && (
        <div className="manager-users-modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="manager-users-modal" onClick={(e) => e.stopPropagation()}>
            <div className="manager-users-modal-header">
              <h3>Account aanmaken</h3>
              <button 
                className="manager-users-modal-close"
                onClick={() => setShowCreateModal(false)}
              >
                ×
              </button>
            </div>
            <div className="manager-users-modal-content">
              <p>Account creation form would go here...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerUsers;