import React, { useContext } from "react";
import { FiShield } from "react-icons/fi";
import { ThemeContext } from "../../context/ThemeContext"; // Import ThemeContext

const PrivacyPolicy = ({ isOpen, onClose }) => {
  const { isDarkMode } = useContext(ThemeContext); // Use theme context

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className={`p-6 rounded-2xl shadow-lg max-w-lg w-full mx-4 ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <FiShield className="text-pink-500 text-3xl" />
          <h2 className={`text-2xl font-bold ${
            isDarkMode ? "text-pink-400" : "text-pink-600"
          }`}>
            Privacy Policy
          </h2>
        </div>
        <div className={`mt-4 ${
          isDarkMode ? "text-gray-300 " : "text-gray-600"
        }`}>
          <p className="text-lg">
            At Adey Aid, we value your privacy. Here's how we handle your data:
          </p>
          <ul className="mt-2 space-y-2 list-disc pl-5">
            <li>
              We collect personal information like name, email, and payment
              details.
            </li>
            <li>
              Your data is used to process aid requests and improve our
              services.
            </li>
            <li>We do not sell your data to third parties.</li>
            <li>
              Data is stored securely with encryption and access controls.
            </li>
          </ul>
          <p className="mt-4">
            For more information, reach out to our privacy team.
          </p>
        </div>
        <button
          className={`mt-6 px-4 py-2 rounded-lg transition-colors duration-300 ${
            isDarkMode
              ? "bg-pink-600 hover:bg-pink-700 text-white"
              : "bg-pink-600 hover:bg-pink-700 text-white"
          }`}
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
