import React, { useState } from "react";
import { FiCalendar, FiMapPin, FiDollarSign, FiHeart } from "react-icons/fi";
import { motion } from "framer-motion";

const DonationOpportunities = () => {
  const [activeTab, setActiveTab] = useState("current");
  const [expandedCard, setExpandedCard] = useState(null);

  const opportunities = {
    current: [
      {
        id: 1,
        title: "Support Local Food Banks",
        location: "Nationwide",
        goal: "$10,000",
        raised: "$6,500",
        description: "Help provide meals to families in need by supporting local food banks.",
        impact: "Every $10 feeds a family for one day."
      },
      {
        id: 2,
        title: "Fund Community Education",
        location: "Urban Communities",
        goal: "$25,000",
        raised: "$18,000",
        description: "Empower children by funding education initiatives in underserved areas.",
        impact: "Supports school supplies and scholarships."
      }
    ],
    completed: [
      {
        id: 3,
        title: "Disaster Relief Fund",
        location: "Nationwide",
        raised: "$50,000",
        impact: "Supported 100+ families affected by recent floods."
      }
    ]
  };

  const toggleExpand = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-2xl shadow-lg border border-pink-100"
    >
      <div className="flex items-center mb-6">
        <FiHeart className="text-pink-500 mr-2 text-xl" />
        <h2 className="text-2xl font-bold text-pink-700">
          Donation Opportunities
        </h2>
      </div>

      <div className="flex border-b border-pink-200 mb-6">
        <button
          onClick={() => setActiveTab("current")}
          className={`pb-2 px-4 font-medium ${
            activeTab === "current" ? "text-pink-600 border-b-2 border-pink-500" : "text-gray-500"
          }`}
        >
          Current
        </button>
        <button
          onClick={() => setActiveTab("completed")}
          className={`pb-2 px-4 font-medium ${
            activeTab === "completed" ? "text-pink-600 border-b-2 border-pink-500" : "text-gray-500"
          }`}
        >
          Completed
        </button>
      </div>

      <ul className="space-y-4">
        {opportunities[activeTab].map((opportunity) => (
          <motion.li
            key={opportunity.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="border border-pink-100 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
          >
            <div
              className="p-4 cursor-pointer bg-pink-50 hover:bg-pink-100 transition-colors"
              onClick={() => toggleExpand(opportunity.id)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg text-pink-700">{opportunity.title}</h3>
                  <div className="flex items-center mt-1 text-pink-600">
                    <FiMapPin className="mr-1" />
                    <span className="text-sm">{opportunity.location}</span>
                  </div>
                </div>
                <div className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-xs">
                  {activeTab === "current" ? `Goal: ${opportunity.goal}` : "Completed"}
                </div>
              </div>

              {activeTab === "current" && (
                <div className="flex items-center mt-3 text-sm text-pink-600">
                  <FiDollarSign className="mr-1" />
                  <span>Raised: {opportunity.raised}</span>
                </div>
              )}
            </div>

            {expandedCard === opportunity.id && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                className="px-4 pb-4 bg-pink-50"
              >
                <div className="pt-2 border-t border-pink-200">
                  <p className="text-pink-700 mb-3">{opportunity.description}</p>
                  <div className="text-sm text-pink-600">
                    <span className="font-semibold">Impact:</span> {opportunity.impact}
                  </div>
                  <button className="mt-4 bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                    {activeTab === "current" ? "Donate Now" : "Learn More"}
                  </button>
                </div>
              </motion.div>
            )}
          </motion.li>
        ))}
      </ul>

      <div className="mt-6 text-center">
        <button className="inline-flex items-center text-pink-600 hover:text-pink-800 font-medium">
          View all donation opportunities
          <svg
            className="w-4 h-4 ml-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
};

export default DonationOpportunities;
