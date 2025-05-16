import React, { useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  FaClock,
  FaInfoCircle,
  FaPhone,
  FaHome,
  FaExclamationTriangle,
  FaCopy,
  FaCheck,
} from "react-icons/fa";
import { ThemeContext } from "../../context/ThemeContext";

const DonationPending = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const transactionId = query.get("tx_ref");
  const bankName = query.get("bank");

  const [timeLeft, setTimeLeft] = useState(120);
  const [timedOut, setTimedOut] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(transactionId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setTimedOut(true);
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const progressPercentage = ((120 - timeLeft) / 120) * 100;

  const bankFullNames = {
    CBE: "Commercial Bank of Ethiopia",
    Awash: "Awash Bank",
    Dashen: "Dashen Bank",
    Abyssinia: "Bank of Abyssinia",
    Wegagen: "Wegagen Bank",
    Nib: "Nib International Bank",
    Berhan: "Berhan Bank",
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 ${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div
        className={`max-w-md w-full p-6 rounded-xl shadow-md ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
        }`}
      >
        {/* Header with Bank Name */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2 text-pink-600">
            Donating via{" "}
            {bankName ? bankFullNames[bankName] || bankName : "Bank"}
          </h2>
          <div className="flex items-center justify-center space-x-2 mt-3">
            <FaClock className="text-pink-500" />
            <span
              className={`font-medium ${
                timeLeft < 30 ? "text-red-500 animate-pulse" : "text-pink-600"
              }`}
            >
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        {/* Transaction Info */}
        <div
          className={`p-4 rounded-lg mb-6 ${
            isDarkMode ? "bg-gray-700" : "bg-gray-50"
          } border ${isDarkMode ? "border-gray-600" : "border-gray-200"}`}
        >
          <div className="flex items-center mb-3">
            <FaInfoCircle className="text-pink-500 mr-2" />
            <span className="font-semibold">Transaction Details</span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center bg-gray-200 p-2">
              <span className="font-medium">Reference:</span>
              <div className="flex items-center">
                <span className="font-mono px-2 py-1 rounded mr-2">
                  {transactionId}
                </span>
                <button
                  onClick={copyToClipboard}
                  className={`p-1 rounded-md ${
                    isDarkMode ? "hover:bg-gray-600" : "hover:bg-gray-100"
                  }`}
                  title="Copy to clipboard"
                >
                  {copied ? (
                    <FaCheck className="text-green-500" />
                  ) : (
                    <FaCopy className="text-pink-500" />
                  )}
                </button>
              </div>
            </div>
            <div className="flex justify-between bg-gray-200 p-2 ">
              <span className="font-medium">Bank:</span>
              <span>
                {bankName
                  ? bankFullNames[bankName] || bankName
                  : "Not specified"}
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between mb-1 text-sm">
            <span>Processing time</span>
            <span>{formatTime(timeLeft)} / 2:00</span>
          </div>
          <div
            className={`w-full h-2 rounded-full ${
              isDarkMode ? "bg-gray-600" : "bg-gray-200"
            }`}
          >
            <div
              className={`h-full rounded-full ${
                timeLeft < 30 ? "bg-red-500" : "bg-pink-500"
              }`}
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Timeout Notice */}
        {timedOut && (
          <div
            className={`p-3 rounded-lg mb-6 flex items-start ${
              isDarkMode
                ? "bg-red-900/30 text-red-200 border border-red-700"
                : "bg-red-100 text-red-800 border border-red-200"
            }`}
          >
            <FaExclamationTriangle className="mt-0.5 mr-2 flex-shrink-0 text-red-500" />
            <div>
              <h3 className="font-bold mb-1">Session Expired</h3>
              <p className="text-sm">
                The transaction window has closed. Please return home and
                initiate a new donation if needed.
              </p>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div
          className={`p-4 rounded-lg mb-6 ${
            isDarkMode ? "bg-gray-700" : "bg-gray-50"
          } border ${isDarkMode ? "border-gray-600" : "border-gray-200"}`}
        >
          <h3 className="font-semibold mb-3 flex items-center text-pink-600">
            <FaPhone className="mr-2" /> Next Steps
          </h3>
          <ol className="space-y-3">
            <li className="flex items-start">
              <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-pink-500 text-white text-xs font-bold mr-2 mt-0.5">
                1
              </span>
              <span>
                Open your{" "}
                <strong>
                  {bankName ? bankFullNames[bankName] || bankName : "bank"}
                </strong>{" "}
                mobile app
              </span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-pink-500 text-white text-xs font-bold mr-2 mt-0.5">
                2
              </span>
              <span>Transfer the amount using the reference above</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-pink-500 text-white text-xs font-bold mr-2 mt-0.5">
                3
              </span>
              <span>Confirmation may take 5-15 minutes</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-pink-500 text-white text-xs font-bold mr-2 mt-0.5">
                4
              </span>
              <span>Contact support if not processed within 4 hours</span>
            </li>
          </ol>
        </div>

        {/* Action Button */}
        <button
          onClick={() => (window.location.href = "/")}
          className={`w-full py-3 rounded-lg flex items-center justify-center bg-pink-600 hover:bg-pink-700 text-white font-medium transition-colors`}
        >
          <FaHome className="mr-2" /> Return Home
        </button>
      </div>
    </div>
  );
};

export default DonationPending;
