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
import Register from "./Authentication/register/register";
import Login from "./Authentication/login/login";
import Verify from "./Authentication/emailverify/verify";
import NavbarHome from "./Navbars/Navbarhome/Navbarhome";
import BalieDashboard from "./Baliemedewerker/Dashboard/Dashboard";
import BalieLodges from "./Baliemedewerker/Lodges/Lodges";
import NavbarDashboard from "./Navbars/Navbardashboard/NavbarDashboard";
import ManagerDashboard from "./Manager/Dashboard/Dashboard";
import ManagerLodgeDetails from "./Manager/Lodges/ManagerLodgeDetails";
import ManagerUsers from "./Manager/Users/ManagerUsers";
import NotFound from "./404/404";
import AccountOverview from "./Manager/Users/AccountOverview/AccountOverview";

// import DashboardKlant from "./apklaarfiles/CustomerDashboard/Dashboard/Dashboard";
// import MechanicDashboard from "./apklaarfiles/MechanicDashboard/Dashboard/Dashboard";
// import ManagerDashboard from "./apklaarfiles/ManagerDashboard/Dashboard/Dashboard";
// import Sidebar from "./Navbar/SidebarDashboard/Sidebar";
// import NavbarDashboard from "./Navbar/NavbarDashboard/NavbarDashboard";

// Inner component that uses useLocation
function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDashboard, setIsDashboard] = useState(false);
  const [currentRole, setCurrentRole] = useState(4);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // Define dashboard URLs for all roles
  const dashboardUrls = [
    "/dashboard",
    "/dashboard/lodges",
    "/dashboard/lodges/:id",
    "/dashboard/gebruikers",
    "/dashboard/gebruikeroverzicht",

  ];

  const nonLoggedInUrls = [
    "/",
    "/home",
    "/inloggen",
    "/registreren",
    "/verificatie",
  ];
  const isNonLoggedIn = nonLoggedInUrls.includes(location.pathname);
  const loginpages = ["/inloggen", "/registreren", "/verificatie"];

  // const { openToast } = useToast();

  useEffect(() => {
    // Check if user is logged in and get their role
    checkUserLoginStatus();
    setIsDashboard(dashboardUrls.includes(location.pathname));
  }, [location.pathname]);

  const checkUserLoginStatus = () => {
    const loggedInData = JSON.parse(localStorage.getItem("userdata"));
    if (loggedInData) {
      setIsLoggedIn(true);
      setCurrentRole(parseInt(loggedInData.role));
      // You can uncomment this if you want to verify user data from database
      // checkIfLoginDataChangedFromDatabase();
    } else {
      setIsLoggedIn(false);
      // Redirect to login if trying to access dashboard without being logged in
      if (dashboardUrls.includes(location.pathname)) {
        navigate("/inloggen");
      }
    }
  };

  // Uncomment this function if you want to verify user data from database
  // const checkIfLoginDataChangedFromDatabase = async () => {
  //   const loggedInData = JSON.parse(localStorage.getItem("loggedInData"));
  //   if (loggedInData) {
  //     try {
  //       const response = await postCall("fetchuserdata", loggedInData.userid);
  //       if (response.isSuccess) {
  //         if (response.data.role !== loggedInData.role.toString() ||
  //           response.data.email !== loggedInData.email ||
  //           response.data.userid !== loggedInData.userid ||
  //           response.data.firstname !== loggedInData.firstName ||
  //           response.data.lastname !== loggedInData.lastName) {
  //           localStorage.removeItem("loggedInData");
  //           navigate("/inloggen");
  //           openToast(`WAARSCHUWING! Uw informatie is gewijzigd. Log opnieuw in.`);
  //         }
  //       } else {
  //         openToast("Er is iets misgegaan bij het ophalen van uw gegevens. Log opnieuw in.");
  //         localStorage.removeItem("loggedInData");
  //         navigate("/inloggen");
  //       }
  //     } catch (error) {
  //       console.error("Error checking user data:", error);
  //     }
  //   }
  // };

  const handleSidebarNavigation = (path) => {
    navigate(path);
  };

  // Determine if the current page is the NotFound page
  const isNotFoundPage = location.pathname !== "/" &&
    location.pathname !== "/registreren" &&
    location.pathname !== "/inloggen" &&
    location.pathname !== "/verificatie" &&
    !dashboardUrls.includes(location.pathname);

  return (
    <div className="app-container">
      <head>
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" />
      </head>
      {!isNotFoundPage &&
        (!isDashboard || !location.pathname.includes("dashboard")
          ? <NavbarHome />
          : <NavbarDashboard />
        )
      }

      <div className="content-wrapper">
          {/* Main content area with dashboard navbar inside */}
        <main
          className={`main-content ${isLoggedIn && isDashboard ? "dashboard-main-content" : ""
            }`}
        >
          {/* {isLoggedIn && isDashboard && <NavbarDashboard />} */}

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/registreren" element={<Register />} />
            <Route path="/inloggen" element={<Login />} />
            <Route path="/verificatie" element={<Verify />} />
            <Route path="*" element={<NotFound />} />

            {isLoggedIn && (
              <>
                {/* Gast Dashboard routes (role 0) */}
                {currentRole === 0 && (
                  <>
                    {/* <Route path="/mijnboekingen" element={<DashboardKlant />} /> */}
                  </>
                )}

                {/* Balimedewerker Dashboard routes (role 1) */}
                {currentRole === 1 && (
                  <>
                    <Route path="/dashboard" element={<BalieDashboard />} />
                    <Route path="/dashboard/lodges" element={<BalieLodges />} />
                    {/* <Route path="/dashboard" element={<MechanicDashboard />} /> */}
                  </>
                )}

                {/* Monteur Dashboard routes (role 2) */}
                {currentRole === 2 && (
                  <>
                    {/* <Route path="/dashboard" element={<ManagerDashboard />} /> */}
                  </>
                )}
                {/* Manager Dashboard routes (role 3) */}
                {currentRole === 3 && (
                  <>
                    <Route path="/dashboard" element={<ManagerDashboard />} />
                    <Route path="/dashboard/lodges" element={<ManagerLodgeDetails />} />
                    <Route path="/dashboard/lodges/:id" element={<ManagerLodgeDetails />} />
                    <Route path="/dashboard/gebruikers" element={<ManagerUsers />} />
                    <Route path="/dashboard/gebruikeroverzicht" element={<AccountOverview />} />
                  </>
                )}
              </>
            )}
          </Routes>
        </main>
      </div>

      <footer className="footer">
        {!(isDashboard || loginpages.includes(location.pathname)) && (
          <Footer />
        )}
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
