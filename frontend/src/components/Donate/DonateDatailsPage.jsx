import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaArrowLeft,
  FaDonate,
  FaArrowRight,
  FaVideo,
  FaFilePdf,
  FaCopy,
} from "react-icons/fa";
import VerfiedIcon from "../../assets/DonateAssets/verify.png";
import LogoImg from "../../assets/images/logo.png";
import { ThemeContext } from "../../context/ThemeContext";
import { useAuth } from "../Authentication/AuthContext";
import MediaModal from "./MediaModal";

const DonateDetailsPage = ({ openPopup }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useContext(ThemeContext);
  const [donation, setDonation] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalFile, setModalFile] = useState(null);
  const [modalFileType, setModalFileType] = useState(null);
  const [modalFiles, setModalFiles] = useState([]);
  const [modalIndex, setModalIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const { user } = useAuth();

  // Construct shareable link
  const shareableLink = `${window.location.origin}/details/${id}`;

  // Copy link to clipboard
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareableLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
      setError("Failed to copy link. Please try again.");
    }
  };

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

  useEffect(() => {
    const fetchDonationDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        

        if (!id) {
          throw new Error("No donation ID provided");
        }

        const response = await axios.get(
          `http://localhost:5000/api/request-donate/${id}`
        );

        console.log("Full API Response:", response.data);

        const requestData = response.data.request || response.data;

        if (!requestData) {
          throw new Error("No request data received");
        }

        setDonation({
          photo: requestData.photo,
          fullName: requestData.fullName,
          age: requestData.age,
          gender: requestData.gender,
          location: requestData.location,
          category: requestData.category,
          caseDescription: requestData.caseDescription,
          neededAmount: requestData.neededAmount,
          amountRaised: requestData.amountRaised,
          additionalPhotos: requestData.additionalPhotos || [],
          additionalDocuments: requestData.additionalDocuments || [],
          video: requestData.video || null,
        });
      } catch (error) {
        console.error("Fetch error:", error);
        setError(
          error.response?.data?.message ||
            error.message ||
            "Failed to load donation details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDonationDetails();
  }, [id]);

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

  if (loading) {
    return (
      <div
        className={`min-h-screen p-6 font-[poppins] flex flex-col items-center justify-center ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-900"
        }`}
      >
        <div className="text-pink-500 dark:text-pink-300 text-4xl animate-spin">
          <FaArrowRight />
        </div>
        <p
          className={`mt-4 text-xl ${
            isDarkMode ? "text-gray-200" : "text-gray-800"
          }`}
        >
          Loading...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`min-h-screen p-6 font-[poppins] flex flex-col items-center justify-center ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-900"
        }`}
      >
        <div className="text-red-500 dark:text-red-400 text-6xl mb-4">
          <FaFilePdf />
        </div>
        <h2
          className={`text-2xl font-semibold ${
            isDarkMode ? "text-white" : "text-gray-800"
          }`}
        >
          Error
        </h2>
        <p
          className={`text-lg mt-2 max-w-md text-center ${
            isDarkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          {error}
        </p>
        <button
          onClick={() => navigate("/donate-page")}
          className={`mt-6 px-6 py-2 rounded-md flex items-center gap-2 ${
            isDarkMode
              ? "bg-pink-600 hover:bg-pink-700"
              : "bg-pink-500 hover:bg-pink-600"
          } text-white`}
        >
          <FaArrowLeft /> Return to Donate Page
        </button>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen p-6 font-[poppins] ${
        isDarkMode ? "bg-gray-800" : "bg-gray-100"
      }`}
    >
      <div
        className={`shadow-lg rounded-lg p-6 ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
        }`}
      >
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className={`px-4 py-2 rounded-md mb-6 flex items-center gap-2 ${
            isDarkMode
              ? "bg-pink-600 hover:bg-pink-700"
              : "bg-pink-500 hover:bg-pink-600"
          } text-white`}
        >
          <FaArrowLeft /> Back
        </button>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column: Photo and Shareable Link */}
          <div className="flex flex-col items-center">
            <img
              src={donation.photo || "/default-image.jpg"}
              alt={donation.fullName || "Requester"}
              className="rounded-lg w-full max-w-sm object-cover aspect-square"
            />
            <div className="mt-4 w-full max-w-sm flex items-center gap-2">
              <input
                type="text"
                value={shareableLink}
                readOnly
                aria-label="Shareable link to donation details"
                className={`flex-1 p-2 rounded-md border text-sm ${
                  isDarkMode
                    ? "bg-gray-600 text-gray-200 border-gray-500"
                    : "bg-gray-100 text-gray-800 border-gray-300"
                }`}
              />
              <button
                onClick={handleCopyLink}
                className={`px-3 py-2 rounded-md flex items-center gap-2 ${
                  isDarkMode
                    ? "bg-pink-600 hover:bg-pink-700"
                    : "bg-pink-500 hover:bg-pink-600"
                } text-white hover:cursor-pointer`}
              >
                <FaCopy /> {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>

          {/* Right Column: Details and Donate Button */}
          <div
            className={`flex flex-col p-6 border rounded-lg ${
              isDarkMode ? "bg-gray-700" : "bg-white"
            }`}
          >
            <div className="flex items-center mb-4">
              <img src={VerfiedIcon} alt="Verified" className="w-8 h-8 mr-2" />
              <img src={LogoImg} alt="Logo" className="w-12 h-12" />
            </div>
            <h2
              className={`text-2xl font-bold ${
                isDarkMode ? "text-white" : "text-gray-800"
              }`}
            >
              {donation.fullName}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <p
                className={`text-lg ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                <strong>Age:</strong> {donation.age}
              </p>
              <p
                className={`text-lg ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                <strong>Gender:</strong> {donation.gender}
              </p>
              <p
                className={`text-lg ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                <strong>Location:</strong> {donation.location}
              </p>
              <p
                className={`text-lg ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                <strong>Category:</strong> {donation.category}
              </p>
            </div>
            <p
              className={`text-lg mt-4 ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {donation.caseDescription}
            </p>
            <p
              className={`text-2xl font-bold mt-4 text-center ${
                isDarkMode ? "text-red-400" : "text-red-600"
              }`}
            >
              Amount Needed: {donation.neededAmount.toLocaleString()} ETB
            </p>
            <p
              className={`text-2xl font-bold mt-4 text-center ${
                isDarkMode ? "text-green-400" : "text-green-600"
              }`}
            >
              Raised: {donation.amountRaised.toLocaleString()} ETB
            </p>
            <button
              onClick={() => {
                if (!user) {
                  openPopup("login");
                } else {
                  if (donation.fullName) {
                    navigate(
                      `/donate/${id}/${encodeURIComponent(donation.fullName)}`
                    );
                  } else {
                    console.error(
                      "Full name is missing for donation:",
                      donation
                    );
                    setError("Cannot navigate: Full name is missing.");
                  }
                }
              }}
              className={`mt-6 px-6 py-2 rounded-md flex items-center gap-2 mx-auto ${
                isDarkMode
                  ? "bg-pink-600 hover:bg-pink-700"
                  : "bg-pink-500 hover:bg-pink-600"
              } text-white hover:cursor-pointer`}
            >
              <FaDonate /> Donate Now
            </button>
          </div>
        </div>

        {/* Supporting Media Section */}
        <div className="mt-12">
          <h3
            className={`text-2xl font-bold mb-4 text-center ${
              isDarkMode ? "text-pink-400" : "text-pink-500"
            }`}
          >
            Supporting Documents & Media
          </h3>
          <div
            className={`border-b-4 mb-6 ${
              isDarkMode ? "border-gray-600" : "border-gray-300"
            } mx-auto max-w-md`}
          />

          {/* Additional Photos */}
          {donation.additionalPhotos?.length > 0 ? (
            <div
              className={`border shadow-lg rounded-lg p-5 flex flex-col items-center ${
                isDarkMode ? "bg-gray-700" : "bg-white"
              }`}
            >
              <h4
                className={`text-lg font-semibold mb-2 ${
                  isDarkMode ? "text-white" : "text-gray-800"
                }`}
              >
                Photos
              </h4>
              <img
                src={donation.additionalPhotos[modalIndex]}
                alt={`Photo ${modalIndex + 1}`}
                className="w-full max-w-md mx-auto rounded-lg cursor-pointer"
                onClick={() =>
                  openModal(
                    donation.additionalPhotos[modalIndex],
                    "image",
                    donation.additionalPhotos,
                    modalIndex
                  )
                }
              />
              {donation.additionalPhotos.length > 1 && (
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() =>
                      setModalIndex(
                        (prev) =>
                          (prev - 1 + donation.additionalPhotos.length) %
                          donation.additionalPhotos.length
                      )
                    }
                    className={`px-2 py-1 text-sm rounded-md flex items-center gap-1 ${
                      isDarkMode
                        ? "bg-pink-600 hover:bg-pink-700"
                        : "bg-pink-500 hover:bg-pink-600"
                    } text-white`}
                    aria-label="Previous photo"
                  >
                    <FaArrowLeft /> Prev
                  </button>
                  <button
                    onClick={() =>
                      setModalIndex(
                        (prev) => (prev + 1) % donation.additionalPhotos.length
                      )
                    }
                    className={`px-2 py-1 text-sm rounded-md flex items-center gap-1 ${
                      isDarkMode
                        ? "bg-pink-600 hover:bg-pink-700"
                        : "bg-pink-500 hover:bg-pink-600"
                    } text-white`}
                    aria-label="Next photo"
                  >
                    Next <FaArrowRight />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <p
              className={`text-center font-semibold ${
                isDarkMode ? "text-red-400" : "text-red-500"
              }`}
            >
              No additional photos attached.
            </p>
          )}

          {/* Video */}
          <div
            className={`mt-6 border shadow-lg rounded-lg p-5 text-center ${
              isDarkMode ? "bg-gray-700" : "bg-white"
            }`}
          >
            <h4
              className={`text-lg font-semibold mb-2 ${
                isDarkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Video
            </h4>
            {donation.video ? (
              <p className="flex items-center justify-center gap-3">
                <span
                  className={`font-semibold ${
                    isDarkMode ? "text-green-400" : "text-green-600"
                  }`}
                >
                  Video file attached
                </span>
                <button
                  onClick={() => openModal(donation.video, "video")}
                  className={`underline flex items-center gap-2 ${
                    isDarkMode ? "text-pink-400" : "text-pink-500"
                  }`}
                >
                  <FaVideo
                    className={`${
                      isDarkMode ? "text-red-400" : "text-red-500"
                    } text-xl`}
                  />
                  View Video
                </button>
              </p>
            ) : (
              <p
                className={`font-semibold ${
                  isDarkMode ? "text-red-400" : "text-red-500"
                }`}
              >
                No video attached.
              </p>
            )}
          </div>

          {/* Documents */}
          <div
            className={`mt-6 border shadow-lg rounded-lg p-5 text-center ${
              isDarkMode ? "bg-gray-700" : "bg-white"
            }`}
          >
            <h4
              className={`text-lg font-semibold mb-2 ${
                isDarkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Documents
            </h4>
            {donation.additionalDocuments?.length > 0 ? (
              <div className="flex flex-col items-center">
                <p className="flex items-center gap-3">
                  <span
                    className={`font-semibold ${
                      isDarkMode ? "text-green-400" : "text-green-600"
                    }`}
                  >
                    Document file attached
                  </span>
                  <button
                    onClick={() =>
                      openModal(
                        donation.additionalDocuments[modalIndex],
                        "pdf",
                        donation.additionalDocuments,
                        modalIndex
                      )
                    }
                    className={`underline flex items-center gap-2 ${
                      isDarkMode ? "text-pink-400" : "text-pink-500"
                    }`}
                  >
                    <FaFilePdf /> View Document {modalIndex + 1}
                  </button>
                </p>
                {donation.additionalDocuments.length > 1 && (
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() =>
                        setModalIndex(
                          (prev) =>
                            (prev - 1 + donation.additionalDocuments.length) %
                            donation.additionalDocuments.length
                        )
                      }
                      className={`px-2 py-1 text-sm rounded-md flex items-center gap-1 ${
                        isDarkMode
                          ? "bg-pink-600 hover:bg-pink-700"
                          : "bg-pink-500 hover:bg-pink-600"
                      } text-white`}
                      aria-label="Previous document"
                    >
                      <FaArrowLeft /> Prev
                    </button>
                    <button
                      onClick={() =>
                        setModalIndex(
                          (prev) =>
                            (prev + 1) % donation.additionalDocuments.length
                        )
                      }
                      className={`px-2 py-1 text-sm rounded-md flex items-center gap-1 ${
                        isDarkMode
                          ? "bg-pink-600 hover:bg-pink-700"
                          : "bg-pink-500 hover:bg-pink-600"
                      } text-white`}
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
                }`}
              >
                No documents attached.
              </p>
            )}
          </div>
        </div>

        {/* Media Modal */}
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
    </div>
  );
};

export default DonateDetailsPage;