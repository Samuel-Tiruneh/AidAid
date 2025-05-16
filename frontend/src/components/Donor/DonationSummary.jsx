import React from "react";
import { motion } from "framer-motion";

const DonationSummary = ({ donorName, recentDonations = [] }) => {
  const sampleDonations = [
    {
      recipient: "Alemu Kebede",
      type: "Person",
      amount: "150.00",
      date: "2023-06-15T10:30:00",
      message: "Hope this helps with your surgery!"
    },
    {
      recipient: "Mekedonia Humanitarian Association",
      type: "Institution",
      amount: "550",
      date: "2023-05-28T14:45:00",
      message: "For helping families in need"
    },
    {
      recipient: "Hiwot Ethiopia",
      type: "Institution",
      amount: "400.50",
      date: "2023-04-12T14:45:00",
      message: "For helping families in need"
    },
    {
      recipient: "Tigest Sisay",
      type: "Person",
      amount: "200.00",
      date: "2023-05-10T09:15:00"
    }
  ];

  const donationsToDisplay = recentDonations.length > 0 ? recentDonations : sampleDonations;

  const donationsByType = {
    Persons: donationsToDisplay.filter((donation) => donation.type === "Person"),
    Institutions: donationsToDisplay.filter((donation) => donation.type === "Institution"),
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="bg-gradient-to-br from-pink-50 to-white p-6 rounded-3xl shadow-xl mt-8 border border-pink-100"
    >
      {/* Welcome Message */}
      <motion.div
        variants={itemVariants}
        className="relative bg-gradient-to-r from-pink-600 via-pink-500 to-pink-700 text-white p-8 rounded-2xl shadow-lg mb-8 overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-pink-400 rounded-full opacity-20 -mr-10 -mt-10"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-pink-400 rounded-full opacity-20 -ml-8 -mb-8"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-3">Welcome Back, {donorName || "Generous Donor"}!</h2>
          <p className="text-lg font-light">
            Your generosity transforms lives—whether it's for individuals in need or community institutions. Let’s continue the impactful journey together.
          </p>
        </div>
      </motion.div>

      {/* Donation Summary Header */}
      <motion.h2
        variants={itemVariants}
        className="text-2xl font-bold mb-6 text-pink-800"
      >
        Your Donation Summary
        <div className="w-16 h-1 bg-pink-400 mt-2 rounded-full"></div>
      </motion.h2>

      {/* Donations Section */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-b from-pink-50 to-white p-6 rounded-2xl shadow-sm border border-pink-100"
      >
        {/* Individual Donations */}
        <h3 className="text-xl font-bold text-pink-700 mb-4">Individuals</h3>
        {donationsByType.Persons.length > 0 ? (
          <motion.ul
            variants={containerVariants}
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          >
            {donationsByType.Persons.map((donation, index) => (
              <motion.li
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.03 }}
                className="bg-white p-5 rounded-xl shadow-md border-l-4 border-pink-500 hover:shadow-xl transition-all"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-lg font-medium text-pink-800">{donation.recipient}</h4>
                  <span className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm font-bold">
                    ${donation.amount}
                  </span>
                </div>
                <div className="flex items-center text-gray-500 text-sm">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {new Date(donation.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
                {donation.message && (
                  <p className="mt-2 text-gray-600 text-sm italic">
                    "{donation.message}"
                  </p>
                )}
              </motion.li>
            ))}
          </motion.ul>
        ) : (
          <p className="text-center text-gray-500">No donations to individuals yet.</p>
        )}

        {/* Institution Donations */}
        <h3 className="text-xl font-bold text-pink-700 mt-8 mb-4">Institutions</h3>
        {donationsByType.Institutions.length > 0 ? (
          <motion.ul
            variants={containerVariants}
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          >
            {donationsByType.Institutions.map((donation, index) => (
              <motion.li
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.03 }}
                className="bg-white p-5 rounded-xl shadow-md border-l-4 border-pink-500 hover:shadow-xl transition-all"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-lg font-medium text-pink-800">{donation.recipient}</h4>
                  <span className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm font-bold">
                    ${donation.amount}
                  </span>
                </div>
                <div className="flex items-center text-gray-500 text-sm">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {new Date(donation.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
                {donation.message && (
                  <p className="mt-2 text-gray-600 text-sm italic">
                    "{donation.message}"
                  </p>
                )}
              </motion.li>
            ))}
          </motion.ul>
        ) : (
          <p className="text-center text-gray-500">No donations to institutions yet.</p>
        )}
      </motion.div>
    </motion.div>
  );
};

export default DonationSummary;
