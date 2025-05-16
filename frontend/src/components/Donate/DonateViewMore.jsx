import React, { useState, useContext } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { ThemeContext } from "../../context/ThemeContext"; // Import ThemeContext

const DonateViewMore = ({ filteredData, setFilteredData, handleViewMore }) => {
  const [viewMore, setViewMore] = useState(false); // State to toggle view more/less
  const { isDarkMode } = useContext(ThemeContext); // Use theme context for dark mode

  const handleViewMoreToggle = () => {
    if (viewMore) {
      setFilteredData(filteredData.slice(0, 6)); // Reset to first 6 items when viewing less
    } else {
      handleViewMore(); // Fetch more data when viewing more
    }
    setViewMore(!viewMore); // Toggle the view more state
  };

  return (
    <div
      className={`shadow-md rounded-lg p-4 mt-4 flex justify-center mb-4 ${
        isDarkMode ? "bg-gray-700" : "bg-gray-200"
      }`}
    >
      <button
        onClick={handleViewMoreToggle}
        className={`font-bold py-2 px-4 rounded flex items-center transition duration-300 ease-in-out ${
          isDarkMode
            ? "bg-gray-600 hover:bg-gray-500 text-white"
            : "bg-gray-500 hover:bg-gray-700 text-white"
        }`}
      >
        {viewMore ? <FaChevronUp className="mr-2" /> : <FaChevronDown className="mr-2" />}
        {viewMore ? "View Less Requests" : "View More Requests"}
      </button>
    </div>
  );
};

export default DonateViewMore;
