import React, { useState, useEffect, useContext } from "react";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import { Link } from "react-router-dom";
import { ThemeContext } from "../../../../context/ThemeContext";

const NewRequests = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { isDarkMode } = useContext(ThemeContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/request-donate",
          {
            params: {
              requestStatus: "New",
              isApproved: false,
            },
          }
        );
        setRequests(response.data);
      } catch (error) {
        console.error("Error fetching donation requests:", error);
        setError("Failed to load new requests. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const filteredRequests = requests.filter((requester) =>
    requester.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className={`p-4 h-full ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100"
      }`}
    >
      <div className="flex justify-between items-center flex-wrap gap-2 mb-4">
        <h1 className="text-3xl font-bold">New Requests</h1>
        <div className="relative w-full sm:w-1/2 md:w-1/3">
          <input
            type="text"
            placeholder="Search requests"
            className={`${
              isDarkMode ? "bg-gray-700 text-white" : "bg-white text-gray-700"
            } w-full p-1 pl-10 border-none rounded focus:outline-none focus:ring-2 focus:ring-pink-500`}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
          />
          <FaSearch className="absolute left-3 top-2 text-gray-400" />
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRequests.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">
              No new requests found.
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
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={requester.photo}
                    alt={requester.fullName}
                    className="h-12 w-12 rounded-full"
                  />
                  <div>
                    <h2 className="text-lg font-semibold">
                      {requester.fullName}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {requester.category}
                    </p>
                  </div>
                </div>
                <div className="mb-2">
                  <p>
                    <span className="font-semibold">Amount: $</span>
                    <span className="text-green-500 font-bold">
                      {" "}
                      {requester.neededAmount}
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold">Status:</span>
                    <span className="text-orange-500 font-bold">
                      {" "}
                      {requester.requestStatus}
                    </span>
                  </p>
                </div>
                <Link
                  to={`/admin/requests/new/${requester._id}`}
                  className="mt-auto bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 text-center"
                >
                  Go to Approval
                </Link>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NewRequests;
