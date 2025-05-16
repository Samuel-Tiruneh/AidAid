import React, { useState } from "react";
import donationData from "../../components/Donate/DonationData";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiVideo, FiFileText, FiMapPin, FiUser, FiDollarSign, FiFilter } from "react-icons/fi";
import { FaEye, FaHeart, FaRegHeart, FaChartLine } from "react-icons/fa";
import { RiMoneyDollarCircleLine } from "react-icons/ri";

const DonatedRequestors = ({ donatedRequestors, isDarkMode }) => {
  const navigate = useNavigate();
  const [sortOption, setSortOption] = useState("name");
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");

  // Example data with additional fields
  const donatedAmounts = {
    "Alemu Kebede": { amount: 5000, currency: "ETB", date: "2023-05-15" },
    "Tigest Sisay": { amount: 4000, currency: "ETB", date: "2023-06-20" },
    "Meron Alemayehu": { amount: 10000, currency: "ETB", date: "2023-04-10" },
  };

  // Enhanced filter and merge
  const filteredData = donationData
    .filter((request) => donatedRequestors.includes(request.name))
    .map((request) => ({
      ...request,
      donatedInfo: donatedAmounts[request.name] || { amount: 0, currency: "ETB", date: "" },
      progress: Math.min(
        100,
        Math.round(
          ((donatedAmounts[request.name]?.amount || 0) / request.neededAmount) * 100
        )
      ),
    }));

  // Sorting logic
  const sortedData = [...filteredData].sort((a, b) => {
    if (sortOption === "name") return a.name.localeCompare(b.name);
    if (sortOption === "age") return a.age - b.age;
    if (sortOption === "category") return a.category.localeCompare(b.category);
    if (sortOption === "amount") return b.donatedInfo.amount - a.donatedInfo.amount;
    if (sortOption === "date") return new Date(b.donatedInfo.date) - new Date(a.donatedInfo.date);
    return 0;
  });

  // Filter by search and active filter
  const finalData = sortedData
    .filter((item) => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((item) => {
      if (activeFilter === "all") return true;
      if (activeFilter === "favorites") return favorites.includes(item.name);
      if (activeFilter === "fullyFunded") return item.progress >= 100;
      return true;
    });

  const toggleFavorite = (name) => {
    setFavorites(favorites.includes(name)
      ? favorites.filter(fav => fav !== name)
      : [...favorites, name]
    );
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95 }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`p-6 rounded-2xl shadow-lg ${isDarkMode ? "bg-gray-800" : "bg-white"}`}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h2 className={`text-2xl font-bold ${isDarkMode ? "text-pink-300" : "text-pink-700"} mb-2`}>
            Your Donation History
          </h2>
          <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            View all the requestors you've supported
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto mt-4 md:mt-0">
          <div className={`relative flex-1 md:w-64 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            <input
              type="text"
              placeholder="Search requestors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 focus:border-pink-500"
                  : "bg-gray-50 border-gray-300 focus:border-pink-300"
              } focus:outline-none`}
            />
            <FiFilter className="absolute left-3 top-3 text-gray-400" />
          </div>

          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className={`p-2 rounded-lg border ${
              isDarkMode
                ? "bg-gray-700 border-gray-600 text-gray-300"
                : "bg-gray-50 border-gray-300 text-gray-600"
            } focus:outline-none focus:ring-1 focus:ring-pink-500`}
          >
            <option value="name">Sort by Name</option>
            <option value="age">Sort by Age</option>
            <option value="category">Sort by Category</option>
            <option value="amount">Sort by Amount</option>
            <option value="date">Sort by Date</option>
          </select>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        {["all", "favorites", "fullyFunded"].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              activeFilter === filter
                ? isDarkMode
                  ? "bg-pink-600 text-white"
                  : "bg-pink-500 text-white"
                : isDarkMode
                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {filter === "all" && "All Donations"}
            {filter === "favorites" && "Favorites"}
            {filter === "fullyFunded" && "Fully Funded"}
          </button>
        ))}
      </div>

      {finalData.length > 0 ? (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {finalData.map((request) => (
              <motion.li
                key={request.name}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
                className={`rounded-xl overflow-hidden shadow-md transition-all duration-300 ${
                  isDarkMode ? "bg-gray-700" : "bg-white"
                } hover:shadow-lg`}
              >
                <div className="relative">
                  <img
                    src={request.RequesterImg}
                    alt={request.name}
                    className="w-full h-48 object-cover"
                  />
                  <button
                    onClick={() => toggleFavorite(request.name)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 transition-all"
                  >
                    {favorites.includes(request.name) ? (
                      <FaHeart className="text-pink-500" />
                    ) : (
                      <FaRegHeart className="text-gray-500 hover:text-pink-500" />
                    )}
                  </button>
                </div>

                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                        {request.name}
                      </h3>
                      <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-500"}`}>
                        <FiUser className="inline mr-1" />
                        {request.age}, {request.gender}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      request.progress >= 100
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                    >
                      {request.progress >= 100 ? "Completed" : "In Progress"}
                    </span>
                  </div>

                  <div className="mt-3">
                    <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                      {request.description.substring(0, 100)}...
                    </p>
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className={`font-medium ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                        <RiMoneyDollarCircleLine className="inline mr-1" />
                        Donated: {request.donatedInfo.amount.toLocaleString()} {request.donatedInfo.currency}
                      </span>
                      <span className={`font-medium ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                        {request.donatedInfo.date}
                      </span>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full ${
                          request.progress >= 100 ? "bg-green-500" : "bg-pink-500"
                        }`}
                        style={{ width: `${request.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <span className={isDarkMode ? "text-gray-400" : "text-gray-500"}>
                        {request.progress}% funded
                      </span>
                      <span className={isDarkMode ? "text-gray-400" : "text-gray-500"}>
                        Goal: {request.neededAmount.toLocaleString()} ETB
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => navigate(`/details/${request.name}`)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition-colors ${
                        isDarkMode
                          ? "bg-pink-600 hover:bg-pink-700 text-white"
                          : "bg-pink-500 hover:bg-pink-600 text-white"
                      }`}
                    >
                      <FaEye />
                      View Details
                    </button>
                    <button
                      onClick={() => navigate(`/donate/${request.name}`)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg border ${
                        isDarkMode
                          ? "border-pink-500 hover:bg-gray-600 text-pink-400"
                          : "border-pink-400 hover:bg-gray-100 text-pink-500"
                      } transition-colors`}
                    >
                      <FiDollarSign />
                      Donate Again
                    </button>
                  </div>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`text-center py-12 rounded-lg ${
            isDarkMode ? "bg-gray-700" : "bg-gray-50"
          }`}
        >
          <FaChartLine className={`mx-auto text-4xl mb-4 ${
            isDarkMode ? "text-gray-500" : "text-gray-300"
          }`} />
          <h3 className={`text-xl font-medium mb-2 ${
            isDarkMode ? "text-gray-300" : "text-gray-600"
          }`}>
            No donations found
          </h3>
          <p className={`text-sm ${
            isDarkMode ? "text-gray-400" : "text-gray-500"
          }`}>
            {searchTerm
              ? "Try adjusting your search criteria"
              : "You haven't made any donations yet"}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default DonatedRequestors;