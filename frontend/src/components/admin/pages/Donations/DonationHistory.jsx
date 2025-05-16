import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  FaSearch,
  FaArrowLeft,
  FaUser,
  FaMapMarkerAlt,
  FaInfoCircle,
  FaBook,
  FaHandHoldingHeart,
  FaTags,
  FaVenusMars,
  FaEye,
  FaBullseye,
  FaPlay,
  FaHistory,
} from "react-icons/fa";
import { ThemeContext } from "../../../../context/ThemeContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function DonationHistory() {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { isDarkMode } = useContext(ThemeContext);
  const [viewLoading, setViewLoading] = useState(null); // For view button loading state
  const [reactivateLoading, setReactivateLoading] = useState(null);
  const formatCurrency = (amount) => {
    return `${new Intl.NumberFormat("en-US").format(amount)} ETB`;
  };

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:5000/api/request-donate",
          {
            params: {
              donationStatus: ["Paused", "Completed"],
              requestStatus: "Approved",
            },
          }
        );
        setRequests(response.data);
      } catch (err) {
        setError("Failed to fetch donation requests");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const fetchDonations = async (requestId) => {
    try {
      setViewLoading(requestId);
      const response = await axios.get(
        `http://localhost:5000/api/request-donate/${requestId}`
      );
      setSelectedRequest({
        request: response.data.request,
        donations: response.data.donations,
        totalAmount: response.data.totalAmount,
      });
      toast.success("Donation details loaded successfully");
    } catch (err) {
      setError("Failed to fetch donation details");
      toast.error("Failed to load donation details");
      console.error(err);
    } finally {
      setViewLoading(null);
    }
  };

  const handleReactivate = async (requestId) => {
    try {
      setReactivateLoading(requestId);

      // Calculate new start and stop times
      const startTime = new Date();
      const stopTime = new Date();
      stopTime.setDate(stopTime.getDate() + 30);

      const response = await axios.patch(
        `http://localhost:5000/api/request-donate/${requestId}/donationStatus`,
        {
          donationStatus: "Active",
          startTime: startTime.toISOString(),
          stopTime: stopTime.toISOString(),
        }
      );

      // Update the local state
      setRequests(
        requests.map((req) =>
          req._id === requestId ? response.data.donation : req
        )
      );

      if (selectedRequest && selectedRequest.request._id === requestId) {
        setSelectedRequest({
          ...selectedRequest,
          request: response.data.donation,
        });
      }

      toast.success("Donation reactivated successfully");
    } catch (err) {
      setError("Failed to reactivate donation");
      const errorMessage =
        err.response?.data?.error || "Failed to reactivate donation";
      toast.error(errorMessage);
      console.error("Reactivation error:", err);
    } finally {
      setReactivateLoading(null);
    }
  };

  const filteredRequests = requests.filter(
    (request) =>
      request.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && requests.length === 0) {
    return (
      <div
        className={`flex justify-center items-center h-full ${
          isDarkMode ? "bg-gray-900" : "bg-gray-100"
        }`}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`p-4 text-center h-full ${
          isDarkMode ? "bg-gray-900 text-red-400" : "bg-gray-100 text-red-600"
        }`}
      >
        {error}
      </div>
    );
  }

  return (
    <div
      className={`p-4 h-full min-h-screen ${
        isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-pink-500 flex items-center gap-2">
          <FaHistory className="text-pink-500" />
          {selectedRequest
            ? `${selectedRequest.request.fullName}'s Donations`
            : "Donation History"}
        </h1>

        {!selectedRequest && (
          <div className="relative w-full md:w-1/3">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch
                className={`${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
              />
            </div>
            <input
              type="text"
              placeholder="Search by name, category, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`${
                isDarkMode
                  ? "bg-gray-800 text-white border-gray-700"
                  : "bg-white text-gray-700 border-gray-300"
              } 
                w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all`}
            />
          </div>
        )}
      </div>

      {!selectedRequest ? (
        /* REQUEST LIST VIEW */
        <div className="grid grid-cols-1 gap-5">
          {filteredRequests.length === 0 ? (
            <div
              className={`p-8 text-center rounded-lg ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              } shadow`}
            >
              <p className="text-gray-500">
                No donation requests found matching your search
              </p>
            </div>
          ) : (
            filteredRequests.map((request) => (
              <div
                key={request._id}
                className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 rounded-xl 
                ${
                  isDarkMode
                    ? request.donationStatus === "Completed"
                      ? "bg-green-900/30 hover:bg-green-900/40 border-l-4 border-green-500"
                      : request.donationStatus === "Paused"
                      ? "bg-yellow-900/30 hover:bg-yellow-900/40 border-l-4 border-yellow-500"
                      : "bg-gray-800 hover:bg-gray-750"
                    : request.donationStatus === "Completed"
                    ? "bg-green-100/80 hover:bg-green-100 border-l-4 border-green-500"
                    : request.donationStatus === "Paused"
                    ? "bg-yellow-100/80 hover:bg-yellow-100 border-l-4 border-yellow-500"
                    : "bg-white hover:bg-gray-50"
                }
                shadow transition-all hover:shadow-md relative`}
              >
                <div className="flex items-start sm:items-center gap-4 w-full">
                  {request.photo ? (
                    <img
                      src={request.photo}
                      alt={request.fullName}
                      className="w-16 h-16 rounded-full object-cover border-2 border-pink-200"
                    />
                  ) : (
                    <div
                      className={`w-16 h-16 rounded-full ${
                        isDarkMode ? "bg-gray-700" : "bg-gray-200"
                      } flex items-center justify-center border-2 border-pink-200`}
                    >
                      <FaUser
                        className={`text-xl ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-lg truncate">
                          {request.fullName}
                        </h3>
                        <div className="flex items-center gap-3 mt-1 flex-wrap">
                          <span
                            className={`flex items-center text-sm ${
                              isDarkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            <FaTags className="mr-1 text-pink-500" />{" "}
                            {request.category}
                          </span>
                          <span
                            className={`flex items-center text-sm ${
                              isDarkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            <FaMapMarkerAlt className="mr-1 text-blue-500" />{" "}
                            {request.location}
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              request.donationStatus === "Completed"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            }`}
                          >
                            {request.donationStatus}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-4">
                      {/* Goal Amount */}
                      <div className="flex items-center">
                        <div
                          className={`p-2 rounded-lg ${
                            isDarkMode ? "bg-gray-700" : "bg-gray-100"
                          } mr-3`}
                        >
                          <FaBullseye className="text-purple-500" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500">
                            Goal
                          </p>
                          <p className="font-bold text-purple-600 dark:text-purple-400">
                            {formatCurrency(request.neededAmount)}
                          </p>
                        </div>
                      </div>

                      {/* Raised Amount */}
                      <div className="flex items-center">
                        <div
                          className={`p-2 rounded-lg ${
                            isDarkMode ? "bg-gray-700" : "bg-gray-100"
                          } mr-3`}
                        >
                          <FaHandHoldingHeart className="text-pink-500" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500">
                            Raised
                          </p>
                          <p className="font-bold text-green-600 dark:text-green-400">
                            {formatCurrency(request.amountRaised || 0)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-4 flex flex-col gap-2 self-stretch sm:self-center z-10">
                  <button
                    onClick={() => fetchDonations(request._id)}
                    disabled={viewLoading === request._id}
                    className={`px-4 py-2 rounded-lg text-white hover:bg-pink-600 transition-all shadow hover:shadow-md flex items-center gap-2 justify-center min-w-[80px] ${
                      viewLoading === request._id
                        ? "bg-pink-600"
                        : "bg-pink-500"
                    }`}
                  >
                    {viewLoading === request._id ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <FaEye />
                        View
                      </>
                    )}
                  </button>
                  {request.donationStatus === "Paused" && (
                    <button
                      onClick={() => handleReactivate(request._id)}
                      disabled={reactivateLoading === request._id}
                      className={`px-4 py-2 rounded-lg text-white hover:bg-green-600 transition-all shadow hover:shadow-md flex items-center gap-2 justify-center min-w-[80px] ${
                        reactivateLoading === request._id
                          ? "bg-green-600"
                          : "bg-green-500"
                      }`}
                    >
                      {reactivateLoading === request._id ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                      ) : (
                        <>
                          <FaPlay />
                          Reactivate
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* DETAILED VIEW */
        <div className="space-y-6">
          <button
            onClick={() => setSelectedRequest(null)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-pink-500 text-white hover:bg-pink-600 transition-all shadow hover:shadow-md"
          >
            <FaArrowLeft />
            Back to All Requests
          </button>

          {/* Summary Card */}
          <div
            className={`p-6 rounded-xl shadow ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {selectedRequest.request.photo ? (
                <img
                  src={selectedRequest.request.photo}
                  alt={selectedRequest.request.fullName}
                  className="w-24 h-24 rounded-full object-cover border-4 border-pink-200"
                />
              ) : (
                <div
                  className={`w-24 h-24 rounded-full ${
                    isDarkMode ? "bg-gray-700" : "bg-gray-200"
                  } flex items-center justify-center border-4 border-pink-200`}
                >
                  <FaUser
                    className={`text-3xl ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold mb-1">
                  {selectedRequest.request.fullName}
                </h2>
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <span
                    className={`flex items-center ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    <FaVenusMars className="mr-1" />{" "}
                    {selectedRequest.request.gender},{" "}
                    {selectedRequest.request.age} years
                  </span>
                  <span
                    className={`flex items-center ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    <FaMapMarkerAlt className="mr-1" />{" "}
                    {selectedRequest.request.location}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      selectedRequest.request.donationStatus === "Completed"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                    }`}
                  >
                    {selectedRequest.request.donationStatus}
                  </span>
                </div>

                {/* Amount Info */}
                <div className="mb-4">
                  <div className="flex items-center gap-4 mb-4">
                    <span
                      className={`flex items-center text-sm ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      <FaHandHoldingHeart className="mr-2 text-pink-500" />
                      <span className="font-medium">Raised:</span>
                      <span className="ml-1 font-bold text-green-500 dark:text-green-400">
                        {formatCurrency(selectedRequest?.totalAmount || 0)}
                      </span>
                    </span>

                    <span
                      className={`flex items-center text-sm ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      <FaBullseye className="mr-2 text-blue-500" />
                      <span className="font-medium">Goal:</span>
                      <span className="ml-1 font-bold text-purple-500 dark:text-purple-400">
                        {formatCurrency(
                          selectedRequest?.request?.neededAmount || 0
                        )}
                      </span>
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-md overflow-hidden">
                    {(() => {
                      const total =
                        parseFloat(selectedRequest?.totalAmount) || 0;
                      const needed =
                        parseFloat(selectedRequest?.request?.neededAmount) || 1;
                      const percentage = Math.min((total / needed) * 100, 100);
                      const displayText =
                        needed > 0
                          ? `${Math.round(percentage)}%`
                          : "Goal not set";

                      return (
                        <div
                          className="bg-green-500 text-xs font-medium text-white text-center p-1"
                          style={{ width: `${percentage}%` }}
                        >
                          {displayText}
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {selectedRequest.request.donationStatus === "Paused" && (
                  <button
                    onClick={() =>
                      handleReactivate(selectedRequest.request._id)
                    }
                    disabled={reactivateLoading === selectedRequest.request._id}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-all shadow hover:shadow-md mt-4"
                  >
                    {reactivateLoading === selectedRequest.request._id ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <FaPlay />
                        Reactivate Fundraising
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Request Details */}
            <div
              className={`lg:w-2/5 p-6 rounded-xl shadow ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FaInfoCircle className="text-pink-500" />
                Case Details
              </h3>

              <div className="space-y-5">
                <div>
                  <h4 className="font-medium text-gray-500 mb-1">Category</h4>
                  <p
                    className={`px-3 py-2 rounded-lg ${
                      isDarkMode ? "bg-gray-700" : "bg-gray-100"
                    }`}
                  >
                    {selectedRequest.request.category}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-500 mb-1">
                    Case Description
                  </h4>
                  <p
                    className={`px-3 py-2 rounded-lg ${
                      isDarkMode ? "bg-gray-700" : "bg-gray-100"
                    }`}
                  >
                    {selectedRequest.request.caseDescription}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-500 mb-1 flex items-center gap-2">
                    <FaBook className="text-pink-500" />
                    Story
                  </h4>
                  <p
                    className={`px-3 py-2 rounded-lg ${
                      isDarkMode ? "bg-gray-700" : "bg-gray-100"
                    } whitespace-pre-line`}
                  >
                    {selectedRequest.request.story}
                  </p>
                </div>
              </div>
            </div>

            {/* Donations List */}
            <div
              className={`lg:w-3/5 p-6 rounded-xl shadow ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <FaUser className="text-pink-500" />
                  Donations ({selectedRequest.donations.length})
                </h3>
                <div className="text-lg font-semibold">
                  Total: {formatCurrency(selectedRequest.totalAmount)}
                </div>
              </div>

              {selectedRequest.donations.length === 0 ? (
                <div
                  className={`text-center py-8 rounded-lg ${
                    isDarkMode
                      ? "bg-gray-700 text-gray-400"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  No donations received yet
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedRequest.donations.map((donation) => (
                    <div
                      key={donation._id}
                      className={`p-4 rounded-lg ${
                        isDarkMode
                          ? "bg-gray-700 hover:bg-gray-650"
                          : "bg-gray-50 hover:bg-gray-100"
                      } shadow transition-all`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-12 h-12 rounded-full ${
                              isDarkMode ? "bg-gray-600" : "bg-gray-200"
                            } flex items-center justify-center text-gray-700 dark:text-gray-300 font-bold text-lg`}
                          >
                            {donation.fullName?.charAt(0)?.toUpperCase() || "A"}
                          </div>
                          <div>
                            <p className="font-medium">
                              {donation.fullName || "Anonymous Donor"}
                            </p>
                            <p className="text-sm text-gray-500">
                              {donation.phone || "Phone not provided"}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-lg font-bold text-pink-600 dark:text-pink-400">
                            {formatCurrency(donation.amount)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(donation.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </p>
                        </div>
                      </div>

                      {donation.paymentMethod && (
                        <div className="mt-3 flex flex-wrap justify-between gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-sm ${
                              isDarkMode
                                ? "bg-gray-600 text-gray-300"
                                : "bg-gray-200 text-gray-700"
                            }`}
                          >
                            {donation.paymentMethod === "Bank"
                              ? "Bank Transfer"
                              : `${donation.paymentMethod} (${donation.paymentOption})`}
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-sm ${
                              donation.status === "completed"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            }`}
                          >
                            {donation.status.charAt(0).toUpperCase() +
                              donation.status.slice(1)}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={isDarkMode ? "dark" : "light"}
      />
    </div>
  );
}

export default DonationHistory;
