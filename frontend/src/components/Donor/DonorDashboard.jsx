import React, { useState, useContext } from "react";
import { useAuth } from "../Authentication/AuthContext"; // Import the hook
import Headers from "../Header";
import {
  faChartLine,
  faBell,
  faReceipt,
  faBook,
  faCog,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ThemeContext } from "../../context/ThemeContext";

// Import Components
import DonationTrends from "./DonationTrends";
import Notification from "./Notification";
import ReceiptDetails from "./ReceiptDetails";
import DonorStories from "./DonorStories";
import Settings from "./SettingsPage";
import DonationSummary from "./DonationSummary";
import DonatedRequestors from "./DonatedRequestors";

const DonorDashboard = () => {
  const { user } = useAuth(); // Use the user from context
  const [activeSection, setActiveSection] = useState("Donation Trends");
  const [collapsedSections, setCollapsedSections] = useState({
    general: true, // Initially collapsed
  });
  const { isDarkMode } = useContext(ThemeContext); // Get theme state

  const toggleSection = (section) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const menuItems = [
    { id: "Donation Trends", label: "Donation Trends", icon: faChartLine },
    { id: "Receipts", label: "Receipts", icon: faReceipt },
    { id: "Donor Stories", label: "Donor Stories", icon: faBook },
    { id: "Notifications", label: "Notifications", icon: faBell },
    { id: "Settings", label: "Settings", icon: faCog },
  ];

  const renderActiveSection = () => {
    switch (activeSection) {
      case "Donation Summary":
        return <DonationSummary donorName={user.name} />;
      case "Donation Trends":
        return <DonationTrends />;
      case "Notifications":
        return <Notification userId={user.id} token={user.token} />;
      case "Receipts":
        return <ReceiptDetails />;
      case "Donor Stories":
        return <DonorStories />;
      case "Settings":
        return <Settings userId={user.id} token={user.token} />;
      case "Donated Persons":
        return (
          <DonatedRequestors
            donatedRequestors={[
              "Alemu Kebede",
              "Tigest Sisay",
              "Meron Alemayehu",
            ]}
          />
        );
      default:
        return (
          <h2 className="text-xl font-bold">Select a section from the menu.</h2>
        );
    }
  };

  return (
    <div className="h-screen flex flex-col font-[poppins]">
      <Headers />
      <div className={`flex flex-1 ${isDarkMode ? "bg-gray-900" : "bg-white"}`}>
        {/* Sidebar */}
        <aside
          className={`w-64 overflow-y-auto ${
            isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"
          }`}
        >
          {/* Sidebar Menu */}
          <nav className="p-4 space-y-5">
            {menuItems.map((item) => (
              <button
                key={item.id}
                className={`w-full flex items-center gap-1.5 py-2 px-4 rounded-lg transition hover:${
                  isDarkMode ? "bg-gray-700" : "bg-gray-200"
                } ${
                  isDarkMode
                    ? "bg-gray-800 text-white"
                    : "bg-gray-100 text-black"
                }`}
                onClick={() => setActiveSection(item.id)}
              >
                <FontAwesomeIcon icon={item.icon} className="w-4 h-4" />
                <span className="capitalize">{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <main
            className={`flex-1 overflow-y-auto p-6 rounded-lg ${
              isDarkMode
                ? "bg-gray-800 shadow-lg shadow-gray-900/50"
                : "bg-white shadow-lg"
            }`}
          >
            {renderActiveSection()}
          </main>
        </div>
      </div>
    </div>
  );
};

export default DonorDashboard;
