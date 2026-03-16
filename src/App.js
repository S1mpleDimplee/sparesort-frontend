import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import Home from "./MainPages/Home/Home";
import { ToastProvider, useToast } from "./toastmessage/toastmessage";
import postCall from "./Calls/calls";

import Footer from "./Footer/Footer";
import OpeningsTijden from "./MainPages/Home/Openingstijden/Openingstijden";
import Register from "./Authentication/register/register";
import Login from "./Authentication/login/login";
import Verify from "./Authentication/emailverify/verify";
import NavbarHome from "./Navbars/Navbarhome/Navbarhome";
import BalieDashboard from "./Baliemedewerker/Dashboard/Dashboard";
import BalieLodges from "./Baliemedewerker/Lodges/Lodges";
import NavbarDashboard from "./Navbars/Navbardashboard/NavbarDashboard";
import ManagerDashboard from "./Manager/Dashboard/Dashboard";
import MonteurDashboard from "./monteur/Dashboard/dashboard"; 
import ManagerUsers from "./Manager/Users/ManagerUsers";
import NotFound from "./404/404";
import AccountOverview from "./Manager/Users/Userinfo/AccountOverview";
import BookingCalendar from "./Manager/Users/BookingCalendar/BookingCalendar";
import ManagerLodgeList from "./Manager/Lodges/LodgeList/ManagerLodgeList";
import ManagerLodgeOverview from "./Manager/Lodges/LodgeOverview/ManagerLodgeOverview";
import BookingsList from "./Manager/Bookings/BookingsList/BookingsList";
import PlaceBooking from "./Manager/Bookings/PlaceBooking/PlaceBooking";


function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentRole, setCurrentRole] = useState(4);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const nonLoggedInUrls = ["/", "/home", "/inloggen", "/registreren", "/verificatie", "/Openingstijden"];
  const loginpages = ["/inloggen", "/registreren", "/verificatie"];

  const isDashboard = location.pathname.startsWith("/dashboard");
  const isKnownPage = nonLoggedInUrls.includes(location.pathname) || isDashboard;

  useEffect(() => {
    checkUserLoginStatus();
  }, [location.pathname]);

  const checkUserLoginStatus = () => {
    const loggedInData = JSON.parse(localStorage.getItem("userdata"));
    if (loggedInData) {
      setIsLoggedIn(true);
      setCurrentRole(parseInt(loggedInData.role));
    } else {
      setIsLoggedIn(false);
      if (location.pathname.startsWith("/dashboard")) {
        navigate("/inloggen");
      }
    }
  };

  return (
    <div className="app-container">
      <head>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" />
      </head>

      {isDashboard
        ? <NavbarDashboard />
        : isKnownPage && <NavbarHome />
      }

      <div className="content-wrapper">
        <main className={`main-content ${isLoggedIn && isDashboard ? "dashboard-main-content" : ""}`}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/registreren" element={<Register />} />
            <Route path="/inloggen" element={<Login />} />
            <Route path="/verificatie" element={<Verify />} />
            <Route path="/Openingstijden" element={<OpeningsTijden />} />
            
            <Route path="*" element={<NotFound />} />

            {isLoggedIn && (
              <>
                {/* Balimedewerker (role 1) */}
                {currentRole === 1 && (
                  <>
                    <Route path="/dashboard" element={<BalieDashboard />} />
                    <Route path="/dashboard/lodges" element={<BalieLodges />} />
                    <Route path="/dashboard/calendar" element={<BookingCalendar />} />
                  </>
                )}

                {/* Monteur (role 2) */}
                {currentRole === 2 && (
                  <>
                    <Route path="/dashboard" element={<MonteurDashboard />} />
                    {/* add monteur routes here */}
                  </>
                )}

                {/* Manager (role 3) */}
                {currentRole === 3 && (
                  <>
                    <Route path="/dashboard" element={<ManagerDashboard />} />
                    <Route path="/dashboard/lodges" element={<ManagerLodgeList />} />
                    <Route path="/dashboard/lodges/nieuw" element={<ManagerLodgeOverview />} />
                    <Route path="/dashboard/lodges/:id" element={<ManagerLodgeOverview />} />
                    <Route path="/dashboard/gebruikers" element={<ManagerUsers />} />
                    <Route path="/dashboard/gebruikers/:id" element={<AccountOverview />} />
                    <Route path="/dashboard/boekingen" element={<BookingsList />} />
                    {/* <Route path="/dashboard/boekingen/:id" element={<BookingDetails />} /> */}
                    <Route path="/dashboard/boekingen/nieuw" element={<PlaceBooking />} />

                  </>
                )}
              </>
            )}
          </Routes>
        </main>
      </div>

      <footer className="footer">
        {!(isDashboard || loginpages.includes(location.pathname)) && <Footer />}
      </footer>
    </div>
  );
}

function App() {
  return (
    <ToastProvider>
      <Router>
        <AppContent />
      </Router>
    </ToastProvider>
  );
}

export default App;