import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import ProgressBar from "../../HouseStyle/ProgressBar/ProgressBar";
import BarChart from "../../HouseStyle/BarChart/BarChart";
import PieChart from "../../HouseStyle/PieChart/PieChart";
import * as Icons from "../../Icons/Icons";
import apiCall from "../../Calls/calls";

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
    Repairs: 0,
    totalLodges: 0,
  });

  const [bookingStatusData, setBookingStatusData] = useState([]);
  const [monthlyBookingsData, setMonthlyBookingsData] = useState([]);
  const [latestBookings, setLatestBookings] = useState([]);
  const [progressMetrics, setProgressMetrics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const response = await apiCall("getmanagerdashboardinfo", {});

      if (!response.isSuccess) return;

      const data = response.data;

      setDashboardData({
        bookingsToday: data.bookingsToday,
        bookingsLastMonth: data.bookingsLastMonth,
        registeredAccounts: data.registeredAccounts,
        accountsGrowth: data.accountsGrowth,
        plannedRepairs: 0,
        ongoingRepairs: 0,
        revenue: data.revenue,
        revenueLastMonth: data.revenueLastMonth,
        Repairs: data.Repairs,
        totalLodges: data.totalLodges,
      });

      const statusColors = { geannuleerd: "#ff7272", bevestigd: "#40f1b6", gepland: "#d9ff72" };
      setBookingStatusData(
        data.bookingStatus.map(s => ({
          label: s.status,
          amount: parseInt(s.total),
          color: statusColors[s.status] ?? "#3b82f6"
        }))
      );

      setMonthlyBookingsData(data.monthlyBookings);
      setLatestBookings(data.latestBookings);

      setProgressMetrics([
        {
          id: 1, label: "Lodge Bezetting",
          value: data.lodgeOccupancy, max: 100, color: "#10b981",
          info: `${data.occupiedLodges} van ${data.totalLodges} lodges bezet`
        },
        {
          id: 2, label: "Klanttevredenheid",
          value: 92, max: 100, color: "#3b82f6",
          info: "Gemiddelde score: 4.6/5"
        },
        {
          id: 3, label: "Maandelijkse Target",
          value: Math.min(Math.round((data.revenue / 100000) * 100), 100),
          max: 100, color: "#f59e0b",
          info: `€${data.revenue.toFixed(0)} van €100.000`
        },
        {
          id: 4, label: "Onderhoud Compleet",
          value: 45, max: 100, color: "#ec4899",
          info: "9 van 20 taken voltooid"
        }
      ]);

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
      <div className="dashboard-stats-row">
        <div className="stat-card card-entrance hover-glow">
          <div className="stat-icon">
            <img src={Icons.managerCalendar} alt="Boekingen vandaag" width="32" height="32" />
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

        <div className="stat-card card-entrance-delayed hover-glow">
          <div className="stat-icon stat-icon-green">
            <img src={Icons.managerUser} alt="Geregistreerde accounts" width="32" height="32" />
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

        <div className="stat-card card-entrance-delayed hover-glow" style={{ animationDelay: "0.4s" }}>
          <div className="stat-icon stat-icon-orange shimmer">
            <img src={Icons.managerWrench} alt="Reparaties" width="32" height="32" />
          </div>
          <div className="stat-content">
            <div className="stat-value scale-in">{dashboardData.Repairs}</div>
            <div className="stat-label">Reparaties gepland</div>
            <ProgressBar
              value={dashboardData.Repairs}
              max={dashboardData.totalLodges}
              height="10px"
              color={"#ff9800"}
              secondColor={"#ffb74d"}
            />
            <div className="stat-sublabel">
              Van totale  <span className="stat-highlight-orange">{dashboardData.totalLodges}</span> lodges
            </div>
          </div>
        </div>

        <div className="stat-card card-entrance-delayed hover-glow hover-glow" style={{ animationDelay: "0.6s" }}>
          <div className="stat-icon stat-icon-currency pulse">
            <img src={Icons.managerEuro} alt="Omzet" width="32" height="32" />
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

      <div className="dashboard-charts-row">
        <div className="chart-card hover-glow">
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

        <div className="latest-bookings-card hover-glow" style={{ animationDelay: "0.2s" }}>
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

      <div className="dashboard-bar-chart hover-glow">
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