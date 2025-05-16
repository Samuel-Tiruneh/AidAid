import React, { useState } from "react";
import { FaTrophy, FaMedal, FaStar, FaGift, FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion";

const MilestoneTracker = () => {
  const [milestones] = useState([
    { 
      id: 1,
      name: "First Donation", 
      condition: true, 
      description: "Made your first donation",
      date: "2024-01-15",
      icon: <FaStar className="text-yellow-400" />,
      level: "bronze"
    },
    { 
      id: 2,
      name: "10th Donation", 
      condition: false, 
      description: "Complete 10 donations",
      target: 10,
      current: 7,
      icon: <FaMedal className="text-gray-300" />,
      level: "silver"
    },
    { 
      id: 3,
      name: "Goal Achiever", 
      condition: true, 
      description: "Reached $500 total donations",
      date: "2024-05-20",
      icon: <FaTrophy className="text-yellow-500" />,
      level: "gold"
    },
    { 
      id: 4,
      name: "Monthly Supporter", 
      condition: false, 
      description: "Donate for 3 consecutive months",
      current: 2,
      target: 3,
      icon: <FaGift className="text-pink-400" />,
      level: "bronze"
    },
  ]);

  const getLevelColor = (level) => {
    switch(level) {
      case "bronze": return "from-amber-600 to-amber-700";
      case "silver": return "from-gray-400 to-gray-500";
      case "gold": return "from-yellow-500 to-yellow-600";
      default: return "from-blue-500 to-blue-600";
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
          Achievement Milestones
        </h2>
        <span className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm font-medium">
          {milestones.filter(m => m.condition).length}/{milestones.length} completed
        </span>
      </div>

      <div className="space-y-4">
        {milestones.length > 0 ? (
          milestones.map((milestone) => (
            <motion.div
              key={milestone.id}
              whileHover={{ scale: 1.02 }}
              className={`p-4 rounded-xl border-l-4 ${
                milestone.condition 
                  ? "bg-white border-pink-400" 
                  : "bg-pink-50 border-pink-200"
              } shadow-sm`}
            >
              <div className="flex items-start">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getLevelColor(milestone.level)} 
                  flex items-center justify-center text-white mr-4`}>
                  {milestone.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className={`font-semibold ${
                      milestone.condition ? "text-pink-800" : "text-pink-700"
                    }`}>
                      {milestone.name}
                    </h3>
                    {milestone.condition ? (
                      <span className="flex items-center text-green-500 text-sm">
                        <FaCheckCircle className="mr-1" /> Achieved
                      </span>
                    ) : (
                      <span className="text-pink-400 text-sm">
                        {milestone.current}/{milestone.target}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-pink-600 mt-1">{milestone.description}</p>
                  {milestone.condition && milestone.date && (
                    <p className="text-xs text-pink-400 mt-2">
                      Completed on {new Date(milestone.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  )}
                  {!milestone.condition && (
                    <div className="w-full bg-pink-100 rounded-full h-2 mt-3">
                      <div 
                        className="bg-gradient-to-r from-pink-400 to-pink-600 h-2 rounded-full" 
                        style={{ 
                          width: `${(milestone.current / milestone.target) * 100}%` 
                        }}
                      ></div>
                    </div>
                  )}
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
              <FaTrophy className="text-pink-400 text-xl" />
            </div>
            <p className="text-pink-500">No milestones available</p>
            <p className="text-sm text-pink-400 mt-1">Start donating to unlock achievements!</p>
          </motion.div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-pink-100 text-center">
        <button className="text-pink-600 hover:text-pink-800 font-medium text-sm flex items-center justify-center w-full">
          View all milestones
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
};

export default MilestoneTracker;