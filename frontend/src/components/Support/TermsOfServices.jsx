import React, { useContext } from "react";
import { FiFileText } from "react-icons/fi";
import { ThemeContext } from "../../context/ThemeContext"; // Import ThemeContext

const TermsOfServicePopup = ({ isOpen, onClose }) => {
  const { isDarkMode } = useContext(ThemeContext); // Use theme context

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className={`p-6 rounded-2xl shadow-lg max-w-lg w-full mx-4 ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <FiFileText className="text-pink-500 text-3xl" />
          <h2 className={`text-2xl font-bold ${
            isDarkMode ? "text-pink-400" : "text-pink-600"
          }`}>
            Terms of Service
          </h2>
        </div>
        <div className={`mt-4 ${
          isDarkMode ? "text-gray-300" : "text-gray-600"
        }`}>
          <p className="text-lg">
            Welcome to Adey Aid! By using our platform, you agree to comply with
            the following terms:
          </p>
          <ul className="mt-2 space-y-2 list-disc pl-5">
            <li>You must be at least 18 years old to use this service.</li>
            <li>
              You agree not to misuse the platform or engage in illegal
              activities.
            </li>
            <li>
              We reserve the right to terminate accounts that violate these
              terms.
            </li>
            <li>
              All content you submit must be accurate and not infringe on
              others' rights.
            </li>
          </ul>
          <p className="mt-4">
            For full details, please contact our support team or review the
            complete document.
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

export default TermsOfServicePopup;
