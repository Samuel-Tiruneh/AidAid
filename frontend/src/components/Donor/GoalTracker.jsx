import React, { useState } from "react";
import { FiTarget, FiDollarSign, FiCalendar, FiEdit, FiCheck, FiPlus } from "react-icons/fi";
import { motion } from "framer-motion";

const PersonalDonationTracker = () => {
  const [goal, setGoal] = useState(1000); // Personal donation goal
  const [progress, setProgress] = useState(350); // Amount donated so far
  const [timeLeft, setTimeLeft] = useState(30); // days left
  const [isEditing, setIsEditing] = useState(false);
  const [tempGoal, setTempGoal] = useState(goal);
  const [donationHistory, setDonationHistory] = useState([
    { cause: "Children's Education Fund", date: "2023-05-01", amount: 100 },
    { cause: "Local Food Bank", date: "2023-05-05", amount: 50 },
    { cause: "Animal Shelter", date: "2023-05-10", amount: 75 },
    { cause: "Medical Research", date: "2023-05-15", amount: 100 },
    { cause: "Environmental Cleanup", date: "2023-05-20", amount: 25 },
  ]);

  // Pink color palette (softer tones)
  const pinkColors = {
    primary: '#db2777',
    light: '#fbcfe8',
    accent: '#ec4899',
    text: '#831843',
    bgLight: '#fdf2f8'
  };

  // Calculate daily target needed to reach goal
  const dailyTarget = Math.max(0, Math.ceil((goal - progress) / timeLeft));

  // Calculate progress percentage (capped at 100)
  const progressPercentage = Math.min((progress / goal) * 100, 100);

  // Animation variants
  const progressBarVariants = {
    initial: { width: "0%" },
    animate: { width: `${progressPercentage}%`, transition: { duration: 1 } },
  };

  const handleSaveGoal = () => {
    setGoal(tempGoal);
    setIsEditing(false);
  };

  const addDonation = () => {
    const sampleCauses = [
      "Disaster Relief",
      "Education Fund",
      "Healthcare Initiative",
      "Community Development",
      "Wildlife Conservation"
    ];
    const newAmount = Math.floor(Math.random() * 200) + 20;
    const newDate = new Date().toISOString().split('T')[0];
    const randomCause = sampleCauses[Math.floor(Math.random() * sampleCauses.length)];
    
    setDonationHistory([
      ...donationHistory, 
      { 
        cause: randomCause, 
        date: newDate, 
        amount: newAmount 
      }
    ]);
    setProgress(progress + newAmount);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <FiTarget className="mr-2 text-pink-600" /> Your Giving Goal
        </h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-pink-600 hover:text-pink-800 flex items-center text-sm"
        >
          {isEditing ? (
            <>
              <FiCheck className="mr-1" /> Save Goal
            </>
          ) : (
            <>
              <FiEdit className="mr-1" /> Edit Goal
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Goal Progress Card */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <div className="flex justify-between items-center mb-2">
            {isEditing ? (
              <div className="flex items-center">
                <FiDollarSign className="mr-2 text-pink-500" />
                <input
                  type="number"
                  value={tempGoal}
                  onChange={(e) => setTempGoal(Number(e.target.value))}
                  className="border-b border-pink-300 bg-transparent focus:outline-none focus:border-pink-500 w-24 text-gray-800"
                />
                <button
                  onClick={handleSaveGoal}
                  className="ml-2 text-sm bg-pink-500 hover:bg-pink-600 text-white px-2 py-1 rounded transition-colors"
                >
                  Save
                </button>
              </div>
            ) : (
              <p className="text-gray-700 flex items-center">
                <FiDollarSign className="mr-2 text-pink-500" /> 
                Goal: ${goal.toLocaleString()}
              </p>
            )}
            <p className="text-gray-700 flex items-center">
              <FiCalendar className="mr-2 text-pink-500" /> 
              {timeLeft} days left
            </p>
          </div>

          <div className="mt-4">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">
                ${progress.toLocaleString()} donated
              </span>
              <span className="text-sm font-medium text-pink-600">
                ${(goal - progress).toLocaleString()} remaining
              </span>
            </div>
            <div className="bg-gray-100 rounded-full h-3">
              <motion.div
                className="bg-gradient-to-r from-pink-400 to-pink-600 h-3 rounded-full"
                variants={progressBarVariants}
                initial="initial"
                animate="animate"
              />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-xs text-gray-500">0%</span>
              <span className="text-xs text-pink-600">{progressPercentage.toFixed(0)}%</span>
              <span className="text-xs text-gray-500">100%</span>
            </div>
          </div>
        </div>

        {/* Daily Target Card */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <h3 className="font-medium text-gray-700 mb-3 flex items-center">
            <FiTarget className="mr-2 text-pink-500" />
            Suggested Daily Giving
          </h3>
          <div className="flex items-center justify-between">
            <div className="text-3xl font-bold text-pink-600">
              ${dailyTarget.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">
              per day to reach your goal
            </div>
          </div>
          <button
            onClick={addDonation}
            className="mt-4 bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded-lg text-sm transition-colors flex items-center justify-center w-full"
          >
            <FiPlus className="mr-1" /> Record New Donation
          </button>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-medium text-gray-700 mb-3 flex items-center">
          <FiDollarSign className="mr-2 text-pink-500" />
          Your Recent Donations
        </h3>
        <div className="space-y-3">
          {donationHistory.slice().reverse().map((donation, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex justify-between items-center p-4 bg-white rounded-lg border border-gray-200 hover:border-pink-300 transition-colors shadow-xs"
            >
              <div>
                <div className="font-medium text-gray-800">
                  {donation.cause}
                </div>
                <div className="text-sm text-gray-500">
                  {donation.date}
                </div>
              </div>
              <div className="text-pink-600 font-bold">
                ${donation.amount}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default PersonalDonationTracker;