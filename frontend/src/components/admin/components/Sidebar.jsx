import React, { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BarChart,
  HeartHandshake,
  FileText,
  Users,
  Bell,
  Settings,
  PanelRightOpen,
  PanelLeftOpen,
  FilePlus2,
  FileCheck2,
  FileClock,
  FileX2,
} from "lucide-react";

import logo from "../../../assets/images/logo.png";
import { ThemeContext } from "../../../context/ThemeContext";

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const location = useLocation();

  const { isDarkMode } = useContext(ThemeContext);

  const [shrink, setShrink] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState(null);

  const menuItems = [
    {
      title: "Dashboard",
      items: [
        {
          name: "Overview",
          path: "/admin",
          icon: <LayoutDashboard size={20} />,
        },
        {
          name: "Analytics",
          path: "/admin/analytics",
          icon: <BarChart size={20} />,
        },
      ],
    },
    {
      title: "Management",
      items: [
        {
          name: "Donations",
          icon: <HeartHandshake size={20} />,
          children: [
            {
              name: "Active Donations",
              path: "/admin/donations/active",
              icon: <FileText size={16} />,
            },
            {
              name: "Donation History",
              path: "/admin/donations/history",
              icon: <FileCheck2 size={16} />,
            },
          ],
        },

        {
          name: "Requests",
          icon: <FileText size={20} />,
          children: [
            {
              name: "New Requests",
              path: "/admin/requests/new",
              icon: <FilePlus2 size={16} />, // plus icon for new
            },
            {
              name: "Approved Requests",
              path: "/admin/requests/approved",
              icon: <FileCheck2 size={16} />, // check icon for approved
            },
            {
              name: "Need Revision",
              path: "/admin/requests/need-revision",
              icon: <FileClock size={16} />, // clock icon for pending/revision
            },
            {
              name: "Rejected Requests",
              path: "/admin/requests/rejected",
              icon: <FileX2 size={16} />, // cross icon for rejected
            },
          ],
        },

        {
          name: "Users",
          path: "/admin/users",
          icon: <Users size={20} />,
        },
        ,
      ],
    },
  ];

  const toggleExpand = (menuName) => {
    setExpandedMenu((prev) => (prev === menuName ? null : menuName));
  };

  return (
    <div
      className={`sticky top-0 ${
        isSidebarOpen ? "w-64" : "w-20"
      } h-screen flex flex-col transition-all duration-300 ${
        isDarkMode
          ? "bg-gray-700 text-white"
          : "bg-white shadow-2xl text-gray-900"
      }`}
    >
      {/* Logo and Name */}
      <div className="p-4 flex items-center space-x-3">
        <img
          src={logo}
          alt="Aid Platform Logo"
          className={`h-12 w-auto rounded-lg shadow-lg shadow-pink-600`}
        />
        <div>
          {/* <h1
            className={`text-xl font-bold ${
              !isSidebarOpen && "hidden"
            } font-medium`}
          >
            Tsedey Aid
          </h1> */}
          <p
            className={`text-sm ${
              (isDarkMode ? "text-gray-400" : "text-gray-600",
              !isSidebarOpen && "hidden")
            }`}
          >
            Admin Panel
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => {
              toggleSidebar();
              setShrink(!shrink);
            }}
            className="p-2 rounded-full hover:bg-pink-500 transition"
          >
            {shrink ? (
              <PanelLeftOpen className="h-6 w-6" />
            ) : (
              <PanelRightOpen className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>
      {/* <hr className="border-gray-500" /> */}

      {/* Navigation */}
      <nav className="flex-1 p-2">
        {menuItems.map((section, index) => (
          <div key={index}>
            <h2
              className={`text-sm font-semibold text-gray-400 px-4 mt-4 ${
                !isSidebarOpen && "hidden"
              } font-medium`}
            >
              {section.title}
            </h2>
            <ul>
              <li key="icon">
                {!isSidebarOpen && section.title == "Dashboard" && (
                  <button
                    onClick={() => {
                      toggleSidebar();
                      setShrink(!shrink);
                    }}
                    className="p-2 rounded-full hover:bg-pink-500 transition"
                  >
                    {shrink ? (
                      <PanelLeftOpen className="h-6 w-6" />
                    ) : (
                      <PanelRightOpen className="h-6 w-6" />
                    )}
                  </button>
                )}
              </li>
              {section.items.map((item, idx) => {
                const isActive = location.pathname.startsWith(item.path);

                return (
                  <li key={idx}>
                    {/* Parent item */}
                    {item.children ? (
                      <>
                        <button
                          onClick={() => toggleExpand(item.name)}
                          className={`w-full flex items-center justify-between p-3 rounded-md m-1 hover:bg-pink-600 hover:text-white ${
                            isActive ? "bg-gray-600 text-white" : ""
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            {item.icon}
                            <span
                              className={`${
                                !isSidebarOpen && "hidden"
                              } font-medium`}
                            >
                              {item.name}
                            </span>
                          </div>
                          {isSidebarOpen && (
                            <span>
                              {expandedMenu === item.name ? "▲" : "▼"}
                            </span>
                          )}
                        </button>

                        {/* Nested items */}
                        {expandedMenu === item.name && (
                          <ul className="ml-8">
                            {item.children.map((child, cIdx) => {
                              const isChildActive =
                                location.pathname === child.path;

                              return (
                                <li key={cIdx} className="mb-1">
                                  <Link
                                    to={child.path}
                                    className={`flex items-center space-x-2 p-2 text-sm rounded-md hover:bg-pink-500 hover:text-white ${
                                      isChildActive
                                        ? "bg-gray-600 text-white"
                                        : ""
                                    } ${
                                      isDarkMode && !isChildActive
                                        ? "text-white"
                                        : "text-gray-700"
                                    }`}
                                  >
                                    {child.icon}
                                    <span
                                      className={`${
                                        !isSidebarOpen && "hidden"
                                      }`}
                                    >
                                      {child.name}
                                    </span>
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </>
                    ) : (
                      // Regular single-level item
                      <Link
                        to={item.path}
                        className={`flex items-center space-x-3 p-3 rounded-md m-1 hover:bg-pink-600 hover:text-white ${
                          location.pathname === item.path
                            ? "bg-gray-600 text-white"
                            : ""
                        }`}
                      >
                        {item.icon}
                        <span
                          className={`${
                            !isSidebarOpen && "hidden"
                          } font-medium`}
                        >
                          {item.name}
                        </span>
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
            <hr className="border-gray-500" />
          </div>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="p-3">
        <Link
          to="/admin/notifications"
          className={`flex items-center space-x-3 p-3 rounded-md hover:bg-pink-600 hover:text-white ${
            location.pathname === "/notifications"
              ? "bg-gray-600 text-white"
              : ""
          }`}
        >
          <Bell size={20} />
          <span className={`font-midium ${!isSidebarOpen && "hidden"}`}>
            Notifications
          </span>
        </Link>
        <Link
          to="/admin/settings"
          className={`flex items-center space-x-3 p-3 rounded-md mt-1 hover:bg-pink-600 hover:text-white ${
            location.pathname === "/settings" ? "bg-gray-600 text-white" : ""
          }`}
        >
          <Settings size={20} />
          <span className={`font-midium ${!isSidebarOpen && "hidden"}`}>
            Settings
          </span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
