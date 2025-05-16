import React, { useState, useContext } from "react";
import { useParams } from "react-router-dom";
// import { useSelector } from "react-redux";
import { FaTimes } from "react-icons/fa";
import { ThemeContext } from "../../../../context/ThemeContext";

const DonorDetail = () => {
  const { donorId } = useParams();
  // const donor = useSelector((state) =>
  //   state.admin.donors.find((d) => d.id === parseInt(donorId))
  // );

  // Feedback Modal State
  const [showModal, setShowModal] = useState(false);
  const [feedback, setFeedback] = useState("");

  const { isDarkMode } = useContext(ThemeContext);

  // Dummy data if donor is not available
  const dummyDonor = {
    name: "Abebe Kebede",
    email: "abc@example.com",
    location: "BahirDar",
    image: "https://randomuser.me/api/portraits/men/75.jpg",
    totalDonated: 15000,
    currency: "ETB",
    transactions: [
      {
        receiverName: "Alemu Bel",
        receiverImage: "https://randomuser.me/api/portraits/men/32.jpg",
        amount: 30000,
        currency: "ETB",
        date: "2025-03-25",
      },
      {
        receiverName: "Hanna Tesfaye",
        receiverImage: "https://randomuser.me/api/portraits/women/45.jpg",
        amount: 20000,
        currency: "ETB",
        date: "2025-03-10",
      },
      {
        receiverName: "Mekdes Abebe",
        receiverImage: "https://randomuser.me/api/portraits/women/65.jpg",
        amount: 18000,
        currency: "ETB",
        date: "2025-02-22",
      },
    ],
  };

  // const activeDonor = donor || dummyDonor;
  const activeDonor = dummyDonor;

  return (
    <div
      className={`h-full grid grid-cols-1 md:grid-cols-2 gap-6 p-6 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* Left: Donor Profile */}
      <div
        className={`p-6 rounded-lg shadow ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
      >
        <div className="flex flex-col items-center text-center">
          <img
            src={activeDonor.image}
            alt={activeDonor.name}
            className="w-24 h-24 rounded-full object-cover mb-4"
          />
          <h2 className="text-2xl font-semibold">{activeDonor.name}</h2>
          <p className="text-pink-600">{activeDonor.email}</p>
          <p
            className={`${
              isDarkMode ? "text-gray-100" : "text-gray-700"
            } mb-4 font-semibold`}
          >
            {activeDonor.location}
          </p>
          <div className="text-green-500 font-bold text-lg mb-6">
            Total Donated: {activeDonor.totalDonated} {activeDonor.currency}
          </div>
          <button
            className="bg-pink-500 hover:bg-pink-600 px-4 py-2 rounded-md font-medium"
            onClick={() => setShowModal(true)}
          >
            Give Feedback
          </button>
        </div>
      </div>

      {/* Right: Donated To List */}
      <div
        className={`p-6 rounded-lg shadow ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
      >
        <h3 className="text-xl font-semibold mb-4">
          People Helped by {activeDonor.name}
        </h3>
        <ul className="space-y-4">
          {activeDonor.transactions.map((tx, index) => (
            <li
              key={index}
              className={`flex items-center gap-4 p-1 rounded-md ${
                isDarkMode
                  ? "bg-gray-700 text-white"
                  : "bg-gray-300 text-gray-900"
              }`}
            >
              <img
                src={tx.receiverImage}
                alt={tx.receiverName}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <p className="font-semibold">{tx.receiverName}</p>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {" "}
                  Donated:{" "}
                  <span className="text-green-600 text-sm">{tx.amount}</span>
                </p>
              </div>
              <p
                className={`text-xs ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {tx.date}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* Feedback Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-blur-lg bg-opacity-70 flex items-center justify-center">
          <div
            className={`rounded-lg p-6 w-full max-w-lg relative ${
              isDarkMode
                ? "bg-gray-700 text-white"
                : "bg-gray-300 text-gray-900"
            }`}
          >
            <button
              className="absolute top-2 right-2 text-gray-100 hover:text-red-600 text-xl"
              onClick={() => setShowModal(false)}
            >
              <FaTimes />
            </button>
            <h3 className="text-xl font-semibold mb-4">Send Feedback</h3>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows="5"
              className={`w-full border p-3 rounded mb-4 ${
                isDarkMode
                  ? "bg-gray-600 text-white border-gray-500"
                  : "bg-white text-gray-900 border-gray-300"
              }`}
              placeholder="Write your feedback here..."
            />
            <button
              onClick={() => {
                console.log("Feedback sent:", feedback);
                setShowModal(false);
                setFeedback("");
              }}
              className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded"
            >
              Send Feedback
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonorDetail;
