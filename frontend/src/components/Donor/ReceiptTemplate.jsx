import React, { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext"; // Adjust path as needed

const ReceiptTemplate = ({ receipt }) => {
  const { isDarkMode } = useContext(ThemeContext);

  // Helper classes for dark/light mode
  const bgClass = isDarkMode ? "bg-gray-800" : "bg-white";
  const textPrimary = isDarkMode ? "text-white" : "text-gray-800";
  const textSecondary = isDarkMode ? "text-gray-300" : "text-gray-500";
  const borderClass = isDarkMode ? "border-gray-700" : "border-gray-300";
  const statusCompletedBg = isDarkMode ? "bg-green-900" : "bg-green-100";
  const statusCompletedText = isDarkMode ? "text-green-400" : "text-green-800";
  const statusPendingBg = isDarkMode ? "bg-yellow-900" : "bg-yellow-100";
  const statusPendingText = isDarkMode ? "text-yellow-400" : "text-yellow-800";
  const decorativeBg = isDarkMode ? "bg-pink-900" : "bg-pink-100";
  const decorativeOpacity = "opacity-20";

  return (
    <div
      className={`${bgClass} ${textPrimary} max-w-lg mx-auto p-8 border ${borderClass} rounded-2xl shadow-lg font-sans relative transition-colors duration-300`}
    >
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-pink-600">
            Donation Receipt
          </h1>
          <p className={`${textSecondary} text-sm`}>Official Receipt</p>
        </div>
        <div className="text-right">
          <p className={`text-lg font-semibold ${textPrimary}`}>
            #{receipt.receiptId}
          </p>
          <p className={`${textSecondary} text-sm`}>
            {new Date(receipt.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </header>

      {/* Divider */}
      <div className={`border-b ${borderClass} mb-6`}></div>

      {/* Donor Info */}
      <section className="mb-8">
        <h2 className={`text-lg font-bold ${textPrimary} mb-2`}>
          Donor Information
        </h2>
        <p>
          <span className="font-semibold">Name:</span>{" "}
          {receipt.donorName || "Anonymous Donor"}
        </p>
        <p>
          <span className="font-semibold">Email:</span>{" "}
          {receipt.donorEmail || "N/A"}
        </p>
      </section>

      {/* Recipient Info */}
      <section className="mb-8">
        <h2 className={`text-lg font-bold ${textPrimary} mb-2`}>
          Recipient Information
        </h2>
        <p>
          <span className="font-semibold">Name:</span> {receipt.recipient}
        </p>
        <p>
          <span className="font-semibold">Donation Method:</span>{" "}
          {receipt.donationMethod}
        </p>
      </section>

      {/* Donation Amount */}
      <section className="mb-8">
        <h2 className={`text-lg font-bold ${textPrimary} mb-2`}>
          Donation Summary
        </h2>
        <div className="text-center">
          <p className="text-5xl font-extrabold text-pink-600 my-4">
            ${receipt.amount.toFixed(2)}
          </p>
          <p className={`${textSecondary} text-sm italic`}>
            {receipt.message || "Your donation helps change lives!"}
          </p>
        </div>
      </section>

      {/* Payment Status */}
      <section className="mb-8">
        <h2 className={`text-lg font-bold ${textPrimary} mb-2`}>
          Payment Status
        </h2>
        <span
          className={`inline-block px-4 py-2 rounded-lg text-sm font-semibold capitalize ${
            receipt.status.toLowerCase() === "completed"
              ? `${statusCompletedBg} ${statusCompletedText}`
              : `${statusPendingBg} ${statusPendingText}`
          }`}
        >
          {receipt.status}
        </span>
      </section>

      {/* Footer */}
      <footer
        className={`text-center text-sm ${textSecondary} border-t ${borderClass} pt-4 mt-4`}
      >
        <p>This receipt serves as an official record of your donation.</p>
        <p>For inquiries, please contact our support team.</p>
      </footer>

      {/* Decorative Elements */}
      <div
        className={`absolute top-0 left-0 w-24 h-24 ${decorativeBg} rounded-full blur-lg ${decorativeOpacity} -z-10`}
      ></div>
      <div
        className={`absolute bottom-0 right-0 w-40 h-40 ${decorativeBg} rounded-full blur-lg ${decorativeOpacity} -z-10`}
      ></div>
    </div>
  );
};

export default ReceiptTemplate;
