import React, { useState } from "react";
import {
  LayoutDashboard,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import logo from "../../assets/images/logo.png";

const RequesterSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const navItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: "/requester-dashboard/",
    },
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div
      className={`h-full bg-gradient-to-b from-gray-800 to-gray-900 text-white flex flex-col justify-between transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      <div>
        <div className="p-4">
          {isCollapsed ? (
            <div className="flex justify-center">
              <button
                onClick={toggleSidebar}
                className="bg-gray-700 hover:bg-pink-600 rounded-full p-2"
                aria-label="Expand sidebar"
              >
                <ChevronRight size={20} className="text-white" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img src={logo} alt="Logo" className="h-10 w-10 rounded-lg" />
                <h1 className="text-xl font-bold">Tsedey Aid</h1>
              </div>
              <button
                onClick={toggleSidebar}
                className="bg-gray-700 hover:bg-pink-600 rounded-full p-2"
                aria-label="Collapse sidebar"
              >
                <ChevronLeft size={20} className="text-white" />
              </button>
            </div>
          )}
        </div>

        {/* Nav Items */}
        <nav className="mt-6 space-y-1 px-3">
          {navItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={`flex items-center ${
                isCollapsed ? "justify-center" : "space-x-3"
              } p-3 rounded-md hover:bg-pink-600 transition-colors ${
                location.pathname === item.path
                  ? "bg-pink-500 text-white"
                  : "text-gray-300 hover:text-white"
              }`}
              title={isCollapsed ? item.name : ""}
            >
              {React.cloneElement(item.icon, {
                className:
                  location.pathname === item.path
                    ? "text-white"
                    : "text-gray-400",
              })}
              {!isCollapsed && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="p-3 space-y-2">
        <Link
          to="/requester-dashboard/notifications"
          className={`flex items-center ${
            isCollapsed ? "justify-center" : "space-x-3"
          } p-3 rounded-md hover:bg-pink-600 transition-colors ${
            location.pathname === "/requester-dashboard/notifications"
              ? "bg-pink-500 text-white"
              : "text-gray-300 hover:text-white"
          }`}
          title={isCollapsed ? "Notifications" : ""}
        >
          <Bell
            size={20}
            className={
              location.pathname === "/requester-dashboard/notifications"
                ? "text-white"
                : "text-gray-400"
            }
          />
          {!isCollapsed && <span>Notifications</span>}
        </Link>

        <Link
          to="/requester-dashboard/profile"
          className={`flex items-center ${
            isCollapsed ? "justify-center" : "space-x-3"
          } p-3 rounded-md hover:bg-pink-600 transition-colors ${
            location.pathname === "/requester-dashboard/settings"
              ? "bg-pink-500 text-white"
              : "text-gray-300 hover:text-white"
          }`}
          title={isCollapsed ? "Settings" : ""}
        >
          <Settings
            size={20}
            className={
              location.pathname === "/requester-dashboard/profile"
                ? "text-white"
                : "text-gray-400"
            }
          />
          {!isCollapsed && <span>Settings</span>}
        </Link>
      </div>
    </div>
  );
};

export default RequesterSidebar;
