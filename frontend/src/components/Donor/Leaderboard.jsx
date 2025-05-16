import React, { useState } from "react";
import { FaTrophy, FaCrown, FaMedal, FaAward, FaDonate } from "react-icons/fa";
import { motion } from "framer-motion";

const Leaderboard = () => {
  const [donorsLeaderboard] = useState([
    { 
      id: 1,
      name: "Alice Chen", 
      amountDonated: 2500,
      avatar: "AC",
      joinDate: "2023-01-15",
      donations: 18
    },
    { 
      id: 2,
      name: "Bob Smith", 
      amountDonated: 1800,
      avatar: "BS",
      joinDate: "2023-03-22",
      donations: 12
    },
    { 
      id: 3,
      name: "John Doe", 
      amountDonated: 1250,
      avatar: "JD",
      joinDate: "2023-05-10",
      donations: 9
    },
    { 
      id: 4,
      name: "Emma Wilson", 
      amountDonated: 950,
      avatar: "EW",
      joinDate: "2023-06-05",
      donations: 7
    },
    { 
      id: 5,
      name: "Michael Brown", 
      amountDonated: 750,
      avatar: "MB",
      joinDate: "2023-07-18",
      donations: 5
    },
  ]);

  const getRankBadge = (index) => {
    switch(index) {
      case 0: return (
        <div className="absolute -top-2 -left-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white p-1 rounded-full shadow-md">
          <FaCrown className="w-4 h-4" />
        </div>
      );
      case 1: return (
        <div className="absolute -top-2 -left-2 bg-gradient-to-r from-gray-400 to-gray-500 text-white p-1 rounded-full shadow-md">
          <FaMedal className="w-4 h-4" />
        </div>
      );
      case 2: return (
        <div className="absolute -top-2 -left-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white p-1 rounded-full shadow-md">
          <FaMedal className="w-4 h-4" />
        </div>
      );
      default: return (
        <div className="absolute -top-2 -left-2 bg-gradient-to-r from-pink-400 to-pink-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md">
          {index + 1}
        </div>
      );
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-white to-pink-50 p-6 rounded-3xl shadow-xl border border-pink-100"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-pink-800 flex items-center">
          <FaTrophy className="mr-3 text-pink-600" />
          Top Donors
        </h2>
        <span className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm font-medium">
          This Month
        </span>
      </div>

      <div className="space-y-3">
        {donorsLeaderboard.length > 0 ? (
          donorsLeaderboard.map((donor, index) => (
            <motion.div
              key={donor.id}
              whileHover={{ scale: 1.02 }}
              className="bg-white p-4 rounded-xl shadow-sm border border-pink-100 flex items-center relative"
            >
              {getRankBadge(index)}
              
              <div className="relative mr-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                  index === 0 ? 'bg-gradient-to-r from-pink-500 to-pink-600' :
                  index === 1 ? 'bg-gradient-to-r from-blue-400 to-blue-500' :
                  index === 2 ? 'bg-gradient-to-r from-purple-400 to-purple-500' :
                  'bg-gradient-to-r from-gray-400 to-gray-500'
                }`}>
                  {donor.avatar}
                </div>
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-pink-900">{donor.name}</h3>
                <p className="text-xs text-pink-500">
                  {donor.donations} donations • Joined {new Date(donor.joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                </p>
              </div>

              <div className="text-right">
                <p className="text-lg font-bold text-pink-600">${donor.amountDonated.toLocaleString()}</p>
                <div className="h-1.5 w-full bg-pink-100 rounded-full mt-1 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-pink-400 to-pink-600 rounded-full"
                    style={{ 
                      width: `${(donor.amountDonated / donorsLeaderboard[0].amountDonated) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <div className="mx-auto w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-3">
              <FaDonate className="text-pink-400 text-xl" />
            </div>
            <p className="text-pink-500">No donors yet</p>
            <p className="text-sm text-pink-400 mt-1">Be the first to make a difference!</p>
          </motion.div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-pink-100 text-center">
        <button className="text-pink-600 hover:text-pink-800 font-medium text-sm flex items-center justify-center w-full">
          View full leaderboard
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
};

export default Leaderboard;