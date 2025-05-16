import React, { useContext } from "react";
import SupportIntroImg from "../../assets/SupportAssets/support-intro.png";
import { ThemeContext } from "../../context/ThemeContext"; // Import ThemeContext

const SupportIntro = () => {
  const { isDarkMode } = useContext(ThemeContext); // Use theme context

  return (
    <div className={`flex flex-col md:flex-row items-center justify-around p-8 mb-4 md:mr-8 rounded-2xl shadow-lg ${
      isDarkMode ? "bg-gray-800" : "bg-white"
    }`}>
      <img
        src={SupportIntroImg}
        alt="Support Banner"
        className="w-60 h-auto md:w-80"
      />
      
      <div className={`mt-6 md:mt-0 md:ml-8 text-center md:text-left shadow-md p-6 rounded-xl ${
        isDarkMode ? "bg-gray-700" : "bg-gray-50"
      }`}>
        <h1 className={`text-2xl md:text-4xl font-bold ${
          isDarkMode ? "text-gray-200" : "text-gray-800"
        }`}>
          Welcome to the Adey Aid Support Center
        </h1>
        <p className={`mt-4 text-base md:text-lg leading-relaxed border-b-2 border-pink-500 inline ${
          isDarkMode ? "text-pink-400" : "text-pink-600"
        }`}>
          Need help?
        </p>

        {/* Left-aligned list for all screen sizes */}
        <ul className="mt-4 pl-4 text-left text-xl md:text-2xl">
          <li className="mb-4">
            <span className={`font-bold text-2xl inline-block mr-2 ${
              isDarkMode ? "text-pink-400" : "text-pink-600"
            }`}>
              -
            </span>
            <span className={`${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}>
              Access answers to frequently asked questions
            </span>
          </li>
          <li className="mb-4">
            <span className={`font-bold text-2xl inline-block mr-2 ${
              isDarkMode ? "text-pink-400" : "text-pink-600"
            }`}>
              -
            </span>
            <span className={`${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}>
              Discover contact options to support you in using our donation platform effectively.
            </span>
          </li>
          <li className="mb-4">
            <span className={`font-bold text-2xl inline-block mr-2 ${
              isDarkMode ? "text-pink-400" : "text-pink-600"
            }`}>
              -
            </span>
            <span className={`${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}>
              Explore helpful guides
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SupportIntro;
