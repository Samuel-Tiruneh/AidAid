import React, { useState, useEffect, useContext } from "react";
import { FaSearch, FaTimes, FaEnvelope } from "react-icons/fa";
import axios from "axios";
import { Link } from "react-router-dom";
import { ThemeContext } from "../../../../context/ThemeContext";

const NeedRevisionRequests = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { isDarkMode } = useContext(ThemeContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [messageContent, setMessageContent] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/request-donate",
          {
            params: {
              requestStatus: "NeedRevise",
              isApproved: false,
            },
          }
        );
        setRequests(response.data);
      } catch (error) {
        console.error("Error fetching NeedRevise donation requests:", error);
        setError("Failed to load NeedRevise requests. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleSendMessage = async () => {
    if (!messageContent.trim()) {
      alert("Please enter a message.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/request-donate/${selectedRequestId}/message`,
        {
          content: messageContent,
        }
      );
      setRequests((prev) =>
        prev.map((req) =>
          req._id === selectedRequestId
            ? { ...req, messages: response.data.donation.messages }
            : req
        )
      );
      setShowMessageModal(false);
      setMessageContent("");
      setSelectedRequestId(null);
      alert("Message sent successfully!");
    } catch (error) {
      console.error(
        "Error sending message:",
        error.response?.data?.error || error.message
      );
      alert(
        `Failed to send message: ${
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
      } ${showMessageModal ? "backdrop-blur-md" : ""}`}
    >
      <div
        className={`transition-all duration-300 ${
          showMessageModal ? "filter blur-sm" : ""
        }`}
      >
        <div className="flex justify-between items-center flex-wrap gap-2 mb-4">
          <h1 className="text-3xl font-bold font-[poppins]">
            Need Revision Requests
          </h1>
          <div className="relative w-full sm:w-1/2 md:w-1/3">
            <input
              type="text"
              placeholder="Search NeedRevise requests"
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
                No NeedRevise requests found.
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
                      className={`bg-yellow-600 font-bold text-sm px-2 h-5 rounded-lg flex items-center font-[poppins] ${
                        isDarkMode ? "text-white" : "text-white"
                      }`}
                    >
                      {requester.requestStatus}
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
                      <span className="font-semibold">Revisions:</span>
                      <span className="text-orange-500 font-bold">
                        {" "}
                        {requester.revisionCount}
                      </span>
                    </p>
                    {requester.lastRevisedAt && (
                      <p className="font-[poppins]">
                        <span className="font-semibold">Last Revised:</span>
                        <span className="text-blue-500">
                          {" "}
                          {new Date(
                            requester.lastRevisedAt
                          ).toLocaleDateString()}
                        </span>
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedRequestId(requester._id);
                        setShowMessageModal(true);
                      }}
                      className={`mt-auto ${
                        isDarkMode
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "bg-blue-500 hover:bg-blue-600"
                      } text-white px-4 py-2 rounded text-center flex-1 font-[poppins] flex items-center justify-center gap-2`}
                    >
                      <FaEnvelope /> Message
                    </button>
                    <Link
                      to={`/admin/requests/new/${requester._id}`}
                      className={`mt-auto ${
                        isDarkMode
                          ? "bg-pink-600 hover:bg-pink-700"
                          : "bg-pink-500 hover:bg-pink-600"
                      } text-white px-4 py-2 rounded text-center flex-1 font-[poppins]`}
                    >
                      Review
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {showMessageModal && (
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
                setShowMessageModal(false);
                setMessageContent("");
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
              Send Message to Requester
            </h2>
            <div className="space-y-4">
              <label className="block">
                <span
                  className={`block mb-2 ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Message:
                </span>
                <textarea
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  className={`w-full p-2 border rounded h-32 resize-none font-[poppins] ${
                    isDarkMode
                      ? "bg-gray-700 text-white border-gray-600 focus:ring-pink-500"
                      : "bg-white text-gray-900 border-gray-300 focus:ring-pink-500"
                  } focus:outline-none focus:ring-2`}
                  placeholder="Explain why the request needs revision (e.g., unclear documents, unrealistic amount)..."
                  maxLength={1000}
                />
              </label>
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => {
                  setShowMessageModal(false);
                  setMessageContent("");
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
                onClick={handleSendMessage}
                disabled={!messageContent.trim()}
                className={`px-4 py-2 rounded font-[poppins] ${
                  isDarkMode
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                } disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
              >
                <FaEnvelope /> Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NeedRevisionRequests;
