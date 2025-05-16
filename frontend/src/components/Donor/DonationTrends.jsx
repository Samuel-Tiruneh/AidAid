import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { FaHandHoldingHeart, FaHistory, FaChartLine, FaArrowUp } from "react-icons/fa";
import { ThemeContext } from "../../context/ThemeContext";
import { useAuth } from "../Authentication/AuthContext";
import axios from "axios";

const DonationHistory = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const { user } = useAuth();
  const [donationHistory, setDonationHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [metrics, setMetrics] = useState({
    totalDonations: 0,
    donationCount: 0,
    monthlyTrend: 0,
    totalAmount: 0,
    averageDonation: 0
  });

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/donations/by-donor`, {
          params: { donor: user.id },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        
        if (response.data.success) {
          const donations = response.data.donations.map(donation => ({
            id: donation._id,
            recipientName: donation.recipientName || 
                         (donation.requester?.name || 'Unknown Recipient'),
            amount: donation.amount,
            date: new Date(donation.createdAt).toLocaleDateString(),
            status: donation.status
          }));
          
          setDonationHistory(donations);
          
          const totalAmount = response.data.totalAmount || 
                            donations.reduce((sum, d) => sum + d.amount, 0);
          const count = response.data.count || donations.length;
          const average = response.data.metrics?.averageDonation || (count > 0 ? (totalAmount / count).toFixed(2) : 0);
          const trend = count > 0 ? ((count / 30) * 100).toFixed(1) : 0;
          
          setMetrics({
            totalDonations: totalAmount,
            donationCount: count,
            monthlyTrend: trend,
            averageDonation: average,
            totalAmount: totalAmount
          });
        }
      } catch (err) {
        setError(err.response?.data?.error || err.message || "Failed to fetch donations");
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchDonations();
    }
  }, [user]);

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0, opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  // Inline color logic
  const bg = isDarkMode ? "bg-[#18181b]" : "bg-white";
  const border = isDarkMode ? "border-[#27272a]" : "border-gray-200";
  const text = isDarkMode ? "text-gray-100" : "text-gray-900";
  const textGray = isDarkMode ? "text-gray-400" : "text-gray-600";
  const hoverBg = isDarkMode ? "hover:bg-[#23232b]" : "hover:bg-gray-50";

  if (loading) {
    return (
      <div className={`${bg} p-8 rounded-3xl shadow-lg border ${border}`}>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${bg} p-8 rounded-3xl shadow-lg border ${border}`}>
        <div className="text-red-500 text-center py-8">{error}</div>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={container}
      className={`${bg} p-8 rounded-3xl shadow-lg border ${border}`}
    >
      <div className="flex items-center justify-between mb-8">
        <motion.h2
          variants={item}
          className={`text-3xl font-extrabold flex items-center space-x-3 ${text}`}
        >
          <FaHandHoldingHeart className="w-8 h-8" style={{ color: "#ec4899" }} />
          <span>Your Giving Summary</span>
        </motion.h2>
        
        <div className="flex items-center space-x-4">
          {/* Donor Tier Badge */}
          <motion.div
            variants={item}
            className={`px-4 py-2 rounded-lg shadow-md text-sm font-semibold ${
              metrics.donationCount >= 4
                ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900"
                : metrics.donationCount >= 3
                ? "bg-gradient-to-r from-purple-400 to-purple-500 text-white"
                : metrics.donationCount >= 2
                ? "bg-gradient-to-r from-blue-400 to-blue-500 text-white"
                : isDarkMode
                  ? "bg-[#23232b] text-gray-200"
                  : "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800"
            }`}
          >
            {metrics.donationCount >= 4
              ? "Gold Donor"
              : metrics.donationCount >= 3
              ? "Premium Donor"
              : metrics.donationCount >= 2
              ? "Standard Donor"
              : "Basic Donor"}
          </motion.div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Total Amount Card */}
        <motion.div
          variants={item}
          whileHover={{ scale: 1.05 }}
          className={`relative overflow-hidden p-8 rounded-2xl border ${isDarkMode ? "bg-gradient-to-br from-[#23232b] to-[#2d2d37] border-[#39394a]" : "bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200"}`}
        >
          <div className={`absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-40 ${isDarkMode ? "bg-indigo-800" : "bg-indigo-100"}`}></div>
          <div className="relative z-10">
            <div className="flex items-center mb-4">
              <div className={`p-4 rounded-full mr-4 ${isDarkMode ? "bg-indigo-900" : "bg-indigo-200"}`}>
                <FaHandHoldingHeart className="w-8 h-8" style={{ color: isDarkMode ? "#a5b4fc" : "#6366f1" }} />
              </div>
              <span className={`text-lg font-medium ${textGray}`}>Total Given</span>
            </div>
            <p className={`text-4xl font-bold mb-2 ${text}`}>${metrics.totalAmount}</p>
            <div className={`flex items-center text-sm ${textGray}`}>
              <FaArrowUp className="mr-1" style={{ color: "#22c55e" }} />
              <span>Average: ${metrics.averageDonation} per donation</span>
            </div>
          </div>
        </motion.div>

        {/* Donation Count Card */}
        <motion.div
          variants={item}
          whileHover={{ scale: 1.05 }}
          className={`relative overflow-hidden p-8 rounded-2xl border ${
            isDarkMode
              ? "bg-gradient-to-br from-[#2d132c] to-[#3a1d47] border-pink-900"
              : "bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200"
          }`}
        >
          <div className={`absolute -right-8 -bottom-8 w-32 h-32 rounded-full opacity-40 ${isDarkMode ? "bg-pink-900" : "bg-pink-100"}`}></div>
          <div className="relative z-10">
            <div className="flex items-center mb-4">
              <div className={`p-4 rounded-full mr-4 ${isDarkMode ? "bg-pink-900" : "bg-pink-200"}`}>
                <FaHistory className="w-8 h-8" style={{ color: isDarkMode ? "#f472b6" : "#ec4899" }} />
              </div>
              <span className={`text-lg font-medium ${textGray}`}>Total Donations</span>
            </div>
            <p className={`text-4xl font-bold mb-2 ${text}`}>{metrics.donationCount}</p>
            <div className={`flex items-center text-sm ${textGray}`}>
              <FaArrowUp className="mr-1" style={{ color: "#22c55e" }} />
              <span>Helped {metrics.donationCount} people</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Donations Table */}
      <motion.div variants={item} className="mt-8">
        <h3 className={`text-xl font-semibold mb-6 flex items-center ${text}`}>
          <FaHistory className="mr-3" style={{ color: isDarkMode ? "#818cf8" : "#6366f1" }} />
          <span>Your Donation History</span>
        </h3>
        <div className={`${bg} rounded-xl shadow-lg border ${border} overflow-hidden`}>
          <table className={`min-w-full divide-y ${isDarkMode ? "divide-[#27272a]" : "divide-gray-200"}`}>
            <thead className={isDarkMode ? "bg-[#23232b]" : "bg-gray-50"}>
              <tr>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${textGray}`}>
                  Recipient
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${textGray}`}>
                  Amount
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${textGray}`}>
                  Date
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${textGray}`}>
                  Status
                </th>
              </tr>
            </thead>
            <tbody className={`${bg} divide-y ${isDarkMode ? "divide-[#27272a]" : "divide-gray-200"}`}>
              {donationHistory.map((donation) => (
                <tr key={donation.id} className={`${hoverBg} transition-all`}>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${text}`}>
                    {donation.recipientName}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${isDarkMode ? "text-green-400" : "text-green-600"}`}>
                    ${donation.amount}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${textGray}`}>
                    {donation.date}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                    donation.status === 'completed' ? (isDarkMode ? "text-green-400" : "text-green-500") :
                    donation.status === 'pending' ? (isDarkMode ? "text-yellow-400" : "text-yellow-500") :
                    (isDarkMode ? "text-red-400" : "text-red-500")
                  }`}>
                    {donation.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DonationHistory;
