import React from "react";

const DonationFrequencySelector = ({ frequency, setFrequency }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Donation Frequency
      </label>
      <select
        value={frequency}
        onChange={(e) => setFrequency(e.target.value)}
        className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none text-gray-800 dark:text-white"
      >
        <option value="one-time">One-time</option>
        <option value="monthly">Monthly</option>
        <option value="yearly">Yearly</option>
      </select>
    </div>
  );
};

export default DonationFrequencySelector;
