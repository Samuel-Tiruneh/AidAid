import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { ThemeContext } from "../../../../context/ThemeContext";

const DonationFinished = () => {
  const { receiverId } = useParams();

  const { isDarkMode } = useContext(ThemeContext);

  // Dummy data fallback
  const dummyReceiver = {
    name: "Hanna Tesfaye",
    case: "Medical Assistance for Surgery",
    location: "Addis Ababa",
    image: "https://randomuser.me/api/portraits/women/45.jpg",
    totalReceived: 20000,
    status: "Fulfilled",
    currency: "ETB",
    donationSpan: "2025-02-10 to 2025-03-25",
    donations: [
      {
        donorName: "Abebe Kebede",
        donorImage: "https://randomuser.me/api/portraits/men/75.jpg",
        amount: 12000,
        currency: "ETB",
        date: "2025-03-25",
      },
      {
        donorName: "Daniel Solomon",
        donorImage: "https://randomuser.me/api/portraits/men/44.jpg",
        amount: 8000,
        currency: "ETB",
        date: "2025-03-10",
      },
    ],
  };

  //   const activeReceiver = receiver || dummyReceiver;
  const activeReceiver = dummyReceiver;

  return (
    <div
      className={`h-full grid grid-cols-1 md:grid-cols-2 gap-6 p-6 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* Left: Receiver Profile */}
      <div
        className={`p-6 rounded-lg shadow ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
      >
        <div className="flex flex-col items-center text-center">
          <img
            src={activeReceiver.image}
            alt={activeReceiver.name}
            className="w-24 h-24 rounded-full object-cover mb-4"
          />
          <h2 className="text-2xl font-semibold">{activeReceiver.name}</h2>
          <p className={`${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
            {activeReceiver.location}
          </p>
          <p
            className={`italic mb-2 ${
              isDarkMode ? "text-gray-300" : "text-gray-500"
            }`}
          >
            {activeReceiver.case}
          </p>
          <div className="text-green-500 font-bold text-lg">
            Received: {activeReceiver.totalReceived} {activeReceiver.currency}
          </div>
          <p
            className={`mt-2 font-semibold ${
              isDarkMode ? "text-gray-300" : "text-gray-500"
            }`}
          >
            Status:{" "}
            <span className="text-yellow-500">{activeReceiver.status}</span>
          </p>
          <p
            className={`text-sm mt-2 ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Duration: {activeReceiver.donationSpan}
          </p>
          <button className="mt-6 text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md font-medium cursor-pointer">
            Re-Donate
          </button>
        </div>
      </div>

      {/* Right: Donors List */}
      <div
        className={`p-6 rounded-lg shadow ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
      >
        <h3 className="text-xl font-semibold mb-4">
          People who helped {activeReceiver.name}
        </h3>
        <ul className="space-y-4">
          {activeReceiver.donations.map((donation, index) => (
            <li
              key={index}
              className={`flex items-center gap-4 p-1 rounded-md ${
                isDarkMode
                  ? "bg-gray-700 text-white"
                  : "bg-gray-300 text-gray-900"
              }`}
            >
              <img
                src={donation.donorImage}
                alt={donation.donorName}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <p className="font-semibold">{donation.donorName}</p>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Amount:{" "}
                  <span className="text-green-500 text-sm">
                    {donation.amount}
                  </span>
                </p>
              </div>
              <p
                className={`text-xs ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {donation.date}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DonationFinished;
