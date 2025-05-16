import React, { useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import { ThemeContext } from "../../../../context/ThemeContext";

import profile from "../../../../assets/images/donation_image2.jpg";
import donor from "../../../../assets/images/test.jpg";

const ActiveDonationDetail = () => {
  const [isApproved, setIsApproved] = useState(false);
  const [checks, setChecks] = useState([false, false, false]);
  const [showValidationMessage, setShowValidationMessage] = useState(false);

  const { id } = useParams();

  const { isDarkMode } = useContext(ThemeContext);

  const [showStopTimeModal, setShowStopTimeModal] = useState(false);
  const [stopTime, setStopTime] = useState("");

  // Modal state
  const [modalContent, setModalContent] = useState(null);

  const openModal = (content) => {
    setModalContent(content);
  };

  const closeModal = () => {
    setModalContent(null);
  };

  const request = {
    userId: {
      name: "Abebe Kebede",
      case: "Abebe Kebede is suffering from a rare disease that requires immediate medical attention. He needs to travel abroad for treatment, and the estimated cost is $200,000.",
      profilePic: { profile },
    },
    amountNeeded: 200000,
    documents: [
      {
        type: "image",
        url: { donor },
      },
      {
        type: "video",
        url: "https://www.w3schools.com/html/mov_bbb.mp4",
      },
      {
        type: "pdf",
        url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      },
    ],
  };

  // Dummy data for progress and donors
  const donationProgress = {
    raised: 75000,
    goal: request.amountNeeded,
    approvedDate: "2025-04-10",
  };

  const donors = [
    {
      name: "Abera Nigatu",
      amount: 15000,
      time: "2 hours ago",
      pic: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      name: "Bety Naty",
      amount: 20000,
      time: "1 day ago",
      pic: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "Shambel Tesfaye",
      amount: 40000,
      time: "3 days ago",
      pic: "https://randomuser.me/api/portraits/men/76.jpg",
    },
  ];

  return (
    <div
      className={`p-6 max-w-6xl mx-auto ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <div
        className={`my-4 ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        } rounded-lg p-6 shadow-lg space-y-6`}
      >
        <h3 className="text-2xl font-semibold mb-4">
          Donation Progress Tracker
        </h3>

        {/* Progress Bar */}
        <div>
          <p className="mb-1">
            Raised: ${donationProgress.raised} / ${donationProgress.goal}
          </p>
          <div
            className={`w-full h-4 rounded-full overflow-hidden ${
              isDarkMode ? "bg-gray-700" : "bg-gray-400"
            }`}
          >
            <div
              className="bg-pink-500 h-4"
              style={{
                width: `${
                  (donationProgress.raised / donationProgress.goal) * 100
                }%`,
              }}
            ></div>
          </div>
        </div>

        {/* Info and Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p>
            <span className="font-semibold">Approved on:</span>{" "}
            {donationProgress.approvedDate}
          </p>

          <div className="flex flex-col sm:items-end">
            {stopTime && (
              <p className="text-sm text-red-500 font-semibold mb-2">
                ⏰ Stop Time: {new Date(stopTime).toLocaleString()}
              </p>
            )}
            <div className="flex gap-4">
              <button
                onClick={() => setShowStopTimeModal(true)}
                className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
              >
                Set Stop Time
              </button>
              <button className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded">
                Pause Donation
              </button>
            </div>
          </div>
        </div>

        {/* Donor List */}
        <div>
          <h4 className="text-xl font-semibold mb-3">Recent Donors</h4>
          <ul className="space-y-4">
            {donors.map((donor, index) => (
              <li
                key={index}
                className={`flex items-center gap-4 p-1 rounded-lg ${
                  isDarkMode
                    ? "bg-gray-700 text-white"
                    : "bg-gray-300 text-gray-900"
                }`}
              >
                <img
                  src={donor.pic}
                  alt={donor.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <p className="font-semibold">{donor.name}</p>
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Donated $
                    <span className="text-green-600">{donor.amount}</span>
                  </p>
                </div>
                <span
                  className={`text-sm ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {donor.time}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div
        className={`${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        } rounded-lg p-6 shadow-lg mb-10`}
      >
        {/* Profile Section */}
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          <img
            src={profile}
            alt="Profile"
            className="w-full md:w-64 rounded-lg object-cover"
          />
          <div className="flex flex-col justify-center">
            <h2 className="text-2xl font-semibold mb-1">
              {request.userId.name}
            </h2>
            <p className="text-gray-400 mb-2">{request.userId.case}</p>
            <p>
              <span className="font-semibold">Amount Needed:</span> $
              {request.amountNeeded}
            </p>
          </div>
        </div>

        {/* Document Section */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold mb-2">Attached Documents:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {request.documents.map((doc, idx) => (
              <div
                key={idx}
                onClick={() => openModal(doc)}
                className="cursor-pointer hover:opacity-90 transition"
              >
                {doc.type === "image" ? (
                  <img
                    src={donor}
                    alt={`Doc ${idx + 1}`}
                    className="rounded-lg w-full h-48 object-cover"
                  />
                ) : doc.type === "video" ? (
                  <video
                    src={doc.url}
                    className="rounded-lg w-full h-48 object-cover"
                    controls
                  />
                ) : doc.type === "pdf" ? (
                  <div className="flex flex-col items-center justify-center bg-white rounded-lg w-full h-15 p-4">
                    <p className="text-center text-black">
                      PDF Document {idx + 1}
                    </p>
                    <p className="text-sm text-blue-600 underline">
                      Click to view
                    </p>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="relative bg-white p-4 rounded-lg max-w-3xl w-full">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-black hover:text-red-600 text-xl"
            >
              <FaTimes />
            </button>
            {modalContent.type === "image" ? (
              <img
                src={modalContent.url}
                alt="Full View"
                className="w-full h-auto rounded"
              />
            ) : modalContent.type === "video" ? (
              <video
                src={modalContent.url}
                controls
                autoPlay
                className="w-full rounded"
              />
            ) : modalContent.type === "pdf" ? (
              <iframe
                src={modalContent.url}
                title="PDF Viewer"
                className="w-full h-[80vh] rounded"
              ></iframe>
            ) : null}
          </div>
        </div>
      )}

      {showStopTimeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="relative bg-white text-black p-6 rounded-lg w-full max-w-md">
            <button
              onClick={() => setShowStopTimeModal(false)}
              className="absolute top-2 right-2 text-black hover:text-red-600 text-xl"
            >
              <FaTimes />
            </button>
            <h2 className="text-xl font-semibold mb-4">
              Set Donation Stop Time
            </h2>
            <label className="block mb-4">
              <span className="block mb-2">Select Date & Time:</span>
              <input
                type="datetime-local"
                value={stopTime}
                onChange={(e) => setStopTime(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </label>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowStopTimeModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  console.log("Stop time set for:", stopTime); // You can handle this value as needed
                  setShowStopTimeModal(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveDonationDetail;
