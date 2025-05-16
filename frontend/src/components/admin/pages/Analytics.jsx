import React from "react";
import { useState, useContext } from "react";
import { BarChart, LineChart, PieChart } from "../components/ChartComponents"; // You'll need to implement or import these
import { ThemeContext } from "../../../context/ThemeContext";

const Analytics = () => {
  const [selectedSeason, setSelectedSeason] = useState("monthly");

  const { isDarkMode } = useContext(ThemeContext);

  const toggleSidebar = () => {};
  const donationsData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Donations",
        data: [5000, 8000, 12000, 9000, 15000, 18000],
        backgroundColor: "rgba(236, 72, 153, 0.6)",
      },
    ],
  };

  const requestsData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Requests",
        data: [20, 35, 40, 30, 45, 60],
        borderColor: "rgba(79, 70, 229, 0.8)",
        fill: false,
      },
    ],
  };

  const donorsData = {
    labels: ["New", "Recurring", "Corporate"],
    datasets: [
      {
        data: [120, 80, 50],
        backgroundColor: [
          "rgba(16, 185, 129, 0.6)",
          "rgba(245, 158, 11, 0.6)",
          "rgba(59, 130, 246, 0.6)",
        ],
      },
    ],
  };

  const usersData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Active Users",
        data: [150, 220, 300, 350, 420, 500],
        backgroundColor: "rgba(139, 92, 246, 0.6)",
      },
    ],
  };

  return (
    <div
      className={`space-y-8 p-6 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100"
      }`}
    >
      <div className="flex justify-between items-center mb-1">
        <h1 className="text-3xl font-bold mb-1">Analytics Dashboard</h1>
        <div className="flex items-center gap-2">
          <label htmlFor="currency" className="text-sm font-medium">
            Showcase:
          </label>
          <select
            id="showcase"
            value={selectedSeason}
            onChange={(e) => setSelectedSeason(e.target.value)}
            className={`${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } p-2 rounded focus:outline-none`}
          >
            <option value="yearly">yearly</option>
            <option value="monthly">monthly</option>
            <option value="weekly">weekly</option>
            <option value="daily">daily</option>
          </select>
        </div>
      </div>

      {/* Stats Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Donations"
          value="$52,400"
          change="+12.5%"
          isIncrease={true}
          description="Increased by $5,800 this month"
        />
        <StatCard
          title="Requests Fulfilled"
          value="186"
          change="+8.2%"
          isIncrease={true}
          description="32 more than last month"
        />
        <StatCard
          title="New Donors"
          value="84"
          change="+15.3%"
          isIncrease={true}
          description="11 more than last month"
        />
        <StatCard
          title="Active Users"
          value="1,240"
          change="+4.1%"
          isIncrease={true}
          description="Steady growth continues"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Donations Chart */}
        <div
          className={`rounded-lg shadow p-6 ${
            isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
          }`}
        >
          <h2 className="text-xl font-semibold mb-4">
            Donation Trends
            <span className="ml-2 text-sm text-green-500">
              ↑ 12.5% increase
            </span>
          </h2>
          <p
            className={`mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
          >
            Monthly donation amounts showing consistent growth, with June being
            our best month yet.
          </p>
          <div className="h-64">
            <BarChart data={donationsData} />
          </div>
        </div>

        {/* Requests Chart */}
        <div
          className={`rounded-lg shadow p-6 ${
            isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
          }`}
        >
          <h2 className="text-xl font-semibold mb-4">
            Request Fulfillment
            <span className="ml-2 text-sm text-green-500">↑ 8.2% increase</span>
          </h2>
          <p
            className={`mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
          >
            Number of requests fulfilled has increased steadily with improved
            processing efficiency.
          </p>
          <div className="h-64">
            <LineChart data={requestsData} />
          </div>
        </div>

        {/* Donors Chart */}
        <div
          className={`rounded-lg shadow p-6 ${
            isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
          }`}
        >
          <h2 className="text-xl font-semibold mb-4">
            Donor Composition
            <span className="ml-2 text-sm text-green-500">
              ↑ 15.3% new donors
            </span>
          </h2>
          <p
            className={`mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
          >
            Breakdown of donor types showing healthy growth in new donor
            acquisition.
          </p>
          <div className="h-64">
            <PieChart data={donorsData} />
          </div>
        </div>

        {/* Users Chart */}
        <div
          className={`rounded-lg shadow p-6 ${
            isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
          }`}
        >
          <h2 className="text-xl font-semibold mb-4">
            User Growth
            <span className="ml-2 text-sm text-green-500">↑ 4.1% monthly</span>
          </h2>
          <p
            className={`mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
          >
            Platform adoption continues to grow with 500 active users in June.
          </p>
          <div className="h-64">
            <BarChart data={usersData} />
          </div>
        </div>
      </div>
    </div>
  );
};

// StatCard component for the overview cards
const StatCard = ({ title, value, change, isIncrease, description }) => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <div
      className={`p-6 rounded-lg shadow ${
        isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-700"
      }`}
    >
      <h3 className="text-sm font-medium">{title}</h3>
      <p className="text-2xl font-bold mt-1">{value}</p>
      <div className="flex items-center mt-2">
        <span
          className={`text-sm font-medium ${
            isIncrease ? "text-green-500" : "text-red-500"
          }`}
        >
          {change}
        </span>
        <span
          className={`text-sm ml-2 ${
            isDarkMode ? "text-gray-200" : "text-gray-600"
          }`}
        >
          {description}
        </span>
      </div>
    </div>
  );
};

export default Analytics;
