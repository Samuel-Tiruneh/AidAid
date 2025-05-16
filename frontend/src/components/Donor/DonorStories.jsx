import React, { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaQuoteLeft, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { ThemeContext } from "../../context/ThemeContext"; // Adjust the path as needed

const DonorStories = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [currentIndex, setCurrentIndex] = useState(0);

  const stories = [
    {
      name: "Alice Johnson",
      role: "Monthly Donor",
      amount: "$250/month",
      story:
        "Supporting this cause has been one of the most fulfilling experiences of my life. Knowing my contributions help feed families every month gives me purpose.",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "Robert Chen",
      role: "Major Donor",
      amount: "$10,000",
      story:
        "Seeing my donations make a tangible difference is truly heartwarming. The transparency in how funds are used convinced me to give more.",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      name: "Maria Garcia",
      role: "First-Time Donor",
      amount: "$500",
      story:
        "I was moved by the impact reports showing exactly how my donation would be used. Now I tell all my friends about this organization!",
      image: "https://randomuser.me/api/portraits/women/68.jpg",
    },
  ];

  const nextStory = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === stories.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevStory = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? stories.length - 1 : prevIndex - 1
    );
  };

  // Helper classes for dark/light mode
  const bgClass = isDarkMode ? "bg-gray-800" : "bg-white";
  const textClass = isDarkMode ? "text-white" : "text-black";
  const cardBgClass = isDarkMode
    ? "bg-gradient-to-r from-gray-700 to-gray-800"
    : "bg-gradient-to-r from-pink-50 to-white";
  const quoteTextClass = isDarkMode ? "text-gray-200" : "text-gray-700";
  const nameTextClass = isDarkMode ? "text-white" : "text-gray-800";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${bgClass} p-6 rounded-2xl shadow-xl mt-8 max-w-lg mx-auto transition-colors duration-300`}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-2xl font-bold ${textClass}`}>Donor Stories</h2>
        <div className="flex space-x-2">
          <button
            onClick={prevStory}
            className="p-2 text-pink-500 hover:bg-pink-100 rounded-full transition-colors"
            aria-label="Previous story"
          >
            <FaChevronLeft />
          </button>
          <button
            onClick={nextStory}
            className="p-2 text-pink-500 hover:bg-pink-100 rounded-full transition-colors"
            aria-label="Next story"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>

      <div className="relative h-64">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <div
              className={`${cardBgClass} p-6 rounded-xl h-full flex flex-col hover:scale-105 transition-all`}
            >
              <FaQuoteLeft className="text-pink-300 text-3xl mb-4" />
              <p className={`${quoteTextClass} italic mb-6 flex-grow`}>
                "{stories[currentIndex].story}"
              </p>
              <div className="flex items-center">
                <img
                  src={stories[currentIndex].image}
                  alt={stories[currentIndex].name}
                  className="w-14 h-14 rounded-full object-cover mr-4 border-2 border-pink-300 shadow-lg"
                />
                <div>
                  <p className={`font-semibold ${nameTextClass}`}>
                    {stories[currentIndex].name}
                  </p>
                  <p className="text-sm text-pink-500">
                    {stories[currentIndex].role} •{" "}
                    {stories[currentIndex].amount}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-center mt-4 space-x-2">
        {stories.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentIndex
                ? "bg-pink-500"
                : isDarkMode
                ? "bg-gray-600 hover:bg-pink-200"
                : "bg-gray-300 hover:bg-pink-200"
            }`}
            aria-label={`Go to story ${index + 1}`}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default DonorStories;
