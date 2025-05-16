import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { ThemeContext } from "../context/ThemeContext";

const Partners = () => {
  const { isDarkMode } = useContext(ThemeContext);

  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/partners");

        if (Array.isArray(response.data)) {
          setPartners(response.data);
        } else if (response.data.data && Array.isArray(response.data.data)) {
          setPartners(response.data.data);
        } else {
          throw new Error("Invalid data format received from API");
        }
      } catch (err) {
        console.error("Error fetching partners:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading partners...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  return (
    <section className={`py-12 ${isDarkMode ? "bg-gray-900" : "bg-white"}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2
            className={`text-3xl font-bold mb-2 ${
              isDarkMode ? "text-gray-200" : "text-gray-800"
            }`}
          >
            Our Trusted Partners
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We collaborate with industry leaders to deliver exceptional
            solutions
          </p>
        </div>

        <div className="relative overflow-hidden py-6">
          <div className="flex animate-slide-right-to-left">
            {Array.isArray(partners) &&
              partners.concat(partners).map((partner, index) => (
                <div
                  key={`${partner._id}-${index}`}
                  className="flex-shrink-0 mx-4"
                  style={{ minWidth: "180px" }}
                >
                  <a
                    href={partner.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center group"
                  >
                    {/* Logo Container */}
                    <div
                      className={`${
                        isDarkMode ? "bg-gray-800" : "bg-white"
                      } rounded-xl shadow-md p-6 h-32 w-32 flex items-center justify-center transition-all duration-300 hover:shadow-lg hover:scale-105 hover:border-2 hover:border-primary-500`}
                    >
                      {partner.logoUrl ? (
                        <img
                          src={partner.logoUrl}
                          alt={partner.organization}
                          className="max-h-16 max-w-24 object-contain transition duration-300 group-hover:opacity-90"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://via.placeholder.com/96x48?text=Logo+Missing";
                          }}
                        />
                      ) : (
                        <div
                          className={`w-full h-full flex items-center justify-center rounded-lg ${
                            isDarkMode ? "bg-gray-700" : "bg-gray-100"
                          } text-gray-400 font-medium`}
                        >
                          {partner.organization?.substring(0, 2) || "NA"}
                        </div>
                      )}
                    </div>

                    {/* Organization Name */}
                    <div className="mt-3 text-center">
                      <p
                        className={`text-sm font-medium ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        } line-clamp-1 hover:text-primary-500 transition-colors`}
                      >
                        {partner.organization || "Partner Name"}
                      </p>
                    </div>
                  </a>
                </div>
              ))}
          </div>

          {/* Gradient overlays for better UX */}
          <div
            className={`absolute inset-y-0 left-0 w-24 bg-gradient-to-r ${
              isDarkMode ? "from-gray-900" : "from-gray-50"
            } to-transparent z-20 pointer-events-none`}
          />
          <div
            className={`absolute inset-y-0 right-0 w-24 bg-gradient-to-l ${
              isDarkMode ? "from-gray-900" : "from-gray-50"
            } to-transparent z-20 pointer-events-none`}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-right-to-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-slide-right-to-left {
          display: flex;
          animation: slide-right-to-left 30s linear infinite;
          width: max-content;
        }

        .animate-slide-right-to-left:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default Partners;
