import React, { useContext } from "react";
import { FiCheckCircle } from "react-icons/fi";
import { ThemeContext } from "../../context/ThemeContext"; // Import ThemeContext

const AidRequestGuidelines = ({ isOpen, onClose }) => {
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
          <FiCheckCircle className="text-pink-500 text-3xl" />
          <h2 className={`text-2xl font-bold ${
            isDarkMode ? "text-pink-400" : "text-pink-600"
          }`}>
            Guidelines for Aid Requests
          </h2>
        </div>
        <div className={`mt-4 ${
          isDarkMode ? "text-gray-300" : "text-gray-600"
        }`}>
          <p className="text-lg">
            To request aid from Adey Aid, please follow these guidelines:
          </p>
          <ul className="mt-2 space-y-2 list-disc pl-5">
            <li>
              You must provide verifiable proof of need (e.g., documents,
              photos).
            </li>
            <li>
              Requests must be for essential needs like food, shelter, or
              medical care.
            </li>
            <li>Only one active request is allowed per user at a time.</li>
            <li>
              Submit your request through the official form on our platform.
            </li>
          </ul>
          <p className="mt-4">
            See our FAQ for more details on the approval process.
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

export default AidRequestGuidelines;
