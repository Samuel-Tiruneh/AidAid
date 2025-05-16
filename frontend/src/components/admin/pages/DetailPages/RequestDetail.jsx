import React, { useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaTimes,
  FaArrowLeft,
  FaArrowRight,
  FaVideo,
  FaFilePdf,
} from "react-icons/fa";
import axios from "axios";
import { ThemeContext } from "../../../../context/ThemeContext";
import MediaModal from "../../../Donate/MediaModal";

const RequestDetail = () => {
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checks, setChecks] = useState([false, false, false]);
  const [showValidationMessage, setShowValidationMessage] = useState(false);
  const [showStopTimeModal, setShowStopTimeModal] = useState(false);
  const [stopTime, setStopTime] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalFile, setModalFile] = useState(null);
  const [modalFileType, setModalFileType] = useState(null);
  const [modalFiles, setModalFiles] = useState([]);
  const [modalIndex, setModalIndex] = useState(0);
  const navigate = useNavigate();

  const { id } = useParams();
  const { isDarkMode } = useContext(ThemeContext);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/request-donate/${id}`
        );
        setRequest(response.data.request);
      } catch (error) {
        console.error("Error fetching request:", error);
        setError("Failed to load request details.");
      } finally {
        setLoading(false);
      }
    };
    fetchRequest();
  }, [id]);

  // Open modal
  const openModal = (file, type, files = [file], index = 0) => {
    setModalFile(file);
    setModalFileType(type);
    setModalFiles(files);
    setModalIndex(index);
    setModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setModalOpen(false);
    setModalFile(null);
    setModalFileType(null);
    setModalFiles([]);
    setModalIndex(0);
  };

  // Keyboard support for modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (modalOpen && e.key === "Escape") {
        closeModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [modalOpen]);

  const handleStatusUpdate = async (requestStatus) => {
    if (requestStatus === "Approved" && !checks.every(Boolean)) {
      setShowValidationMessage(true);
      return;
    }
    try {
      const payload = { requestStatus };
      if (requestStatus === "Approved") {
        if (!stopTime) {
          setShowValidationMessage(true);
          return;
        }
        payload.stopTime = stopTime;
      }
      const response = await axios.patch(
        `http://localhost:5000/api/request-donate/${id}/requestStatus`,
        payload
      );
      setRequest(response.data.donation);
      setShowValidationMessage(false);
      if (requestStatus === "Approved") {
        setChecks([false, false, false]);
        setStopTime("");
        navigate("/admin/requests/approved");
      }
    } catch (error) {
      console.error(
        `Error updating status to ${requestStatus}:`,
        error.response?.data?.error || error.message
      );
      setError(
        `Failed to update status to ${requestStatus}: ${
          error.response?.data?.error || "Server error"
        }`
      );
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center font-[poppins]">
        Loading request details...
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="p-6 text-center text-red-500 font-[poppins]">
        {error || "Request not found."}
      </div>
    );
  }

  const donationProgress = {
    raised: request.amountRaised,
    goal: request.neededAmount,
    approvedDate: request.isApproved
      ? new Date(request.updatedAt).toLocaleDateString()
      : null,
  };

  const mediaFiles = [
    ...(request.photo ? [{ url: request.photo, type: "image" }] : []),
    ...(request.document ? [{ url: request.document, type: "pdf" }] : []),
    ...(request.video ? [{ url: request.video, type: "video" }] : []),
    ...(request.additionalPhotos || []).map((url) => ({ url, type: "image" })),
    ...(request.additionalDocuments || []).map((url) => ({ url, type: "pdf" })),
  ].map((file) => ({
    ...file,
    type:
      file.url.includes(".mp4") || file.url.includes(".mov")
        ? "video"
        : file.url.includes(".pdf")
        ? "pdf"
        : "image",
  }));

  const imageFiles = mediaFiles.filter((file) => file.type === "image");
  const videoFiles = mediaFiles.filter((file) => file.type === "video");
  const pdfFiles = mediaFiles.filter((file) => file.type === "pdf");

  return (
    <div
      className={`p-6 max-w-6xl mx-auto relative ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      } ${showStopTimeModal ? "backdrop-blur-md" : ""}`}
    >
      <div
        className={`transition-all duration-300 ${
          showStopTimeModal ? "filter blur-sm" : ""
        }`}
      >
        <div
          className={`min-h-screen p-6 font-[poppins] mb-4 rounded-lg ${
            isDarkMode ? "bg-gray-800" : "bg-gray-100"
          }`}
        >
          <div
            className={`shadow-lg rounded-lg p-4 ${
              isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
            }`}
          >
            <button
              onClick={() => navigate(-1)}
              className={`px-4 py-2 rounded-md mb-4 flex items-center gap-2 ${
                isDarkMode
                  ? "bg-pink-600 hover:bg-pink-700"
                  : "bg-pink-500 hover:bg-pink-600"
              } text-white font-[poppins]`}
            >
              <FaArrowLeft /> Back
            </button>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div
                className={`border shadow-lg rounded-lg w-full max-w-md mx-auto ${
                  isDarkMode ? "bg-gray-700" : "bg-white"
                }`}
              >
                <img
                  src={request.photo}
                  alt={request?.fullName || "Requester"}
                  className="rounded-lg w-full cursor-pointer"
                  onClick={() =>
                    openModal(request.photo, "image", [request.photo])
                  }
                />
              </div>

              <div
                className={`flex flex-col border shadow-lg rounded-lg p-4 ${
                  isDarkMode ? "bg-gray-700" : "bg-white"
                }`}
              >
                <div className="mb-6">
                  <h2
                    className={`text-2xl font-bold mt-4 ${
                      isDarkMode ? "text-white" : "text-gray-800"
                    } font-[poppins]`}
                  >
                    {request.fullName}
                  </h2>
                  <p
                    className={`text-lg mt-2 ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    } font-[poppins]`}
                  >
                    <strong>Age:</strong> {request.age}
                  </p>
                  <p
                    className={`text-lg ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    } font-[poppins]`}
                  >
                    <strong>Gender:</strong> {request.gender}
                  </p>
                  <p
                    className={`text-lg ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    } font-[poppins]`}
                  >
                    <strong>Location:</strong> {request.location}
                  </p>
                  <p
                    className={`text-lg ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    } font-[poppins]`}
                  >
                    <strong>Category:</strong> {request.category}
                  </p>
                  <p
                    className={`text-lg mt-4 ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    } font-[poppins]`}
                  >
                    {request.caseDescription}
                  </p>
                  <p
                    className={`text-2xl font-bold mt-4 text-center ${
                      isDarkMode ? "text-red-400" : "text-red-600"
                    } font-[poppins]`}
                  >
                    Amount Needed: {request.neededAmount}
                  </p>
                  <p
                    className={`text-lg mt-2 ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    } font-[poppins]`}
                  >
                    <strong>Revision Count:</strong> {request.revisionCount}
                  </p>
                  {request.lastRevisedAt && (
                    <p
                      className={`text-lg ${
                        isDarkMode ? "text-gray-300" : "text-gray-600"
                      } font-[poppins]`}
                    >
                      <strong>Last Revised:</strong>{" "}
                      {new Date(request.lastRevisedAt).toLocaleString()}
                    </p>
                  )}
                </div>
                <div
                  className={`border-b-4 ${
                    isDarkMode ? "border-gray-600" : "border-gray-300"
                  } mx-8`}
                />
              </div>
            </div>

            <div className="mt-12">
              <h3
                className={`text-2xl font-bold mt-8 pb-2 text-center ${
                  isDarkMode ? "text-pink-400" : "text-pink-500"
                } font-[poppins]`}
              >
                Supporting Documents & Media
              </h3>
              <div
                className={`border-b-4 ${
                  isDarkMode ? "border-gray-600" : "border-gray-300"
                } mx-8`}
              />

              {imageFiles.length > 0 ? (
                <div
                  className={`mt-6 border shadow-lg rounded-lg p-5 flex flex-col items-center justify-center ${
                    isDarkMode ? "bg-gray-700" : "bg-white"
                  }`}
                >
                  <img
                    src={imageFiles[modalIndex].url}
                    alt={`Photo ${modalIndex + 1}`}
                    className="w-full max-w-md mx-auto rounded-lg cursor-pointer"
                    onClick={() =>
                      openModal(
                        imageFiles[modalIndex].url,
                        "image",
                        imageFiles.map((f) => f.url),
                        modalIndex
                      )
                    }
                  />
                  {imageFiles.length > 1 && (
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() =>
                          setModalIndex(
                            (prev) =>
                              (prev - 1 + imageFiles.length) % imageFiles.length
                          )
                        }
                        className={`px-2 py-1 text-sm rounded-md flex items-center gap-1 ${
                          isDarkMode
                            ? "bg-pink-600 hover:bg-pink-700"
                            : "bg-pink-500 hover:bg-pink-600"
                        } text-white font-[poppins]`}
                        aria-label="Previous photo"
                      >
                        <FaArrowLeft /> Prev
                      </button>
                      <button
                        onClick={() =>
                          setModalIndex(
                            (prev) => (prev + 1) % imageFiles.length
                          )
                        }
                        className={`px-2 py-1 text-sm rounded-md flex items-center gap-1 ${
                          isDarkMode
                            ? "bg-pink-600 hover:bg-pink-700"
                            : "bg-pink-500 hover:bg-pink-600"
                        } text-white font-[poppins]`}
                        aria-label="Next photo"
                      >
                        Next <FaArrowRight />
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <p
                  className={`text-center mt-4 font-semibold ${
                    isDarkMode ? "text-red-400" : "text-red-500"
                  } font-[poppins]`}
                >
                  No photos attached.
                </p>
              )}

              <div
                className={`mt-4 border shadow-lg rounded-lg p-5 text-center ${
                  isDarkMode ? "bg-gray-700" : "bg-white"
                }`}
              >
                {videoFiles.length > 0 ? (
                  <p className="flex items-center justify-center gap-3">
                    <span
                      className={`font-semibold ${
                        isDarkMode ? "text-green-400" : "text-green-600"
                      } font-[poppins]`}
                    >
                      Video file is attached
                    </span>
                    <button
                      onClick={() => openModal(videoFiles[0].url, "video")}
                      className={`underline flex items-center gap-2 ${
                        isDarkMode ? "text-pink-400" : "text-pink-500"
                      } font-[poppins]`}
                    >
                      <FaVideo
                        className={`${
                          isDarkMode ? "text-red-400" : "text-red-500"
                        } text-2xl`}
                      />
                      View Video
                    </button>
                  </p>
                ) : (
                  <p
                    className={`font-semibold ${
                      isDarkMode ? "text-red-400" : "text-red-500"
                    } font-[poppins]`}
                  >
                    No video attached.
                  </p>
                )}
              </div>

              <div
                className={`mt-4 border shadow-lg rounded-lg p-5 text-center ${
                  isDarkMode ? "bg-gray-700" : "bg-white"
                }`}
              >
                {pdfFiles.length > 0 ? (
                  <div className="flex flex-col items-center">
                    <p className="flex items-center gap-3">
                      <span
                        className={`font-semibold ${
                          isDarkMode ? "text-green-400" : "text-green-600"
                        } font-[poppins]`}
                      >
                        Document file is attached
                      </span>
                      <button
                        onClick={() =>
                          openModal(
                            pdfFiles[modalIndex].url,
                            "pdf",
                            pdfFiles.map((f) => f.url),
                            modalIndex
                          )
                        }
                        className={`underline flex items-center gap-2 ${
                          isDarkMode ? "text-pink-400" : "text-pink-500"
                        } font-[poppins]`}
                      >
                        <FaFilePdf /> View Document {modalIndex + 1}
                      </button>
                    </p>
                    {pdfFiles.length > 1 && (
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() =>
                            setModalIndex(
                              (prev) =>
                                (prev - 1 + pdfFiles.length) % pdfFiles.length
                            )
                          }
                          className={`px-2 py-1 text-sm rounded-md flex items-center gap-1 ${
                            isDarkMode
                              ? "bg-pink-600 hover:bg-pink-700"
                              : "bg-pink-500 hover:bg-pink-600"
                          } text-white font-[poppins]`}
                          aria-label="Previous document"
                        >
                          <FaArrowLeft /> Prev
                        </button>
                        <button
                          onClick={() =>
                            setModalIndex(
                              (prev) => (prev + 1) % pdfFiles.length
                            )
                          }
                          className={`px-2 py-1 text-sm rounded-md flex items-center gap-1 ${
                            isDarkMode
                              ? "bg-pink-600 hover:bg-pink-700"
                              : "bg-pink-500 hover:bg-pink-600"
                          } text-white font-[poppins]`}
                          aria-label="Next document"
                        >
                          Next <FaArrowRight />
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <p
                    className={`font-semibold ${
                      isDarkMode ? "text-red-400" : "text-red-500"
                    } font-[poppins]`}
                  >
                    No documents attached.
                  </p>
                )}
              </div>
            </div>

            {request.messages && request.messages.length > 0 && (
              <div className="mt-12">
                <h3
                  className={`text-2xl font-bold mt-8 pb-2 text-center ${
                    isDarkMode ? "text-pink-400" : "text-pink-500"
                  } font-[poppins]`}
                >
                  Communication History
                </h3>
                <div
                  className={`border-b-4 ${
                    isDarkMode ? "border-gray-600" : "border-gray-300"
                  } mx-8`}
                />
                <div
                  className={`mt-6 border shadow-lg rounded-lg p-5 ${
                    isDarkMode ? "bg-gray-700" : "bg-white"
                  }`}
                >
                  {request.messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`mb-4 p-4 rounded-lg ${
                        msg.sender === "Admin"
                          ? isDarkMode
                            ? "bg-blue-800"
                            : "bg-blue-100"
                          : isDarkMode
                          ? "bg-gray-600"
                          : "bg-gray-200"
                      }`}
                    >
                      <p
                        className={`font-semibold ${
                          isDarkMode ? "text-white" : "text-gray-800"
                        } font-[poppins]`}
                      >
                        {msg.sender} - {new Date(msg.sentAt).toLocaleString()}
                      </p>
                      <p
                        className={`${
                          isDarkMode ? "text-gray-300" : "text-gray-600"
                        } font-[poppins]`}
                      >
                        {msg.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {request.requestStatus === "Approved" ? (
          <div
            className={`mt-10 ${
              isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
            } rounded-lg p-6 shadow-lg space-y-6`}
          >
            <h1 className="text-green-600 font-bold font-[poppins]">
              ✅ You have approved the request successfully!
            </h1>
          </div>
        ) : (
          <div
            className={`${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } rounded-lg p-6 shadow-lg`}
          >
            <h3 className="text-2xl font-semibold mb-4 font-[poppins]">
              Pre-Request Checks
            </h3>
            <p className="mb-4 font-[poppins]">
              Current Status:{" "}
              <span className="font-bold">{request.requestStatus}</span>
            </p>
            <form className="space-y-4">
              {[
                "Medical documents are attached",
                "Legal documents are verified",
                "Amount requested is justified",
              ].map((label, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-lg ${
                    isDarkMode ? "bg-gray-700" : "bg-gray-300"
                  }`}
                >
                  <label className="flex items-center gap-2 font-[poppins]">
                    <input
                      type="checkbox"
                      className="accent-pink-500 scale-180"
                      checked={checks[idx]}
                      onChange={(e) => {
                        const updated = [...checks];
                        updated[idx] = e.target.checked;
                        setChecks(updated);
                      }}
                    />
                    {label}
                  </label>
                </div>
              ))}
              {showValidationMessage && (
                <p className="text-red-400 mt-2 font-[poppins]">
                  ⚠️ Please check all conditions and set a stop time before
                  approval.
                </p>
              )}

              <div className="flex gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowStopTimeModal(true);
                  }}
                  disabled={
                    request.requestStatus !== "New" &&
                    request.requestStatus !== "NeedRevise"
                  }
                  className={`${
                    isDarkMode
                      ? "bg-pink-600 hover:bg-green-600"
                      : "bg-pink-500 hover:bg-green-600"
                  } text-white px-4 py-2 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-[poppins]`}
                >
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusUpdate("NeedRevise")}
                  disabled={
                    request.requestStatus !== "New" &&
                    request.requestStatus !== "NeedRevise"
                  }
                  className={`${
                    isDarkMode
                      ? "bg-yellow-600 hover:bg-yellow-700"
                      : "bg-yellow-500 hover:bg-yellow-600"
                  } text-white px-4 py-2 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-[poppins]`}
                >
                  Need Revise
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusUpdate("Rejected")}
                  disabled={
                    request.requestStatus !== "New" &&
                    request.requestStatus !== "NeedRevise"
                  }
                  className={`${
                    isDarkMode
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-red-500 hover:bg-red-600"
                  } text-white px-4 py-2 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-[poppins]`}
                >
                  Reject Request
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {showStopTimeModal && (
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
                setShowStopTimeModal(false);
                setStopTime("");
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
              Set Donation Stop Time
            </h2>
            <label className="block mb-4">
              <span
                className={`block mb-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Select Date & Time:
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
                min={new Date(Date.now() + 24 * 60 * 60 * 1000)
                  .toISOString()
                  .slice(0, 16)}
              />
            </label>
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => {
                  setShowStopTimeModal(false);
                  setStopTime("");
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
                onClick={() => {
                  handleStatusUpdate("Approved");
                  setShowStopTimeModal(false);
                }}
                disabled={!stopTime}
                className={`px-4 py-2 rounded font-[poppins] ${
                  isDarkMode
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <MediaModal
        isOpen={modalOpen}
        onClose={closeModal}
        file={modalFile}
        fileType={modalFileType}
        files={modalFiles}
        currentIndex={modalIndex}
        setCurrentIndex={setModalIndex}
      />
    </div>
  );
};

export default RequestDetail;