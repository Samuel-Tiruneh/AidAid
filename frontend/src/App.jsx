import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import React, { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/Header";
import Home from "./components/Home";
import AboutGoal from "./components/AboutGoal";
import Footer from "./components/Footer";
import EmailVerification from "./components/Authentication/EmailVerification";
import ForgotPassword from "./components/Authentication/ForgotPassword";
import Login from "./components/Authentication/Login";
import Register from "./components/Authentication/Register";
import ResetPassword from "./components/Authentication/ResetPassword";
import DonatePage from "./components/Donate/DonatePage";
import DonateDetailsPage from "./components/Donate/DonateDatailsPage";
import RequestDonate from "./components/Donate/RequestDonate";
import SupportPage from "./components/Support/SupportPage";
import FAQS from "./components/Support/FAQS";
import JoinPage from "./components/Join";
import MakeDonation from "./components/Donate/MakeDonation";
import RequesterDashboard from "./components/RequesterDashboard/Layout";
import RequesterDashboardContent from "./components/RequesterDashboard/RequesterDashboardContent";
import ProfileSettings from "./components/RequesterDashboard/RequesterProfile";
import DonorDashboard from "./components/Donor/DonorDashboard";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./components/Authentication/AuthContext";
import DonationSuccess from "./components/Donate/DonationSuccess";
import DonationPending from "./components/Donate/DonationPending";
//Admin
import Layout from "./components/admin/components/Layout";
import Dashboard from "./components/admin/pages/Dashboard";
import NewRequsts from "./components/admin/pages/Requests/NewRequests";
// import Donations from "./components/admin/pages/Donations";
import Users from "./components/admin/pages/Users/Users";
import Analytics from "./components/admin/pages/Analytics";
// import UserDetail from "./components/admin/pages/DetailPages/UserDetail";
import DonorDetail from "./components/admin/pages/DetailPages/DonorDetail";
import RequestDetail from "./components/admin/pages/DetailPages/RequestDetail";
import DonationFinished from "./components/admin/pages/DetailPages/DonationFinished";
// import AdminDetail from "./components/admin/pages/DetailPages/AdminDetail";
import Notifications from "./components/admin/pages/Notifications";
import Settings from "./components/admin/pages/Settings";

import AddAdmin from "./components/admin/components/AddAdmin";
import DonationHistory from "./components/admin/pages/Donations/DonationHistory";
import ApprovedRequests from "./components/admin/pages/Requests/ApprovedRequests";
import NeedRevisionRequests from "./components/admin/pages/Requests/NeedRevisionRequests";
import RejectedRequests from "./components/admin/pages/Requests/RejectedRequests";
// import Admins from "./components/admin/pages/Users/Admins";
// import Donors from "./components/admin/pages/Users/Donors";
// import Requesters from "./components/admin/pages/Users/Requesters";
import ActiveDonations from "./components/admin/pages/Donations/ActiveDonations";
import ActiveDonationDetail from "./components/admin/pages/DetailPages/ActiveDonationDetail";
import EditUserPage from "./components/admin/pages/Users/EditUserPage";

// 🔹 Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]); // Runs when the pathname changes

  return null;
};
function App() {
  const location = useLocation();
  const [popup, setPopup] = useState(null);
  const [isSidePopupOpen, setIsSidePopupOpen] = useState(false);
  const [user, setUser] = useState({
    id: "12345",
    username: "JohnDoe",
    email: "johndoe@example.com",
    phoneNumber: "+1234567890",
    location: "New York, USA",
    profilePicture: "",
  });

  // Hide header and footer on dashboard pages
  const dashboardPaths = ["/requester-dashboard", "/admin", "/donor-dashboard"];
  const isDashboardRoute = dashboardPaths.some((path) =>
    location.pathname.startsWith(path)
  );

  const openPopup = (popupName) => setPopup(popupName);
  const closePopup = () => setPopup(null);
  const handleUpdateUser = (updatedUser) => setUser(updatedUser);

  const renderPopup = () => {
    switch (popup) {
      case "login":
        return (
          <Login isOpen={true} onClose={closePopup} openPopup={openPopup} />
        );
      case "register":
        return (
          <Register isOpen={true} onClose={closePopup} openPopup={openPopup} />
        );
      case "forgot-password":
        return (
          <ForgotPassword
            isOpen={true}
            onClose={closePopup}
            openPopup={openPopup}
          />
        );
      case "email-verification":
        return (
          <EmailVerification
            isOpen={true}
            onClose={closePopup}
            openPopup={openPopup}
          />
        );
      case "reset-password":
        return (
          <ResetPassword
            isOpen={true}
            onClose={closePopup}
            openPopup={openPopup}
          />
        );
      default:
        return null;
    }
  };

  return (
    <ThemeProvider>
      <AuthProvider>
        {/* Header only if not in dashboard */}
        {!isDashboardRoute && (
          <Header
            openPopup={openPopup}
            user={user}
            isSidePopupOpen={isSidePopupOpen}
            setIsSidePopupOpen={setIsSidePopupOpen}
          />
        )}
       
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/donate-page"
            element={<DonatePage openPopup={openPopup} />}
          />
          <Route path="/details/:id" element={<DonateDetailsPage />} />
          <Route path="/donate/:id/:name" element={<MakeDonation  openPopup={openPopup} />} />
          <Route path="/request" element={<RequestDonate  openPopup={openPopup} />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/join" element={<JoinPage />} />
          <Route path="/impact" element={<AboutGoal />} />
          <Route path="/faqs" element={<FAQS />} />
          <Route path="/requester-dashboard/*" element={<RequesterDashboard />}>
            <Route path="" element={<RequesterDashboardContent />} />
            <Route path="profile" element={<ProfileSettings />} />
          </Route>
          <Route path="/donor-dashboard/*" element={<DonorDashboard />} />
          <Route path="/donation-success" element={<DonationSuccess />} />

          <Route path="/donation-pending" element={<DonationPending />} />

          <Route path="/admin" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="/admin/requests/new" element={<NewRequsts />} />
            <Route path="/admin/requests/new/:id" element={<RequestDetail />} />
            <Route
              path="/admin/users/edit/:userId"
              element={<EditUserPage />}
            />
            <Route
              path="/admin/requests/approved"
              element={<ApprovedRequests />}
            />
            <Route
              path="/admin/requests/approved/:id"
              element={<ActiveDonationDetail />}
            />
            <Route
              path="/admin/requests/need-revision"
              element={<NeedRevisionRequests />}
            />
            <Route
              path="/admin/requests/rejected"
              element={<RejectedRequests />}
            />
            <Route
              path="/admin/donations/history/:id"
              element={<DonationFinished />}
            />
            {/* <Route path="/admin/donations" element={<Donations />} /> */}
            <Route
              path="/admin/donations/active"
              element={<ActiveDonations />}
            />
            <Route
              path="/admin/donations/active/:id"
              element={<ActiveDonationDetail />}
            />
            <Route
              path="/admin/donations/history"
              element={<DonationHistory />}
            />
            <Route path="/admin/donor/:id" element={<DonorDetail />} />
            <Route path="/admin/users" element={<Users openPopup={openPopup} />} />
            
            <Route
              path="/admin/users/add_user"
              element={
                <Register
                  isOpen={true}
                  onClose={closePopup}
                  openPopup={openPopup}
                />
              }
            />
            <Route path="/admin/users/add_admin" element={<AddAdmin />} />
            <Route path="/admin/analytics" element={<Analytics />} />
            <Route path="/admin/notifications" element={<Notifications />} />
            <Route path="/admin/settings" element={<Settings />} />
          </Route>
        </Routes>

        {/* Auth Popups */}
        {popup && renderPopup()}

        {/* Profile Side Popup */}
        {isSidePopupOpen && (
          <ProfileSidePopup
            user={user}
            setIsSidePopupOpen={setIsSidePopupOpen}
            onUpdateUser={handleUpdateUser}
          />
        )}

        {/* Footer only if not in dashboard */}
        {!isDashboardRoute && <Footer />}
        
<ToastContainer
  position="top-right"
  autoClose={3000}
  theme="light"
  toastClassName="text-blue-600" // Tailwind class or custom CSS
/>

      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;