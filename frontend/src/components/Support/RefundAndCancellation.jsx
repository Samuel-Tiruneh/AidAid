import React, { useContext } from "react";
import { FiRotateCcw } from "react-icons/fi";
import { ThemeContext } from "../../context/ThemeContext"; // Import ThemeContext

const RefundCancellation = ({ isOpen, onClose }) => {
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
          <FiRotateCcw className="text-pink-500 text-3xl" />
          <h2 className={`text-2xl font-bold ${
            isDarkMode ? "text-pink-400" : "text-pink-600"
          }`}>
            Refund & Cancellation Policy
          </h2>
        </div>
        <div className={`mt-4 ${
          isDarkMode ? "text-gray-300" : "text-gray-600"
        }`}>
          <p className="text-lg">
            Our refund and cancellation policies are as follows:
          </p>
          <ul className="mt-2 space-y-2 list-disc pl-5">
            <li>
              Refunds are available within 30 days of a donation if no aid has
              been disbursed.
            </li>
            <li>
              Cancellations of aid requests must be submitted within 24 hours of
              approval.
            </li>
            <li>Processing fees may apply to refunded transactions.</li>
            <li>
              Contact support for assistance with refunds or cancellations.
            </li>
          </ul>
          <p className="mt-4">
            Please review the full policy for additional details.
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

export default RefundCancellation;
