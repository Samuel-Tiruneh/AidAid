import React, { useState, useContext } from "react";
import { BellIcon } from "@heroicons/react/24/solid";
import { Home } from "lucide-react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../../../context/ThemeContext";

const Navbar = ({ toggleSidebar }) => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);

  // const [shrink, setShrink] = useState(false);

  return (
    <nav
      className={`p-2 flex justify-between items-center shadow-md sticky top-0 ${
        isDarkMode ? "bg-gray-800 text-white" : "bg-gray-100"
      }`}
    >
      {/* Left Side (Sidebar Toggle & Title) */}
      <div className="flex items-center space-x-4">
        {/* <button
          onClick={() => {
            toggleSidebar();
            setShrink(!shrink);
          }}
          className="p-2 rounded-full hover:bg-pink-500 transition"
        >
          {shrink ? (
            <PanelRightOpen className="h-6 w-6" />
          ) : (
            <PanelLeftOpen className="h-6 w-6" />
          )}
        </button> */}
      </div>

      {/* Right Side (Notifications, Theme, Login) */}
      <div className="flex items-center space-x-3">
        {/* Notification Icon */}
        <Link to={"/admin/notifications"} className="p-2 transition">
          <BellIcon className="h-6 w-6 text-pink-700" />
        </Link>

        {/* Login Button */}
        <Link
          to={"/"}
          className="bg-pink-600 font-bold text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition"
        >
          <Home className="h-6 w-6" />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
