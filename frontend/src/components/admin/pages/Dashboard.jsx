import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { ThemeContext } from "../../../context/ThemeContext";
import {
  DollarOutlined,
  ArrowRightOutlined,
  FileDoneOutlined,
  TeamOutlined,
} from "@ant-design/icons";

const Dashboard = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [analytics, setAnalytics] = useState({
    totalDonated: 0,
    totalDonations: 0,
    totalRequests: 0,
    totalUsers: 0,
    donationIncrease: 12.5,
    requestIncrease: 8.2,
  });
  const [activeDonations, setActiveDonations] = useState([]);
  const [urgentRequests, setUrgentRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setErrors({});

      try {
        const [donatedRes, donationsRes, requestsRes, usersRes] =
          await Promise.all([
            axios
              .get("http://localhost:5000/api/donations/total", {
                params: { status: "completed" },
              })
              .catch((err) => ({
                error:
                  err.response?.data?.error ||
                  "Failed to fetch total donated amount",
              })),
            axios
              .get("http://localhost:5000/api/donations/count")
              .catch((err) => ({
                error:
                  err.response?.data?.error ||
                  "Failed to fetch donations count",
              })),
            axios
              .get("http://localhost:5000/api/request-donate/fulfilled/count")
              .catch((err) => ({
                error:
                  err.response?.data?.error ||
                  "Failed to fetch fulfilled requests count",
              })),
            axios.get("http://localhost:5000/api/users").catch((err) => ({
              error: err.response?.data?.error || "Failed to fetch users count",
            })),
          ]);

        console.log("Total Donated Response:", donatedRes.data || donatedRes);
        console.log(
          "Donations Count Response:",
          donationsRes.data || donationsRes
        );
        console.log(
          "Fulfilled Requests Response:",
          requestsRes.data || requestsRes
        );
        console.log("Users Response:", usersRes.data || usersRes);

        const newErrors = {};
        if (donatedRes.error) newErrors.totalDonated = donatedRes.error;
        if (donationsRes.error) newErrors.donationsCount = donationsRes.error;
        if (requestsRes.error) newErrors.requestsCount = requestsRes.error;
        if (usersRes.error) newErrors.usersCount = usersRes.error;

        setAnalytics({
          totalDonated: donatedRes.data?.total || 0,
          totalDonations: donationsRes.data?.count || 0,
          totalRequests: requestsRes.data?.count || 0,
          totalUsers: Array.isArray(usersRes.data)
            ? usersRes.data.length
            : usersRes.data?.count || 0,
          donationIncrease: 12.5,
          requestIncrease: 8.2,
        });

        const activeDonationsRes = await axios
          .get("http://localhost:5000/api/request-donate", {
            params: { donationStatus: "Active" },
          })
          .catch((err) => ({
            error:
              err.response?.data?.error || "Failed to fetch active donations",
          }));
        console.log(
          "Active Donations Response:",
          activeDonationsRes.data || activeDonationsRes
        );
        if (activeDonationsRes.error) {
          newErrors.activeDonations = activeDonationsRes.error;
          setActiveDonations([]);
        } else {
          const activeDonationsData = Array.isArray(activeDonationsRes.data)
            ? activeDonationsRes.data
            : activeDonationsRes.data.requests ||
              activeDonationsRes.data.data ||
              [];
          setActiveDonations(activeDonationsData);
        }

        const urgentRequestsRes = await axios
          .get("http://localhost:5000/api/request-donate", {
            params: { requestStatus: "New" },
          })
          .catch((err) => ({
            error:
              err.response?.data?.error || "Failed to fetch active donations",
          }));
        console.log(
          "Active Donations Response:",
          urgentRequestsRes.data || urgentRequestsRes
        );
        if (urgentRequestsRes.error) {
          newErrors.activeDonations = urgentRequestsRes.error;
          setUrgentRequests([]);
        } else {
          const urgentRequestsData = Array.isArray(urgentRequestsRes.data)
            ? urgentRequestsRes.data
            : urgentRequestsRes.data.requests ||
              urgentRequestsRes.data.data ||
              [];
          setUrgentRequests(urgentRequestsData);
        }

        setErrors(newErrors);
      } catch (err) {
        const generalError =
          err.response?.data?.error || "Failed to fetch dashboard data";
        setErrors((prev) => ({ ...prev, general: generalError }));
        console.error("General Error:", err);
        setActiveDonations([]);
        setUrgentRequests([]);
        setAnalytics({
          totalDonated: 0,
          totalDonations: 0,
          totalRequests: 0,
          totalUsers: 0,
          donationIncrease: 12.5,
          requestIncrease: 8.2,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const popularDonations = Array.isArray(activeDonations)
    ? activeDonations.filter((request) => request.amountRaised > 100000)
    : [];

  const medicalRequests = Array.isArray(urgentRequests)
    ? urgentRequests.filter(
        (request) => request.category.toLowerCase() === "medical"
      )
    : [];

  return (
    <div
      className={`p-6 min-h-screen font-poppins transition-colors duration-300 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-pink-600 bg-clip-text text-transparent mb-8">
          Overview Dashboard
        </h1>

        {Object.keys(errors).length > 0 && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg shadow">
            <p className="font-semibold">Errors:</p>
            <ul className="list-disc pl-5">
              {Object.entries(errors).map(([key, msg]) => (
                <li key={key} className="text-sm">
                  {msg}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard
            title="Total Donated Money"
            value={
              loading
                ? "Loading..."
                : `${analytics.totalDonated.toLocaleString()} ETB`
            }
            icon={<DollarOutlined />}
            button="Donation Page"
            path="/admin/donations/history"
            isDarkMode={isDarkMode}
          />
          <StatCard
            title="Total Donations"
            value={
              loading ? "Loading..." : analytics.totalDonations.toLocaleString()
            }
            icon={<ArrowRightOutlined />}
            button="Donation Page"
            path="/admin/donations/history"
            isDarkMode={isDarkMode}
          />
          <StatCard
            title="Fulfilled Requests"
            value={
              loading ? "Loading..." : analytics.totalRequests.toLocaleString()
            }
            icon={<FileDoneOutlined />}
            button="Request Page"
            path="/admin/requests"
            isDarkMode={isDarkMode}
          />
          <StatCard
            title="Total Users"
            value={
              loading ? "Loading..." : analytics.totalUsers.toLocaleString()
            }
            icon={<TeamOutlined />}
            button="Users Page"
            path="/admin/users"
            isDarkMode={isDarkMode}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`p-6 rounded-xl shadow-lg transition-all duration-300 ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Popular Donations</h2>
              <span className="text-sm text-pink-500 dark:text-pink-400">
                ↑ {analytics.donationIncrease}% increase
              </span>
            </div>
            <ul className="space-y-4">
              {loading ? (
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Loading...
                </p>
              ) : popularDonations.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400">
                  No donations with over 100,000 ETB raised.
                </p>
              ) : (
                popularDonations.slice(0, 3).map((request) => (
                  <motion.li
                    key={request._id}
                    whileHover={{ scale: 1.02 }}
                    className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
                      isDarkMode
                        ? "bg-gray-700 text-gray-100"
                        : "bg-gray-300 text-gray-700"
                    }`}
                  >
                    <img
                      src={request.photo || "https://via.placeholder.com/48"}
                      alt={request.fullName}
                      className="w-12 h-12 rounded-full object-cover border-2 border-pink-500"
                    />
                    <div className="flex-1">
                      <p className="font-semibold">{request.fullName}</p>
                      <p
                        className={`text-sm ${
                          isDarkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        Goal:{" "}
                        <span className="text-pink-500 font-bold">
                          {request.neededAmount.toLocaleString()}
                        </span>
                      </p>
                    </div>
                    <div
                      className={`text-sm ${
                        isDarkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      Raised:{" "}
                      <span className="text-green-500 font-bold">
                        {request.amountRaised.toLocaleString()}
                      </span>
                    </div>
                    <Link
                      to={`/admin/requests/${request._id}`}
                      className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-3 py-1 rounded-md font-medium transition duration-200 shadow"
                    >
                      View
                    </Link>
                  </motion.li>
                ))
              )}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className={`p-6 rounded-xl shadow-lg transition-all duration-300 ${
              isDarkMode ? "bg-gray-800 " : "bg-white "
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Urgent Medical Requests</h2>
              <span className="text-sm text-pink-500 dark:text-pink-400">
                ↑ {analytics.requestIncrease}% increase
              </span>
            </div>
            <ul className="space-y-4">
              {loading ? (
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Loading...
                </p>
              ) : medicalRequests.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400">
                  No medical requests found.
                </p>
              ) : (
                medicalRequests.slice(0, 3).map((request) => (
                  <motion.li
                    key={request._id}
                    whileHover={{ scale: 1.02 }}
                    className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
                      isDarkMode
                        ? "bg-gray-700 text-gray-100"
                        : "bg-gray-300 text-gray-700"
                    }`}
                  >
                    <img
                      src={request.photo || "https://via.placeholder.com/48"}
                      alt={request.fullName}
                      className="w-12 h-12 rounded-full object-cover border-2 border-pink-500"
                    />
                    <div className="flex-1">
                      <p className="font-semibold">{request.fullName}</p>
                      <p
                        className={`text-sm ${
                          isDarkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        Case:{" "}
                        <span className="text-pink-500 font-bold">
                          {request.category}
                        </span>
                      </p>
                    </div>
                    <div
                      className={`text-sm ${
                        isDarkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      Need:{" "}
                      <span className="text-green-500 font-bold">
                        {request.neededAmount.toLocaleString()}
                      </span>
                    </div>
                    <Link
                      to={`/admin/requests/new/${request._id}`}
                      className="mt-auto bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 text-center"
                    >
                      Approval
                    </Link>
                  </motion.li>
                ))
              )}
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, button, path, isDarkMode }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className={`p-6 rounded-xl shadow-lg transition-all duration-300 ${
      isDarkMode
        ? "bg-gradient-to-br from-gray-800 to-gray-700 text-white"
        : "bg-gradient-to-br from-white to-gray-50 text-gray-900"
    }`}
  >
    <div className="flex justify-between items-start">
      <div>
        <p
          className={`text-sm font-medium ${
            isDarkMode ? "text-gray-300" : "text-gray-500"
          }`}
        >
          {title}
        </p>
        <p className="text-2xl font-bold mt-2">{value}</p>
      </div>
      <motion.div
        whileHover={{ scale: 1.2, rotate: 10 }}
        whileTap={{ scale: 0.9 }}
        className={`text-3xl ${isDarkMode ? "text-pink-400" : "text-pink-500"}`}
      >
        {icon}
      </motion.div>
    </div>
    <div className="mt-4 flex justify-between items-center">
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300">
        ↑ Increased
      </span>
      <Link
        to={path}
        className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-3 py-1 rounded-md text-sm font-medium transition duration-200 shadow"
      >
        {button}
      </Link>
    </div>
  </motion.div>
);

export default Dashboard;