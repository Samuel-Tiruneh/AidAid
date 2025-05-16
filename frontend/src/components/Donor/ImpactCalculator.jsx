import React, { useState } from "react";
import { FiDollarSign, FiUsers } from "react-icons/fi";
import { motion } from "framer-motion";

const DonationImpactCalculator = () => {
  const [donation, setDonation] = useState(25);
  
  // Impact calculations based on your organization's average impact
  const calculateImpact = (amount) => {
    return {
      meals: Math.floor(amount / 2.5),       // $2.50 provides one meal
      schoolDays: Math.floor(amount / 10),   // $10 provides a day of school
      medicalKits: Math.floor(amount / 30)   // $30 provides a medical kit
    };
  };

  const impactExamples = [
    { amount: 25, label: "$25" },
    { amount: 50, label: "$50" },
    { amount: 100, label: "$100" },
    { amount: 250, label: "$250" }
  ];

  const impacts = calculateImpact(donation);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
    >
      <div className="flex items-center mb-6">
        <FiDollarSign className="text-green-600 mr-2 text-xl" />
        <h2 className="text-2xl font-bold text-gray-800">
          See Your Donation's Impact
        </h2>
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 mb-3 font-medium">
          Enter your donation amount:
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            <FiDollarSign />
          </span>
          <input
            type="number"
            value={donation}
            onChange={(e) => setDonation(Math.max(0, Number(e.target.value)))}
            className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
            min="0"
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 mb-3 font-medium">
          Quick select amounts:
        </label>
        <div className="grid grid-cols-4 gap-3">
          {impactExamples.map((example) => (
            <button
              key={example.amount}
              onClick={() => setDonation(example.amount)}
              className={`py-2 rounded-lg border transition-colors ${
                donation === example.amount
                  ? "border-green-500 bg-green-50 text-green-700"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {example.label}
            </button>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white p-6 rounded-xl border border-green-200 shadow-xs"
      >
        <div className="flex flex-col items-center text-center mb-4">
          <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mb-3">
            <FiUsers className="text-green-600 text-xl" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">
            Your ${donation.toLocaleString()} donation could provide:
          </h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 bg-green-50 rounded-full p-2 mr-3">
              <FiUsers className="text-green-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-800">{impacts.meals} meals</h4>
              <p className="text-sm text-gray-500">for hungry families</p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex-shrink-0 bg-blue-50 rounded-full p-2 mr-3">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-gray-800">{impacts.schoolDays} school days</h4>
              <p className="text-sm text-gray-500">for children in need</p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex-shrink-0 bg-red-50 rounded-full p-2 mr-3">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-gray-800">{impacts.medicalKits} medical kits</h4>
              <p className="text-sm text-gray-500">for basic healthcare</p>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Based on our organization's average impact metrics
        </p>
      </motion.div>
    </motion.div>
  );
};

export default DonationImpactCalculator;