import React, { useState, useEffect, useContext } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import axios from "axios";
import { Link } from "react-router-dom";
import { ThemeContext } from "../../../../context/ThemeContext";

const ApprovedRequests = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { isDarkMode } = useContext(ThemeContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [stopTime, setStopTime] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/request-donate",
          {
            params: {
              requestStatus: "Approved",
            },
          }
        );
        setRequests(response.data);
      } catch (error) {
        console.error("Error fetching approved donation requests:", error);
        setError("Failed to load approved requests. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleActivate = async () => {
    if (!startTime || !stopTime) {
      alert("Please set both start and stop times.");
      return;
    }
    if (new Date(startTime) >= new Date(stopTime)) {
      alert("Stop time must be after start time.");
      return;
    }

    try {
      const response = await axios.patch(
        `http://localhost:5000/api/request-donate/${selectedRequestId}/donationStatus`,
        {
          donationStatus: "Active",
          startTime,
          stopTime,
        }
      );
      setRequests((prev) =>
        prev.map((req) =>
          req._id === selectedRequestId ? response.data.donation : req
        )
      );
      setShowModal(false);
      setStartTime("");
      setStopTime("");
      setSelectedRequestId(null);
    } catch (error) {
      console.error(
        "Error activating donation request:",
        error.response?.data?.error || error.message
      );
      alert(
        `Failed to activate request: ${
          error.response?.data?.error || "Server error"
        }`
      );
    }
  };

  const filteredRequests = requests.filter((requester) =>
    requester.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className={`p-4 h-full relative ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      } ${showModal ? "backdrop-blur-md" : ""}`}
    >
      <div
        className={`transition-all duration-300 ${
          showModal ? "filter blur-sm" : ""
        }`}
      >
        <div className="flex justify-between items-center flex-wrap gap-2 mb-4">
          <h1 className="text-3xl font-bold font-[poppins]">
            Approved Requests
          </h1>
          <div className="relative w-full sm:w-1/2 md:w-1/3">
            <input
              type="text"
              placeholder="Search approved requests"
              className={`${
                isDarkMode
                  ? "bg-gray-700 text-white border-gray-600"
                  : "bg-white text-gray-700 border-gray-300"
              } w-full p-1 pl-10 border rounded focus:outline-none focus:ring-2 focus:ring-pink-500 font-[poppins]`}
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
            />
            <FaSearch
              className={`absolute left-3 top-2 ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            />
          </div>
        </div>

        {loading ? (
          <p className="text-center font-[poppins]">Loading...</p>
        ) : error ? (
          <p className="text-red-500 text-center font-[poppins]">{error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRequests.length === 0 ? (
              <p className="col-span-full text-center text-gray-500 font-[poppins]">
                No approved requests found.
              </p>
            ) : (
              filteredRequests.map((requester) => (
                <div
                  key={requester._id}
                  className={`rounded-lg shadow-md p-4 flex flex-col justify-between ${
                    isDarkMode
                      ? "bg-gray-800 text-white"
                      : "bg-white text-gray-700"
                  }`}
                >
                  <div className="flex justify-between">
                    <div className="flex items-center gap-4 mb-4">
                      <img
                        src={requester.photo}
                        alt={requester.fullName}
                        className="h-12 w-12 rounded-full"
                      />
                      <div>
                        <h2 className="text-lg font-semibold font-[poppins]">
                          {requester.fullName}
                        </h2>
                        <p
                          className={`text-sm ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          } font-[poppins]`}
                        >
                          {requester.category}
                        </p>
                      </div>
                    </div>
                    <p
                      className={`bg-green-600 font-bold text-sm px-2 h-5 rounded-lg flex items-center font-[poppins] ${
                        isDarkMode ? "text-white" : "text-white"
                      }`}
                    >
                      {requester.donationStatus}
                    </p>
                  </div>
                  <div className="mb-2">
                    <p className="font-[poppins]">
                      <span className="font-semibold">Needed Amount: $</span>
                      <span className="text-green-500 font-bold">
                        {" "}
                        {requester.neededAmount}
                      </span>
                    </p>
                    <p className="font-[poppins]">
                      <span className="font-semibold">Raised:</span>
                      <span className="text-orange-500 font-bold">
                        {" "}
                        {requester.amountRaised}
                      </span>
                    </p>
                  </div>
                  {requester.donationStatus === "Active" ? (
                    <button
                      onClick={() =>
                        axios
                          .patch(
                            `http://localhost:5000/api/request-donate/${requester._id}/donationStatus`,
                            { donationStatus: "Paused" }
                          )
                          .then((response) =>
                            setRequests((prev) =>
                              prev.map((req) =>
                                req._id === requester._id
                                  ? response.data.donation
                                  : req
                              )
                            )
                          )
                          .catch((error) =>
                            alert(
                              `Failed to pause request: ${
                                error.response?.data?.error || "Server error"
                              }`
                            )
                          )
                      }
                      className={`mt-auto ${
                        isDarkMode
                          ? "bg-yellow-600 hover:bg-yellow-700"
                          : "bg-yellow-500 hover:bg-yellow-600"
                      } text-white px-4 py-2 rounded text-center font-[poppins]`}
                    >
                      Pause Donation
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedRequestId(requester._id);
                        setShowModal(true);
                      }}
                      className={`mt-auto ${
                        isDarkMode
                          ? "bg-pink-600 hover:bg-pink-700"
                          : "bg-pink-500 hover:bg-pink-600"
                      } text-white px-4 py-2 rounded text-center disabled:opacity-50 disabled:cursor-not-allowed font-[poppins]`}
                    >
                      Activate For Donation
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className={`relative p-6 rounded-lg shadow-xl w-full max-w-md font-[poppins] ${
              isDarkMode
                ? "bg-gray-800 text-white border border-gray-700"
                : "bg-white text-gray-900 border border-gray-200"
            }`}
          >
            <button
              onClick={() => {
                setShowModal(false);
                setStartTime("");
                setStopTime("");
                setSelectedRequestId(null);
              }}
              className={`absolute top-3 right-3 ${
                isDarkMode
                  ? "text-gray-300 hover:text-red-400"
                  : "text-gray-600 hover:text-red-500"
              } text-xl`}
            >
              <FaTimes />
            </button>
            <h2
              className={`text-xl font-semibold mb-4 ${
                isDarkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Set Activation Schedule
            </h2>
            <div className="space-y-4">
              <label className="block">
                <span
                  className={`block mb-2 ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Start Time:
                </span>
                <input
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className={`w-full p-2 border rounded font-[poppins] ${
                    isDarkMode
                      ? "bg-gray-700 text-white border-gray-600 focus:ring-pink-500"
                      : "bg-white text-gray-900 border-gray-300 focus:ring-pink-500"
                  } focus:outline-none focus:ring-2`}
                  min={new Date().toISOString().slice(0, 16)}
                />
              </label>
              <label className="block">
                <span
                  className={`block mb-2 ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Stop Time:
                </span>
                <input
                  type="datetime-local"
                  value={stopTime}
                  onChange={(e) => setStopTime(e.target.value)}
                  className={`w-full p-2 border rounded font-[poppins] ${
                    isDarkMode
                      ? "bg-gray-700 text-white border-gray-600 focus:ring-pink-500"
                      : "bg-white text-gray-900 border-gray-300 focus:ring-pink-500"
                  } focus:outline-none focus:ring-2`}
                  min={startTime || new Date().toISOString().slice(0, 16)}
                />
              </label>
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => {
                  setShowModal(false);
                  setStartTime("");
                  setStopTime("");
                  setSelectedRequestId(null);
                }}
                className={`px-4 py-2 rounded font-[poppins] ${
                  isDarkMode
                    ? "bg-gray-600 hover:bg-gray-500 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleActivate}
                disabled={!startTime || !stopTime}
                className={`px-4 py-2 rounded font-[poppins] ${
                  isDarkMode
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                Activate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovedRequests;
