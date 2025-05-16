import React, { useState, useContext } from "react";
import {
  FiFileText,
  FiShield,
  FiRotateCcw,
  FiCheckCircle,
} from "react-icons/fi";
import policyImg from "../../assets/SupportAssets/policy.png";
import TermsOfServicePopup from "./TermsOfServices";
import PrivacyPolicyPopup from "./PrivacyPolicy";
import RefundCancellationPopup from "./RefundAndCancellation";
import AidGuidelinesPopup from "./AidRequestGuideLines";
import { ThemeContext } from "../../context/ThemeContext"; // Import ThemeContext

const PlatformPolicies = () => {
  const [popup, setPopup] = useState(null);
  const { isDarkMode } = useContext(ThemeContext); // Use theme context

  const openPopup = (popupName) => setPopup(popupName);
  const closePopup = () => setPopup(null);

  return (
    <div className={`p-8 mt-4 md:mr-8 rounded-2xl shadow-lg ${
      isDarkMode ? "bg-gray-800" : "bg-white"
    }`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center gap-4 justify-center">
        <img
          src={policyImg}
          alt="platform policies"
          className="w-10 md:w-12 h-auto max-w-full"
        />
        <h2 className={`text-2xl sm:text-3xl font-bold mt-4 sm:mt-0 ${
          isDarkMode ? "text-pink-400" : "text-pink-600"
        }`}>
          Platform Policies
        </h2>
      </div>

      {/* Policies List */}
      <div className="mt-6 max-w-6xl mx-auto px-8">
        <p className={`text-lg sm:text-xl font-semibold text-center sm:text-left ${
          isDarkMode ? "text-gray-300" : "text-slate-700"
        }`}>
          Please read our policies carefully to understand your rights and
          responsibilities while using Adey Aid.
        </p>

        <ul className="mt-6 space-y-5">
          <li className="flex flex-col sm:flex-row items-center sm:items-start gap-2">
            <FiFileText className="text-pink-500 text-2xl" />
            <button
              onClick={() => openPopup("terms")}
              className={`font-semibold hover:underline ${
                isDarkMode ? "text-pink-400" : "text-pink-600"
              }`}
            >
              Terms of Service:
            </button>
            <span className={`${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}>
              The rules and guidelines for using our platform.
            </span>
          </li>
          <li className="flex flex-col sm:flex-row items-center sm:items-start gap-2">
            <FiShield className="text-pink-500 text-2xl" />
            <button
              onClick={() => openPopup("privacy")}
              className={`font-semibold hover:underline ${
                isDarkMode ? "text-pink-400" : "text-pink-600"
              }`}
            >
              Privacy Policy:
            </button>
            <span className={`${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}>
              How we collect, use, and protect your data.
            </span>
          </li>
          <li className="flex flex-col sm:flex-row items-center sm:items-start gap-2">
            <FiRotateCcw className="text-pink-500 text-2xl" />
            <button
              onClick={() => openPopup("refund")}
              className={`font-semibold hover:underline ${
                isDarkMode ? "text-pink-400" : "text-pink-600"
              }`}
            >
              Refund & Cancellation Policy:
            </button>
            <span className={`${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}>
              Our policies on refunds and cancellations.
            </span>
          </li>
          <li className="flex flex-col sm:flex-row items-center sm:items-start gap-2">
            <FiCheckCircle className="text-pink-500 text-2xl" />
            <button
              onClick={() => openPopup("guidelines")}
              className={`font-semibold hover:underline ${
                isDarkMode ? "text-pink-400" : "text-pink-600"
              }`}
            >
              Guidelines for Aid Requests:
            </button>
            <span className={`${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}>
              Eligibility criteria and process for requesting aid.
            </span>
          </li>
        </ul>
      </div>

      {/* Popups */}
      <TermsOfServicePopup isOpen={popup === "terms"} onClose={closePopup} />
      <PrivacyPolicyPopup isOpen={popup === "privacy"} onClose={closePopup} />
      <RefundCancellationPopup
        isOpen={popup === "refund"}
        onClose={closePopup}
      />
      <AidGuidelinesPopup
        isOpen={popup === "guidelines"}
        onClose={closePopup}
      />
    </div>
  );
};

export default PlatformPolicies;
