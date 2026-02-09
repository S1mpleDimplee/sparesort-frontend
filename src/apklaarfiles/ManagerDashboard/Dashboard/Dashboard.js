import React, { useState, useEffect } from "react";
import "./ManagerDashboard.css";
import PieChart from "../../components/PieChart/PieChart";
import BarChart from "../../components/BarChart/BarChart";

const ManagerDashboard = () => {
  // State management for dashboard data
  const [dashboardData, setDashboardData] = useState({
    bookingsToday: 0,
    bookingsLastMonth: 0,
    registeredAccounts: 0,
    accountsGrowth: 0,
    plannedRepairs: 0,
    ongoingRepairs: 0,
    revenue: 0,
    revenueLastMonth: 0,
  });

  const [bookingStatusData, setBookingStatusData] = useState([]);
  const [monthlyBookingsData, setMonthlyBookingsData] = useState([]);
  const [latestBookings, setLatestBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch dashboard data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // API call to fetch all dashboard data
  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Replace with your actual API endpoints
      // const response = await postCall("getDashboardData");
      
      // Temporary mock data - replace with actual API response
      const mockData = {
        bookingsToday: 31,
        bookingsLastMonth: 18,
        registeredAccounts: 2000,
        accountsGrowth: 101,
        plannedRepairs: 10,
        ongoingRepairs: 18,
        revenue: 2391.21,
        revenueLastMonth: 2391.21,
        bookingStatus: [
          { label: "Geannuleerde boekingen", amount: 150, color: "#ff4c4c" },
          { label: "Succesvolle boekingen", amount: 50, color: "#4caf50" }
        ],
        monthlyBookings: [
          { label: "Jan 2025", value: 45, color: "#2196f3" },
          { label: "Feb 2025", value: 32, color: "#2196f3" },
          { label: "Mar 2025", value: 68, color: "#2196f3" },
          { label: "Apr 2025", value: 95, color: "#2196f3" },
          { label: "Mei 2025", value: 52, color: "#2196f3" },
          { label: "Jun 2025", value: 0, color: "#2196f3" },
          { label: "Jul 2025", value: 0, color: "#2196f3" },
          { label: "Aug 2025", value: 0, color: "#2196f3" },
          { label: "Sep 2025", value: 0, color: "#2196f3" },
          { label: "Okt 2025", value: 0, color: "#2196f3" },
          { label: "Nov 2025", value: 0, color: "#2196f3" },
          { label: "Dec 2025", value: 0, color: "#2196f3" }
        ],
        latestBookings: [
          {
            id: 1,
            guestName: "Jaylene van der veen",
            status: "Terugbetaling gestart",
            date: "26 april 2026",
            initials: "JA"
          }
        ]
      };

      setDashboardData({
        bookingsToday: mockData.bookingsToday,
        bookingsLastMonth: mockData.bookingsLastMonth,
        registeredAccounts: mockData.registeredAccounts,
        accountsGrowth: mockData.accountsGrowth,
        plannedRepairs: mockData.plannedRepairs,
        ongoingRepairs: mockData.ongoingRepairs,
        revenue: mockData.revenue,
        revenueLastMonth: mockData.revenueLastMonth,
      });

      setBookingStatusData(mockData.bookingStatus);
      setMonthlyBookingsData(mockData.monthlyBookings);
      setLatestBookings(mockData.latestBookings);

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `€${amount.toFixed(2)}`;
  };

  // Calculate growth percentage
  const calculateGrowth = (current, previous) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous * 100).toFixed(0);
  };

  if (isLoading) {
    return (
      <div className="manager-dashboard">
        <div className="dashboard-loading">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="manager-dashboard fade-in">
      {/* Stats Cards Row */}
      <div className="dashboard-stats-row">
        {/* Boekingen vandaag */}
        <div className="stat-card card-entrance">
          <div className="stat-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 2v3M16 2v3M3.5 9.09h17M21 8.5V17c0 3-1.5 5-5 5H8c-3.5 0-5-2-5-5V8.5c0-3 1.5-5 5-5h8c3.5 0 5 2 5 5z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-value">{dashboardData.bookingsToday}</div>
            <div className="stat-label">Boekingen vandaag</div>
            <div className="stat-sublabel">
              Ingechecked als: <span className="stat-highlight">{dashboardData.bookingsLastMonth}</span>
            </div>
          </div>
        </div>

        {/* Geregistreerde accounts */}
        <div className="stat-card card-entrance-delayed">
          <div className="stat-icon stat-icon-green">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 7.16C17.94 7.15 17.87 7.15 17.81 7.16C16.43 7.11 15.33 5.98 15.33 4.58C15.33 3.15 16.48 2 17.91 2C19.34 2 20.49 3.16 20.49 4.58C20.48 5.98 19.38 7.11 18 7.16Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16.97 14.44C18.34 14.67 19.85 14.43 20.91 13.72C22.32 12.78 22.32 11.24 20.91 10.3C19.84 9.59 18.31 9.35 16.94 9.59" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5.97 7.16C6.03 7.15 6.1 7.15 6.16 7.16C7.54 7.11 8.64 5.98 8.64 4.58C8.64 3.15 7.49 2 6.06 2C4.63 2 3.48 3.16 3.48 4.58C3.49 5.98 4.59 7.11 5.97 7.16Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7 14.44C5.63 14.67 4.12 14.43 3.06 13.72C1.65 12.78 1.65 11.24 3.06 10.3C4.13 9.59 5.66 9.35 7.03 9.59" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 14.63C11.94 14.62 11.87 14.62 11.81 14.63C10.43 14.58 9.33 13.45 9.33 12.05C9.33 10.62 10.48 9.47 11.91 9.47C13.34 9.47 14.49 10.63 14.49 12.05C14.48 13.45 13.38 14.59 12 14.63Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9.09 17.78C7.68 18.72 7.68 20.26 9.09 21.2C10.69 22.27 13.31 22.27 14.91 21.2C16.32 20.26 16.32 18.72 14.91 17.78C13.32 16.72 10.69 16.72 9.09 17.78Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-value">{dashboardData.registeredAccounts}</div>
            <div className="stat-label">Geregistreerde accounts</div>
            <div className="stat-sublabel">
              +{dashboardData.accountsGrowth} in de afgelopen 2 maanden
            </div>
          </div>
        </div>

        {/* Reparaties gepland */}
        <div className="stat-card card-entrance" style={{ animationDelay: "0.2s" }}>
          <div className="stat-icon stat-icon-orange">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.5 10.65L9.5 7.35v6.6l5-3.3z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 15V9c0-5-2-7-7-7H9C4 2 2 4 2 9v6c0 5 2 7 7 7h6c5 0 7-2 7-7z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-value">{dashboardData.plannedRepairs}</div>
            <div className="stat-label">Reparaties gepland</div>
            <div className="stat-sublabel">
              Reparaties in gang als: <span className="stat-highlight-orange">{dashboardData.ongoingRepairs}</span>
            </div>
          </div>
        </div>

        {/* Omzet deze maand */}
        <div className="stat-card card-entrance-delayed" style={{ animationDelay: "0.3s" }}>
          <div className="stat-icon stat-icon-currency">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10"/>
              <path d="M10.5 15.5h3c1.1 0 2-.9 2-2s-.9-2-2-2h-3c-1.1 0-2-.9-2-2s.9-2 2-2h3M12 7.5v1M12 15.5v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-value">{formatCurrency(dashboardData.revenue)}</div>
            <div className="stat-label">Omzet deze maand</div>
            <div className="stat-sublabel stat-revenue">
              <span className="revenue-icon">€</span>
              <span>Omzet vorige maand</span>
              <span className="revenue-amount">{formatCurrency(dashboardData.revenueLastMonth)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Latest Bookings Row */}
      <div className="dashboard-charts-row">
        {/* Pie Chart - Booking Status */}
        <div className="chart-card fade-slide-up">
          <div className="chart-header">
            <div className="legend-inline">
              {bookingStatusData.map((item, index) => (
                <div key={index} className="legend-item">
                  <span className="legend-dot" style={{ backgroundColor: item.color }}></span>
                  <span className="legend-label">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="chart-content">
            <PieChart 
              items={bookingStatusData} 
              size={280} 
              legendpos="none"
            />
          </div>
        </div>

        {/* Latest Bookings */}
        <div className="latest-bookings-card fade-slide-up" style={{ animationDelay: "0.1s" }}>
          <h3 className="card-title">Laatste boekigen</h3>
          <div className="bookings-list">
            {latestBookings.length > 0 ? (
              latestBookings.map((booking) => (
                <div key={booking.id} className="booking-item">
                  <div className="booking-avatar">{booking.initials}</div>
                  <div className="booking-details">
                    <div className="booking-name">{booking.guestName}</div>
                    <div className="booking-status">{booking.status}</div>
                  </div>
                  <div className="booking-date">{booking.date}</div>
                </div>
              ))
            ) : (
              <div className="no-bookings">Geen recente boekingen</div>
            )}
          </div>
        </div>
      </div>

      {/* Bar Chart - Monthly Bookings */}
      <div className="dashboard-bar-chart fade-slide-up" style={{ animationDelay: "0.2s" }}>
        <h3 className="chart-section-title">Boekingen 12 maand overzicht</h3>
        <BarChart 
          data={monthlyBookingsData} 
          height="350px"
        />
      </div>
    </div>
  );
};

export default ManagerDashboard;