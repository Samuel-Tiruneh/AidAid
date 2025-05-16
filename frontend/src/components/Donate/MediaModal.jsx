import React, { useState, useContext } from "react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaTimes,
  FaSearchPlus,
  FaSearchMinus,
  FaDownload,
} from "react-icons/fa";
import { ThemeContext } from "../../context/ThemeContext";

const MediaModal = ({
  isOpen,
  onClose,
  file,
  fileType,
  files,
  currentIndex,
  setCurrentIndex,
}) => {
  const { isDarkMode } = useContext(ThemeContext);
  const [zoom, setZoom] = useState(1);

  if (!isOpen || !file) return null;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + files.length) % files.length);
    setZoom(1); // Reset zoom
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % files.length);
    setZoom(1); // Reset zoom
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.2, 0.5));

  const renderContent = () => {
    switch (fileType) {
      case "image":
        return (
          <div className="flex flex-col items-center">
            <img
              src={file}
              alt={`Media ${currentIndex + 1}`}
              className="max-w-full max-h-[70vh] object-contain"
              style={{ transform: `scale(${zoom})` }}
            />
            {files.length > 1 && (
              <div className="flex gap-2 mt-4">
                <button
                  onClick={handlePrev}
                  className={`px-2 py-1 text-sm rounded-md flex items-center gap-1 ${
                    isDarkMode
                      ? "bg-pink-600 hover:bg-pink-700"
                      : "bg-pink-500 hover:bg-pink-600"
                  } text-white`}
                  aria-label="Previous image"
                >
                  <FaArrowLeft /> Prev
                </button>
                <button
                  onClick={handleNext}
                  className={`px-2 py-1 text-sm rounded-md flex items-center gap-1 ${
                    isDarkMode
                      ? "bg-pink-600 hover:bg-pink-700"
                      : "bg-pink-500 hover:bg-pink-600"
                  } text-white`}
                  aria-label="Next image"
                >
                  Next <FaArrowRight />
                </button>
              </div>
            )}
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleZoomIn}
                className={`px-2 py-1 text-sm rounded-md ${
                  isDarkMode
                    ? "bg-gray-600 hover:bg-gray-500"
                    : "bg-gray-300 hover:bg-gray-400"
                } text-white`}
                aria-label="Zoom in"
              >
                <FaSearchPlus />
              </button>
              <button
                onClick={handleZoomOut}
                className={`px-2 py-1 text-sm rounded-md ${
                  isDarkMode
                    ? "bg-gray-600 hover:bg-gray-500"
                    : "bg-gray-300 hover:bg-gray-400"
                } text-white`}
                aria-label="Zoom out"
              >
                <FaSearchMinus />
              </button>
            </div>
          </div>
        );
      case "video":
        return (
          <video
            controls
            src={file}
            className="max-w-full max-h-[70vh]"
            autoPlay
          >
            Your browser does not support the video tag.
          </video>
        );
      case "pdf":
        return (
          <div className="flex flex-col items-center">
            <iframe
              src={file}
              className="w-full max-w-4xl h-[70vh]"
              title={`Document ${currentIndex + 1}`}
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: "top left",
              }}
            />
            <div className="flex gap-2 mt-4">
              {files.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
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
                    onClick={handleNext}
                    className={`px-2 py-1 text-sm rounded-md flex items-center gap-1 ${
                      isDarkMode
                        ? "bg-pink-600 hover:bg-pink-700"
                        : "bg-pink-500 hover:bg-pink-600"
                    } text-white`}
                    aria-label="Next document"
                  >
                    Next <FaArrowRight />
                  </button>
                </>
              )}
              <button
                onClick={handleZoomIn}
                className={`px-2 py-1 text-sm rounded-md ${
                  isDarkMode
                    ? "bg-gray-600 hover:bg-gray-500"
                    : "bg-gray-300 hover:bg-gray-400"
                } text-white`}
                aria-label="Zoom in"
              >
                <FaSearchPlus />
              </button>
              <button
                onClick={handleZoomOut}
                className={`px-2 py-1 text-sm rounded-md ${
                  isDarkMode
                    ? "bg-gray-600 hover:bg-gray-500"
                    : "bg-gray-300 hover:bg-gray-400"
                } text-white`}
                aria-label="Zoom out"
              >
                <FaSearchMinus />
              </button>
              <a
                href={file}
                download
                className={`px-2 py-1 text-sm rounded-md flex items-center gap-1 ${
                  isDarkMode
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-blue-500 hover:bg-blue-600"
                } text-white`}
                aria-label="Download document"
              >
                <FaDownload /> Download
              </a>
            </div>
          </div>
        );
      default:
        return <p className="text-red-500">Unsupported file type</p>;
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 ${
        isOpen ? "block" : "hidden"
      }`}
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className={`relative max-w-5xl w-full p-6 rounded-lg ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className={`absolute top-2 right-2 p-2 rounded-full ${
            isDarkMode
              ? "bg-pink-600 hover:bg-pink-700"
              : "bg-pink-500 hover:bg-pink-600"
          } text-white`}
          aria-label="Close modal"
        >
          <FaTimes />
        </button>
        {renderContent()}
      </div>
    </div>
  );
};

export default MediaModal;