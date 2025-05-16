import React, { useState } from "react";
import { FaDonate, FaHistory, FaRegClock, FaRegCheckCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const RecentActivity = () => {
  const [activities] = useState([
    { 
      id: 1,
      title: "Donation to Children's Fund", 
      date: "2025-03-28T14:30:00", 
      amount: 100,
      status: "completed",
      recipient: "Sarah M.",
      category: "education"
    },
    { 
      id: 2,
      title: "Monthly Recurring Donation", 
      date: "2025-03-20T09:15:00", 
      amount: 50,
      status: "completed",
      recipient: "Ali R.",
      category: "health"
    },
    { 
      id: 3,
      title: "Emergency Relief Fund", 
      date: "2025-02-15T16:45:00", 
      amount: 75,
      status: "completed",
      recipient: "Musa A.",
      category: "disaster"
    },
    { 
      id: 4,
      title: "Pending Donation", 
      date: "2025-04-01T11:20:00", 
      amount: 120,
      status: "pending",
      recipient: "Emma K.",
      category: "environment"
    },
  ]);

  const getCategoryColor = (category) => {
    switch(category) {
      case "education": return "bg-blue-100 text-blue-600";
      case "health": return "bg-green-100 text-green-600";
      case "disaster": return "bg-red-100 text-red-600";
      case "environment": return "bg-emerald-100 text-emerald-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case "education": return "📚";
      case "health": return "🏥";
      case "disaster": return "🆘";
      case "environment": return "🌱";
      default: return "❤️";
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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
          <FaHistory className="mr-3 text-pink-600" />
          Recent Activity
        </h2>
        <span className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm font-medium">
          {activities.length} activities
        </span>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {activities.length > 0 ? (
            activities.map((activity) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                whileHover={{ scale: 1.01 }}
                className={`p-4 rounded-xl border-l-4 ${
                  activity.status === "completed" 
                    ? "bg-white border-green-400" 
                    : "bg-pink-50 border-yellow-400"
                } shadow-sm`}
              >
                <div className="flex items-start">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl mr-3 ${getCategoryColor(activity.category)}`}>
                    {getCategoryIcon(activity.category)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-pink-900">{activity.title}</h3>
                      <span className="text-sm font-bold text-pink-600">
                        ${activity.amount}
                      </span>
                    </div>
                    <p className="text-sm text-pink-600 mt-1">
                      To: {activity.recipient}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className={`text-xs flex items-center ${
                        activity.status === "completed" 
                          ? "text-green-500" 
                          : "text-yellow-500"
                      }`}>
                        {activity.status === "completed" ? (
                          <FaRegCheckCircle className="mr-1" />
                        ) : (
                          <FaRegClock className="mr-1" />
                        )}
                        {activity.status === "completed" ? "Completed" : "Pending"}
                      </span>
                      <span className="text-xs text-pink-400">
                        {formatTimeAgo(activity.date)}
                      </span>
                    </div>
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
              <p className="text-pink-500">No recent activities</p>
              <p className="text-sm text-pink-400 mt-1">Your donation activities will appear here</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-6 pt-4 border-t border-pink-100 text-center">
        <button className="text-pink-600 hover:text-pink-800 font-medium text-sm flex items-center justify-center w-full">
          View all activities
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
};

export default RecentActivity;