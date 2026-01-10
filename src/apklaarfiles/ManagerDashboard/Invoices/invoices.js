import React, { useState, useEffect } from 'react';
import './Invoices.css';

const ManagerInvoices = () => {
  const [filters, setFilters] = useState({
    nameFilter: '',
    status: 'alle',
    dateRange: 'alle',
    amountRange: 'alle'
  });

  const [invoices, setInvoices] = useState([]);
  
  useEffect(() => {
    fetch('http://localhost/apklaarAPI/router/router.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', 
      body: JSON.stringify({ function: 'fetchinvoices' })
    })
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          // Map DB invoice structure to your React structure
          const mapped = json.data.map(inv => ({
            id: inv.invoiceid,
            name: inv.userid, // you could map to full name if you have a join with users
            invoiceDate: inv.date,
            amount: `€${parseFloat(inv.cost).toFixed(2)}`,
            paidDate: inv.payed_on ?? '-',
            status: inv.status === 'betaald' ? 'Betaald' : 'Onbetaald',
            customerEmail: '', // you can fetch this if needed
            services: inv.description,
          }));
          setInvoices(mapped);
        }
      })
      .catch(err => console.error('Error fetching invoices:', err));
  }, []);

  const statusOptions = ['alle', 'Betaald', 'Onbetaald', 'Vervallen'];
  const dateRangeOptions = ['alle', 'Deze week', 'Deze maand', 'Vorige maand'];
  const amountRangeOptions = ['alle', '€0-50', '€50-100', '€100+'];

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const toggleInvoiceStatus = (invoiceId) => {
    setInvoices(prev => prev.map(invoice => {
      if (invoice.id === invoiceId) {
        const newStatus = invoice.status === 'Betaald' ? 'Onbetaald' : 'Betaald';
        const newPaidDate = newStatus === 'Betaald' ? new Date().toLocaleDateString('nl-NL') : '-';
        return {
          ...invoice,
          status: newStatus,
          paidDate: newPaidDate
        };
      }
      return invoice;
    }));
  };

  // Filter invoices based on current filters
  const filteredInvoices = invoices.filter(invoice => {
    const nameMatch = filters.nameFilter === '' || 
      invoice.name.toLowerCase().includes(filters.nameFilter.toLowerCase()) ||
      invoice.id.toLowerCase().includes(filters.nameFilter.toLowerCase());
    
    const statusMatch = filters.status === 'alle' || invoice.status === filters.status;
    
    // Simple date filtering (could be enhanced with actual date logic)
    const dateMatch = filters.dateRange === 'alle' || true;
    
    // Simple amount filtering
    const amount = parseFloat(invoice.amount.replace('€', '').replace(',', '.'));
    let amountMatch = true;
    if (filters.amountRange === '€0-50') amountMatch = amount <= 50;
    else if (filters.amountRange === '€50-100') amountMatch = amount > 50 && amount <= 100;
    else if (filters.amountRange === '€100+') amountMatch = amount > 100;
    
    return nameMatch && statusMatch && dateMatch && amountMatch;
  });

  const totalAmount = filteredInvoices.reduce((sum, invoice) => {
    return sum + parseFloat(invoice.amount.replace('€', '').replace(',', '.'));
  }, 0);

  const paidAmount = filteredInvoices
    .filter(invoice => invoice.status === 'Betaald')
    .reduce((sum, invoice) => {
      return sum + parseFloat(invoice.amount.replace('€', '').replace(',', '.'));
    }, 0);

  const unpaidAmount = totalAmount - paidAmount;

  return (
    <div className="manager-invoices-container">
      {/* Header */}
      <div className="manager-invoices-header">
        <div className="manager-invoices-breadcrumb">
          <span>Home</span>
          <span className="manager-invoices-separator">/</span>
          <span>Factures</span>
        </div>
        
        <div className="manager-invoices-user-info">
          <div className="manager-invoices-user-avatar"></div>
          <span className="manager-invoices-user-name">Edward robinson</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="manager-invoices-main-content">
        {/* Summary Cards */}
        <div className="manager-invoices-summary">
          <div className="manager-invoices-summary-card total">
            <div className="manager-invoices-summary-amount">€{totalAmount.toFixed(2).replace('.', ',')}</div>
            <div className="manager-invoices-summary-label">Totaal facturen</div>
            <div className="manager-invoices-summary-count">{filteredInvoices.length} facturen</div>
          </div>
          <div className="manager-invoices-summary-card paid">
            <div className="manager-invoices-summary-amount">€{paidAmount.toFixed(2).replace('.', ',')}</div>
            <div className="manager-invoices-summary-label">Betaald</div>
            <div className="manager-invoices-summary-count">{filteredInvoices.filter(i => i.status === 'Betaald').length} facturen</div>
          </div>
          <div className="manager-invoices-summary-card unpaid">
            <div className="manager-invoices-summary-amount">€{unpaidAmount.toFixed(2).replace('.', ',')}</div>
            <div className="manager-invoices-summary-label">Onbetaald</div>
            <div className="manager-invoices-summary-count">{filteredInvoices.filter(i => i.status === 'Onbetaald').length} facturen</div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="manager-invoices-filters">
          <div className="manager-invoices-filter-label-main">Filter op naam</div>
          <div className="manager-invoices-filters-row">
            {/* Name Filter */}
            <div className="manager-invoices-filter-group">
              <input
                type="text"
                placeholder="Zoek op naam of factuur ID..."
                value={filters.nameFilter}
                onChange={(e) => handleFilterChange('nameFilter', e.target.value)}
                className="manager-invoices-filter-input"
              />
            </div>

            {/* Status Filter */}
            <div className="manager-invoices-filter-group">
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="manager-invoices-filter-select"
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>
                    {status === 'alle' ? 'Alle statussen' : status}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range Filter */}
            <div className="manager-invoices-filter-group">
              <select
                value={filters.dateRange}
                onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                className="manager-invoices-filter-select"
              >
                {dateRangeOptions.map(range => (
                  <option key={range} value={range}>
                    {range === 'alle' ? 'Alle periodes' : range}
                  </option>
                ))}
              </select>
            </div>

            {/* Amount Range Filter */}
            <div className="manager-invoices-filter-group">
              <select
                value={filters.amountRange}
                onChange={(e) => handleFilterChange('amountRange', e.target.value)}
                className="manager-invoices-filter-select"
              >
                {amountRangeOptions.map(range => (
                  <option key={range} value={range}>
                    {range === 'alle' ? 'Alle bedragen' : range}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Filters */}
            <div className="manager-invoices-filter-group">
              <button
                onClick={() => setFilters({
                  nameFilter: '',
                  status: 'alle',
                  dateRange: 'alle',
                  amountRange: 'alle'
                })}
                className="manager-invoices-clear-filters"
              >
                Filters wissen
              </button>
            </div>
          </div>
        </div>

        {/* Invoices Table */}
        <div className="manager-invoices-table-container">
          <table className="manager-invoices-table">
            <thead>
              <tr>
                <th>Naam</th>
                <th>ID</th>
                <th>Factuur datum</th>
                <th>Bedrag</th>
                <th>Betaald op</th>
                <th>Status</th>
                <th>Acties</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className={`manager-invoices-row ${invoice.status.toLowerCase()}`}>
                  <td className="manager-invoices-name">
                    <div className="manager-invoices-customer-info">
                      <span className="manager-invoices-customer-name">{invoice.name}</span>
                      <span className="manager-invoices-customer-email">{invoice.customerEmail}</span>
                      <span className="manager-invoices-customer-services">{invoice.services}</span>
                    </div>
                  </td>
                  <td className="manager-invoices-id">{invoice.id}</td>
                  <td className="manager-invoices-date">{invoice.invoiceDate}</td>
                  <td className="manager-invoices-amount">{invoice.amount}</td>
                  <td className="manager-invoices-paid-date">{invoice.paidDate}</td>
                  <td className="manager-invoices-status">
                    <span className={`manager-invoices-status-badge ${invoice.status.toLowerCase()}`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="manager-invoices-actions">
                    <button 
                      className="manager-invoices-action-btn view"
                      title="Factuur bekijken"
                    >
                      👁️
                    </button>
                    <button 
                      className="manager-invoices-action-btn edit"
                      title="Bewerken"
                    >
                      ✏️
                    </button>
                    <button 
                      className="manager-invoices-action-btn toggle"
                      title={invoice.status === 'Betaald' ? 'Markeer als onbetaald' : 'Markeer als betaald'}
                      onClick={() => toggleInvoiceStatus(invoice.id)}
                    >
                      {invoice.status === 'Betaald' ? '❌' : '✅'}
                    </button>
                  </td>
                </tr>
              ))}
              {filteredInvoices.length === 0 && (
                <tr>
                  <td colSpan="7" className="manager-invoices-no-results">
                    Geen facturen gevonden met de huidige filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          
          {filteredInvoices.length > 0 && (
            <div className="manager-invoices-table-footer">
              Einde van de lijst - {filteredInvoices.length} facturen getoond
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerInvoices;