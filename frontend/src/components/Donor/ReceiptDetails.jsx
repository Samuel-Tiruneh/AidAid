import React, { useState, useContext } from "react";
import {
  FaFileAlt,
  FaCheckCircle,
  FaClock,
  FaPrint,
  FaDownload,
  FaEye,
} from "react-icons/fa";
import { motion } from "framer-motion";
import ReceiptTemplate from "./ReceiptTemplate";
import receiptData from "./receiptData";
import jsPDF from "jspdf";
import { ThemeContext } from "../../context/ThemeContext"; // Adjust path as needed

const ReceiptDetails = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [expandedReceiptId, setExpandedReceiptId] = useState(null);

  const handlePrint = (receipt) => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Donation Receipt</title>
          <link rel="stylesheet" href="styles.css" />
        </head>
        <body>
          ${document.getElementById(`receipt-${receipt.receiptId}`).innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleDownload = (receipt) => {
    const doc = new jsPDF();

    doc.text("Donation Receipt", 20, 10);
    doc.text(`Receipt ID: #${receipt.receiptId}`, 20, 20);
    doc.text(`Date: ${new Date(receipt.date).toLocaleDateString()}`, 20, 30);
    doc.text(`Recipient: ${receipt.recipient}`, 20, 40);
    doc.text(`Donation Method: ${receipt.donationMethod}`, 20, 50);
    doc.text(`Amount: $${receipt.amount.toFixed(2)}`, 20, 60);
    doc.text(`Status: ${receipt.status}`, 20, 70);

    const pdfOutput = doc.output("blob");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(pdfOutput);
    link.download = `Receipt_${receipt.receiptId}.pdf`;
    link.click();
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Helper classes for dark/light mode
  const containerBg = isDarkMode ? "bg-gray-800" : "bg-gray-50";
  const containerText = isDarkMode ? "text-white" : "text-black";
  const cardBg = isDarkMode ? "bg-gray-900" : "bg-white";
  const cardBorder = isDarkMode ? "border-gray-700" : "border-pink-100";
  const cardShadow = isDarkMode
    ? "shadow-lg shadow-black/50"
    : "shadow-md shadow-pink-200";
  const buttonBg = isDarkMode ? "bg-pink-700" : "bg-pink-100";
  const buttonText = isDarkMode ? "text-pink-200" : "text-pink-600";
  const buttonHoverBg = isDarkMode ? "hover:bg-pink-600" : "hover:bg-pink-200";
  const buttonBorder = isDarkMode ? "border-pink-600" : "border-pink-200";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`${containerBg} ${containerText} max-w-6xl mx-auto p-6 md:p-8 rounded-lg transition-colors duration-300`}
    >
      <div className="flex items-center justify-between mb-10">
        <h2
          className={`text-4xl font-extrabold flex items-center ${
            isDarkMode ? "text-pink-400" : "text-pink-800"
          }`}
        >
          <FaFileAlt
            className={`mr-3 ${
              isDarkMode ? "text-pink-500" : "text-pink-600"
            } text-3xl`}
          />
          Donation Receipts
        </h2>
        <span
          className={`${buttonBg} ${buttonText} px-4 py-1 rounded-full text-sm font-medium shadow`}
        >
          {receiptData.length} total
        </span>
      </div>

      <div className="space-y-6">
        {receiptData.length > 0 ? (
          receiptData.map((receipt, index) => (
            <motion.div
              key={index}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              id={`receipt-${receipt.receiptId}`}
              className={`${cardBg} border ${cardBorder} p-6 rounded-2xl ${cardShadow} transition-all duration-300 hover:shadow-xl`}
            >
              <div className="flex justify-between items-center">
                <div
                  className={`text-lg font-semibold ${
                    isDarkMode ? "text-pink-300" : "text-pink-700"
                  }`}
                >
                  Receipt ID: #{receipt.receiptId}
                </div>
                <button
                  onClick={() =>
                    setExpandedReceiptId(
                      expandedReceiptId === receipt.receiptId
                        ? null
                        : receipt.receiptId
                    )
                  }
                  className={`flex items-center text-sm font-medium ${buttonText} hover:${buttonHoverBg} ${buttonBg} border ${buttonBorder} px-4 py-2 rounded-lg transition ease-in-out duration-200 transform hover:scale-105`}
                >
                  <FaEye className="mr-2" />{" "}
                  {expandedReceiptId === receipt.receiptId ? "Hide" : "View"}{" "}
                  Details
                </button>
              </div>

              <div className="mt-4">
                {/* Show compact details */}
                <div
                  className={`${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  } text-sm`}
                >
                  <p>Recipient: {receipt.recipient}</p>
                  <p>Date: {formatDate(receipt.date)}</p>
                  <p>Amount: ${receipt.amount.toFixed(2)}</p>
                </div>

                {/* Show full receipt details if expanded */}
                {expandedReceiptId === receipt.receiptId && (
                  <div className="mt-4">
                    <ReceiptTemplate receipt={receipt} />
                    <div className="flex gap-3 mt-4 justify-center md:justify-end">
                      <a
                        href={receipt.receiptLink}
                        download
                        title="Download Receipt"
                        className={`flex items-center text-sm font-medium ${buttonText} hover:${buttonHoverBg} ${buttonBg} border ${buttonBorder} px-4 py-2 rounded-lg transition ease-in-out duration-200 transform hover:scale-105`}
                      >
                        <FaDownload className="mr-2" /> Download
                      </a>
                      <button
                        title="Print Receipt"
                        className={`flex items-center text-sm font-medium ${buttonText} hover:${buttonHoverBg} ${buttonBg} border ${buttonBorder} px-4 py-2 rounded-lg transition ease-in-out duration-200 transform hover:scale-105`}
                        onClick={() => handlePrint(receipt)}
                      >
                        <FaPrint className="mr-2" /> Print
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div
              className={`mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-4 ${
                isDarkMode ? "bg-pink-900" : "bg-pink-100"
              }`}
            >
              <FaFileAlt
                className={`text-3xl ${
                  isDarkMode ? "text-pink-400" : "text-pink-500"
                }`}
              />
            </div>
            <h3
              className={`text-2xl font-semibold mb-2 ${
                isDarkMode ? "text-pink-300" : "text-pink-700"
              }`}
            >
              No receipts found
            </h3>
            <p className={`${isDarkMode ? "text-pink-400" : "text-pink-500"}`}>
              Your donation receipts will appear here once available.
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ReceiptDetails;
