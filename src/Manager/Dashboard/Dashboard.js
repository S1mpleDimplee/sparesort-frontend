import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import ProgressBar from "../../HouseStyle/ProgressBar/ProgressBar";
import BarChart from "../../HouseStyle/BarChart/BarChart";
import PieChart from "../../HouseStyle/PieChart/PieChart";
import * as Icons from "../../Icons/Icons";

const ManagerDashboard = () => {
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
  const [progressMetrics, setProgressMetrics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch dashboard data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // API call to fetch all dashboard data
  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
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
          { label: "Geannuleerde boekingen", amount: 150, color: "#ef4444" },
          { label: "Succesvolle boekingen", amount: 50, color: "#10b981" }
        ],
        monthlyBookings: [
          { label: "Jan 2025", value: 45, color: "#3b82f6" },
          { label: "Feb 2025", value: 32, color: "#3b82f6" },
          { label: "Mar 2025", value: 68, color: "#3b82f6" },
          { label: "Apr 2025", value: 95, color: "#3b82f6" },
          { label: "Mei 2025", value: 52, color: "#3b82f6" },
          { label: "Jun 2025", value: 0, color: "#3b82f6" },
          { label: "Jul 2025", value: 0, color: "#3b82f6" },
          { label: "Aug 2025", value: 0, color: "#3b82f6" },
          { label: "Sep 2025", value: 0, color: "#3b82f6" },
          { label: "Okt 2025", value: 0, color: "#3b82f6" },
          { label: "Nov 2025", value: 0, color: "#3b82f6" },
          { label: "Dec 2025", value: 0, color: "#3b82f6" }
        ],
        latestBookings: [
          {
        id: 1,
        guestName: "Jaylene van der veen",
        status: "Terugbetaling gestart",
        date: "26 april 2026",
        initials: "JA"
          }
        ],
        progressMetrics: [
          {
        id: 1,
        label: "Lodge Bezetting",
        value: 75,
        max: 100,
        color: "#10b981",
        info: "75 van 100 lodges bezet"
          },
          {
        id: 2,
        label: "Klanttevredenheid",
        value: 92,
        max: 100,
        color: "#3b82f6",
        info: "Gemiddelde score: 4.6/5"
          },
          {
        id: 3,
        label: "Maandelijkse Target",
        value: 68,
        max: 100,
        color: "#f59e0b",
        info: "€68.000 van €100.000"
          },
          {
        id: 4,
        label: "Onderhoud Compleet",
        value: 45,
        max: 100,
        color: "#ec4899",
        info: "9 van 20 taken voltooid"
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
      setProgressMetrics(mockData.progressMetrics);

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return `€${amount.toFixed(2)}`;
  };

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
    <div className="manager-dashboard page-enter">
      {/* Stats Cards Row */}
      <div className="dashboard-stats-row">
        {/* Boekingen vandaag */}
        <div className="stat-card card-entrance hover-lift">
          <div className="stat-icon">
          </div>
          <div className="stat-content">
            <div className="stat-value scale-in">{dashboardData.bookingsToday}</div>
            <div className="stat-label">Boekingen vandaag</div>
            <ProgressBar
                value={dashboardData.bookingsLastMonth}
                max={dashboardData.bookingsToday}
                height="10px"
                color={"#2a4bb9"}
                secondColor={"#7f97c9"}
              />
            <div className="stat-sublabel">
              Ingecheckte boekingen: <span className="stat-highlight">{dashboardData.bookingsLastMonth}</span>
            </div>
          </div>
        </div>

        {/* Geregistreerde accounts */}
        <div className="stat-card card-entrance-delayed hover-lift">
          <div className="stat-icon stat-icon-green">
          </div>
          <div className="stat-content">
            <div className="stat-value scale-in-bounce">{dashboardData.registeredAccounts}</div>
            <div className="stat-label">Geregistreerde accounts</div>
              <ProgressBar
                value={dashboardData.accountsGrowth}
                max={dashboardData.registeredAccounts}
                height="10px"
                color={"#4caf50"}
                secondColor={"#81c784"}
              />
            <div className="stat-sublabel">
              +{dashboardData.accountsGrowth} in de afgelopen 2 maanden
            </div>
          </div>
        </div>

        {/* Reparaties gepland */}
        <div className="stat-card card-entrance-delayed hover-lift" style={{ animationDelay: "0.4s" }}>
          <div className="stat-icon stat-icon-orange shimmer">
            <img src={Icons.dashboardMainenance} alt="Reparaties" width="24" height="24" />
          </div>
          <div className="stat-content">
            <div className="stat-value scale-in">{dashboardData.plannedRepairs}</div>
            <div className="stat-label">Reparaties gepland</div>
              <ProgressBar
                value={dashboardData.ongoingRepairs}
                max={dashboardData.plannedRepairs}
                height="10px"
                color={"#ff9800"}
                secondColor={"#ffb74d"}
              />
            <div className="stat-sublabel">
              Reparaties in gang als: <span className="stat-highlight-orange">{dashboardData.ongoingRepairs}</span>
            </div>
          </div>
        </div>

        {/* Omzet deze maand */}
        <div className="stat-card card-entrance-delayed hover-lift hover-glow" style={{ animationDelay: "0.6s" }}>
          <div className="stat-icon stat-icon-currency pulse">
          </div>
          <div className="stat-content">
            <div className="stat-value scale-in-bounce">{formatCurrency(dashboardData.revenue)}</div>
            <div className="stat-label">Omzet deze maand</div>
            <div className="stat-sublabel stat-revenue">
              <span className="revenue-icon">€</span>
              <span>Omzet vorige maand</span>
              <span className="revenue-amount">{formatCurrency(dashboardData.revenueLastMonth)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Piechart part */}
      <div className="dashboard-charts-row">
        <div className="chart-card hover-lift">
          <div className="chart-header">
            <div className="legend-inline fade-in-delayed">
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

        <div className="latest-bookings-card hover-lift" style={{ animationDelay: "0.2s" }}>
          <h3 className="card-title  mb-2">Laatste boekigen</h3>
          <div className="bookings-list">
            {latestBookings.length > 0 ? (
              latestBookings.map((booking, index) => (
                <div key={booking.id} className="booking-item slide-right" style={{ animationDelay: `${0.3 + index * 0.1}s` }}>
                  <div className="booking-avatar hover-scale">{booking.initials}</div>
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

      <div className="dashboard-bar-chart hover-lift">
        <h3 className="chart-section-title fade-in-delayed">Boekingen 12 maand overzicht</h3>
        <BarChart
          data={monthlyBookingsData} 
          height="350px"
        />
      </div>
    </div>
  );
};

export default ManagerDashboard;