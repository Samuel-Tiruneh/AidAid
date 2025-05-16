import React, { useEffect, useState, useContext } from "react";
import { 
  FiAward, FiHeart, FiUser, FiInfo, FiBook, FiMapPin, FiTrendingUp 
} from "react-icons/fi";
import { FaVenusMars } from 'react-icons/fa';
import axios from "axios";
import { useAuth } from "../Authentication/AuthContext";
import { toast } from "react-toastify";
import { ThemeContext } from "../../context/ThemeContext";
import { Inbox } from "lucide-react";

const RequesterDashboardContent = () => {
  const { token, isAuthenticated } = useAuth();
  const [request, setRequest] = useState(null);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isDarkMode } = useContext(ThemeContext);

  useEffect(() => {
    const fetchRequestData = async () => {
      setLoading(true);
      setError(null);
      
      if (!isAuthenticated) {
        setError("You are not authenticated. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const myRequestsRes = await axios.get(
          "http://localhost:5000/api/my-requests"
        );

        if (!myRequestsRes.data.length) {
          setRequest(null);
          setDonations([]);
          setLoading(false);
          return;
        }

        const userRequest = myRequestsRes.data[0];
        const detailedRes = await axios.get(
          `http://localhost:5000/api/request-donate/${userRequest._id}`
        );

        setRequest(detailedRes.data.request);
        setDonations(detailedRes.data.donations);
      } catch (err) {
        if (err.response?.status === 401) {
          setError("Session expired. Please log in again.");
        } else {
          setError("Failed to load request data");
          toast.error("Failed to load your request data");
        }
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchRequestData();
    }
  }, [isAuthenticated]);


  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 2
    }).format(amount).replace('ETB', '') + 'ETB';
  };

  const calculateProgress = () => {
    if (!request?.neededAmount) return 0;
    const total = donations.reduce((sum, d) => sum + (d.amount || 0), 0);
    return Math.min((total / request.neededAmount) * 100, 100);
  };

  const renderStatusMessage = () => {
    if (request?.requestStatus === 'New' || request?.donationStatus === 'NotActive') {
      return (
        <div className={`p-6 rounded-lg shadow text-center ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex flex-col items-center justify-center space-y-4">
            <FiInfo className={`text-4xl ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} />
            <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              Your request is under review
            </h3>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Our team is currently reviewing your submission. You'll be notified once it's approved.
            </p>
          </div>
        </div>
      );
    }

    if (request?.requestStatus === 'NeedRevise') {
      return (
        <div className={`p-6 rounded-lg shadow text-center ${isDarkMode ? 'bg-yellow-900/20' : 'bg-yellow-50'}`}>
          <div className="flex flex-col items-center justify-center space-y-4">
            <FiInfo className={`text-4xl ${isDarkMode ? 'text-yellow-400' : 'text-yellow-500'}`} />
            <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              Revision Required
            </h3>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Your request needs some modifications before approval. Please check your messages for details.
            </p>
          </div>
        </div>
      );
    }

    if (request?.requestStatus === 'Rejected') {
      return (
        <div className={`p-6 rounded-lg shadow text-center ${isDarkMode ? 'bg-red-900/20' : 'bg-red-50'}`}>
          <div className="flex flex-col items-center justify-center space-y-4">
            <FiInfo className={`text-4xl ${isDarkMode ? 'text-red-400' : 'text-red-500'}`} />
            <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              Request Rejected
            </h3>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Unfortunately, your request didn't meet our criteria. Please check your messages for more information.
            </p>
          </div>
        </div>
      );
    }

    if (request?.donationStatus === 'Paused') {
  return (
        <div className={`p-6 rounded-lg shadow text-center ${isDarkMode ? 'bg-orange-900/20' : 'bg-orange-50'}`}>
          <div className="flex flex-col items-center justify-center space-y-4">
            <FiInfo className={`text-4xl ${isDarkMode ? 'text-orange-400' : 'text-orange-500'}`} />
            <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              Campaign Paused
            </h3>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Your donation campaign is currently paused. Please contact support for more information.
            </p>
          </div>
        </div>
      );
    }

    if (request?.donationStatus === 'Completed') {
      return (
        <div className={`p-6 rounded-lg shadow text-center ${isDarkMode ? 'bg-green-900/20' : 'bg-green-50'}`}>
          <div className="flex flex-col items-center justify-center space-y-4">
            <FiInfo className={`text-4xl ${isDarkMode ? 'text-green-400' : 'text-green-500'}`} />
            <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              Campaign Completed
            </h3>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Thank you for using our platform! Your donation campaign has been successfully completed.
            </p>
          </div>
        </div>
      );
    }

    return null;
  };

  const progress = calculateProgress();
  const totalAmount = donations.reduce((sum, d) => sum + (d.amount || 0), 0);
  const donationCount = donations.length;
  const averageDonation = donationCount > 0 ? (totalAmount / donationCount).toFixed(2) : 0;
  const topDonor = donations.reduce(
    (top, donation) => (donation.amount > (top.amount || 0) ? donation : top),
    {}
  );

  if (loading) {
    return (
      <div className={`flex justify-center items-center h-64 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${isDarkMode ? 'border-pink-400' : 'border-pink-500'}`}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-6 rounded-lg shadow text-center ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <p className={`${isDarkMode ? 'text-red-400' : 'text-red-500'}`}>{error}</p>
        {!request && (
          <p className={`mt-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            You haven't created any donation request yet.
          </p>
        )}
      </div>
    );
  }

  if (!request) {
    return (
      <div className={`p-6 rounded-lg shadow flex flex-col items-center justify-center space-y-3 text-center ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <Inbox size={40} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
        <p className={`text-lg font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          No active request found.
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 p-4 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Render status message if needed */}
      {renderStatusMessage()}

      {/* Only show dashboard content if request is approved and active */}
      {request?.requestStatus === 'Approved' && request?.donationStatus === 'Active' && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-blue-50 border-blue-100'}`}>
              <div className="flex items-center">
                <FiHeart className={`text-3xl ${isDarkMode ? 'text-blue-400' : 'text-blue-500'} mr-2`} />
                <span className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-600'}`}>
                  Total Donations
                </span>
              </div>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                {donationCount}
              </p>
            </div>

            <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-green-50 border-green-100'}`}>
              <div className="flex items-center">
                <FiTrendingUp className={`text-3xl ${isDarkMode ? 'text-green-400' : 'text-green-500'} mr-2`} />
                <span className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-600'}`}>
                  Average Donation
                </span>
              </div>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                {averageDonation} ETB
              </p>
            </div>

            <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-purple-50 border-purple-100'}`}>
              <div className="flex items-center">
                <FiAward className={`text-3xl ${isDarkMode ? 'text-purple-400' : 'text-purple-500'} mr-2`} />
                <span className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-600'}`}>
                  Top Donation
                </span>
              </div>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                {topDonor.amount > 0 ? `${topDonor.amount} ETB` : "-"}
              </p>
              {topDonor.amount > 0 && topDonor.fullName && (
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  by {topDonor.fullName}
                </p>
              )}
            </div>
          </div>

          {/* Profile Summary */}
          <div className={`p-6 rounded-xl shadow-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="relative">
                {request.photo ? (
                  <img
                    src={request.photo}
                    alt={request.fullName}
                    className={`w-24 h-24 rounded-full object-cover border-4 shadow ${isDarkMode ? 'border-pink-600/50' : 'border-pink-200'}`}
                  />
                ) : (
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center border-4 shadow ${isDarkMode ? 'bg-gray-700 border-pink-600/50' : 'bg-gray-200 border-pink-200'}`}>
                    <FiUser className={`text-3xl ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h2 className={`text-2xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  {request.fullName}
                </h2>
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <span className={`flex items-center ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <FaVenusMars className={`mr-1 ${isDarkMode ? 'text-pink-400' : 'text-pink-500'}`} />
                    {request.gender}, {request.age} years
                  </span>
                  <span className={`flex items-center ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <FiMapPin className={`mr-1 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} />
                    {request.location}
                  </span>
                </div>

                {/* Progress Section */}
                <div className="mb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                    <div className="flex items-center">
                      <FiHeart className={`mr-2 ${isDarkMode ? 'text-pink-400' : 'text-pink-500'}`} />
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Raised:{" "}
                        <span className={`font-bold ${isDarkMode ? 'text-green-400' : 'text-green-500'}`}>
                          {formatCurrency(totalAmount)}
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center">
                      <FiAward className={`mr-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} />
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Goal:{" "}
                        <span className={`font-bold ${isDarkMode ? 'text-purple-400' : 'text-purple-500'}`}>
                          {formatCurrency(request.neededAmount)}
                        </span>
                      </span>
                    </div>
                  </div>

                  <div className={`w-full rounded-full overflow-hidden h-3 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <div
                      className="bg-gradient-to-r from-pink-500 to-pink-600 h-full"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <div className={`text-right mt-1 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {Math.round(progress)}% of goal reached
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Donations Section */}
          <div className={`p-6 rounded-xl shadow-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <h3 className={`text-xl font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                <FiUser className={`${isDarkMode ? 'text-pink-400' : 'text-pink-500'}`} />
                Donations ({donationCount})
              </h3>
              <div className={`text-lg font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Total: <span className={`${isDarkMode ? 'text-pink-400' : 'text-pink-600'}`}>{formatCurrency(totalAmount)}</span>
              </div>
            </div>

            {donationCount === 0 ? (
              <div className={`text-center py-8 rounded-lg ${isDarkMode ? 'bg-gray-700/50 text-gray-400' : 'bg-gray-50 text-gray-500'}`}>
                No donations received yet
              </div>
            ) : (
              <div className="space-y-3">
                {donations.map((donation) => (
                  <div
                    key={donation._id}
                    className={`p-4 rounded-lg border transition-all ${isDarkMode ? 'bg-gray-700/50 hover:bg-gray-700 border-gray-700' : 'bg-gray-50 hover:bg-gray-100 border-gray-100'}`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-inner ${isDarkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
                          {donation.fullName?.charAt(0)?.toUpperCase() || "A"}
                        </div>
                        <div>
                          <p className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                            {donation.fullName || "Anonymous Donor"}
                          </p>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {donation.phone || "Phone not provided"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-bold ${isDarkMode ? 'text-pink-400' : 'text-pink-600'}`}>
                          {formatCurrency(donation.amount)}
                        </p>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {new Date(donation.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Show additional message for completed campaigns */}
      {request?.donationStatus === 'Completed' && (
        <div className={`p-6 rounded-xl shadow-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            Final Campaign Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Amount Raised:</p>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                {formatCurrency(totalAmount)}
              </p>
            </div>
            <div>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Percentage of Goal:</p>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                {Math.round(progress)}%
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequesterDashboardContent;