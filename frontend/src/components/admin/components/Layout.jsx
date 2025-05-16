import React, { useContext, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "../../Header";
import { ThemeContext } from "../../../context/ThemeContext";

const Layout = () => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`flex min-h-screen transition-colors duration-300`}>
      {/* Sidebar */}
      <aside className="">
        <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {/* Navbar */}
        <Header />

        {/* Page Content */}
        <div
          className={`flex-1 transition-colors duration-300 ${
            isDarkMode
              ? "bg-gray-900 text-gray-100"
              : "bg-gray-100 text-gray-900"
          }`}
        >
          <Outlet /> {/* Render the child route components here */}
        </div>
      </main>
    </div>
  );
};

export default Layout;
