import React, { useContext, useState, useEffect } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import axios from "axios";
import ReactPlayer from "react-player";
import { FaPlay, FaArrowLeft, FaSpinner } from "react-icons/fa";
import supportGuideImg from "../../assets/SupportAssets/manual.png";

const SupportGuide = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/guides");
        setGuides(response.data.data);
      } catch (err) {
        setError(err.message);
        setGuides([
          {
            _id: "1",
            title: "How to Register an Account",
            description:
              "Learn how to create an account and get started on our platform.",
            videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            thumbnailUrl:
              "https://via.placeholder.com/300x169?text=Guide+Thumbnail",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchGuides();
  }, []);

  const handleWatchClick = (guide) => {
    setSelectedGuide(guide);
    setVideoReady(false);
  };

  if (loading) {
    return (
      <div
        className={`p-6 mt-4 md:mr-8 rounded-2xl shadow-lg ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className="flex justify-center items-center h-64">
          <FaSpinner className="animate-spin text-4xl text-pink-500" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`p-6 mt-4 md:mr-8 rounded-2xl shadow-lg ${
        isDarkMode ? "bg-gray-800" : "bg-white"
      }`}
    >
      <div className="flex flex-col md:flex-row items-center gap-3 justify-center">
        <img
          src={supportGuideImg}
          alt="contact support"
          className="w-10 md:w-12 h-auto max-w-full"
        />
        <h2
          className={`text-xl sm:text-2xl font-bold mt-4 sm:mt-0 ${
            isDarkMode ? "text-pink-400" : "text-pink-600"
          }`}
        >
          Guides and Tutorials
        </h2>
      </div>

      {error && (
        <div
          className={`mt-4 p-3 rounded-lg ${
            isDarkMode ? "bg-red-900 text-red-100" : "bg-red-100 text-red-800"
          }`}
        >
          Error loading guides: {error}. Showing default guides instead.
        </div>
      )}

      {selectedGuide ? (
        <div className="mt-6 max-w-3xl mx-auto">
          <div
            className={`p-3 rounded-lg ${
              isDarkMode ? "bg-gray-700" : "bg-white"
            }`}
          >
            <button
              onClick={() => setSelectedGuide(null)}
              className={`mb-4 px-3 py-2 rounded-md flex items-center gap-2 ${
                isDarkMode
                  ? "bg-gray-600 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              <FaArrowLeft /> Back to Guides
            </button>

            <h3
              className={`text-lg font-semibold ${
                isDarkMode ? "text-gray-200" : "text-gray-800"
              }`}
            >
              {selectedGuide.title}
            </h3>

            <div className="mt-3 h-56 bg-black rounded-lg overflow-hidden">
              {!videoReady && (
                <div className="w-full h-full flex items-center justify-center">
                  <FaSpinner className="animate-spin text-3xl text-white" />
                </div>
              )}
              <ReactPlayer
                url={selectedGuide.videoUrl}
                width="100%"
                height="100%"
                controls
                onReady={() => setVideoReady(true)}
                style={{ display: videoReady ? "block" : "none" }}
              />
            </div>

            <p
              className={`mt-3 text-sm ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {selectedGuide.description}
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-6 max-w-5xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {guides.map((guide) => (
            <div
              key={guide._id}
              className={`p-2 rounded-lg shadow-md transition-transform duration-300 hover:scale-105 ${
                isDarkMode ? "bg-gray-700" : "bg-white"
              }`}
            >
              <div className="relative h-40 mb-3 rounded-md overflow-hidden">
                {guide.thumbnailUrl ? (
                  <img
                    src={guide.thumbnailUrl}
                    alt={guide.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className={`w-full h-full flex items-center justify-center ${
                      isDarkMode ? "bg-gray-600" : "bg-gray-200"
                    }`}
                  >
                    <FaPlay className="text-3xl text-pink-500" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                  <button
                    onClick={() => handleWatchClick(guide)}
                    className="bg-pink-500 hover:bg-pink-600 text-white rounded-full p-3 transition-all duration-300"
                  >
                    <FaPlay className="text-lg" />
                  </button>
                </div>
              </div>

              <h3
                className={`text-base font-semibold ${
                  isDarkMode ? "text-gray-200" : "text-gray-800"
                }`}
              >
                {guide.title}
              </h3>

              <p
                className={`mt-1 text-sm ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {guide.description}
              </p>

              <button
                onClick={() => handleWatchClick(guide)}
                className={`mt-3 px-3 py-1.5 rounded-md text-sm flex items-center gap-2 transition-colors duration-300 ${
                  isDarkMode
                    ? "bg-pink-600 hover:bg-pink-500 text-white"
                    : "bg-pink-500 hover:bg-pink-600 text-white"
                }`}
              >
                <FaPlay /> Watch Tutorial
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SupportGuide;
