import React, { useContext, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaHandHoldingHeart,
  FaUsers,
  FaHandshake,
  FaGift,
} from "react-icons/fa";
import axios from "axios";
import { ThemeContext } from "../context/ThemeContext";

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const AboutStats = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [stats, setStats] = useState({
    donations: 0,
    fulfilledRequests: 0,
    donors: 0,
    partners: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [donationsRes, donorsRes, partnersRes, fulfilledRes] =
          await Promise.all([
            axios
              .get("http://localhost:5000/api/donations/count")
              .catch(() => ({ data: { count: 0 } })),
            axios
              .get("http://localhost:5000/api/donations/donors/count")
              .catch(() => ({ data: { count: 0 } })),
            axios
              .get("http://localhost:5000/api/partners/count")
              .catch(() => ({ data: { count: 0 } })),
            axios
              .get("http://localhost:5000/api/request-donate/fulfilled/count")
              .catch(() => ({ data: { count: 0 } })),
          ]);

        console.log("Stats API responses:", {
          donations: donationsRes.data,
          donors: donorsRes.data,
          partners: partnersRes.data,
          fulfilledRequests: fulfilledRes.data,
        });

        const errors = [];
        if (!donationsRes.data.success && donationsRes.data.count === 0) {
          errors.push("Failed to fetch donations count");
        }
        if (!donorsRes.data.success && donorsRes.data.count === 0) {
          errors.push("Failed to fetch donors count");
        }
        if (!partnersRes.data.success && partnersRes.data.count === 0) {
          errors.push("Failed to fetch partners count");
        }
        if (!fulfilledRes.data.success && fulfilledRes.data.count === 0) {
          errors.push("Failed to fetch fulfilled requests count");
        }

        if (errors.length > 0) {
          setError(errors.join("; "));
        }

        setStats({
          donations: donationsRes.data.count || 0,
          donors: donorsRes.data.count || 0,
          partners: partnersRes.data.count || 0,
          fulfilledRequests: fulfilledRes.data.count || 0,
        });
        setLoading(false);
      } catch (err) {
        setError("Failed to load statistics: " + err.message);
        setLoading(false);
        console.error("Error fetching stats:", err);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div
        className={`py-10 w-full mx-auto px-4 sm:px-6 lg:px-8 flex justify-center items-center ${
          isDarkMode ? "bg-gray-900" : "bg-white"
        }`}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`py-10 w-full mx-auto px-4 sm:px-6 lg:px-8 text-center ${
          isDarkMode ? "bg-gray-900 text-red-400" : "bg-white text-red-600"
        }`}
      >
        {error}
      </div>
    );
  }

  return (
    <div
      id="about"
      className={`py-10 w-full mx-auto px-4 sm:px-6 lg:px-8 ${
        isDarkMode ? "bg-gray-900" : "bg-white"
      }`}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
        {/* Donations - Left */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className={`relative flex flex-col p-6 sm:p-8 rounded-xl shadow-lg overflow-hidden min-h-[250px] 
                    transition-all duration-500 border ${
                      isDarkMode ? "border-gray-700" : "border-gray-300"
                    } hover:shadow-2xl`}
          style={{
            background: `linear-gradient(90deg, ${
              isDarkMode ? "#1F2937" : "white"
            } 50%, ${isDarkMode ? "#374151" : "#FAD1E5"})`,
            backgroundSize: "200% 100%",
            backgroundPosition: "right",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundPosition = "left")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundPosition = "right")
          }
        >
          <div className="flex items-center space-x-4">
            <div className="bg-pink-500 text-white p-3 sm:p-4 rounded-full shadow-lg">
              <FaHandHoldingHeart className="text-lg sm:text-xl" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-pink-500">
              {stats.donations}+
            </h2>
          </div>
          <p
            className={`text-lg sm:text-xl font-semibold ${
              isDarkMode ? "text-gray-200" : "text-gray-800"
            } mt-2`}
          >
            Donations Received
          </p>
          <div className="w-12 border-b-4 border-pink-500 my-2" />
          <p
            className={`text-sm sm:text-lg ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            } leading-relaxed`}
          >
            Thanks to our generous donors, we've received {stats.donations}+
            donations, allowing us to provide food, medical aid, and education.
            Every contribution supports families in need, creating lasting
            change.
          </p>
        </motion.div>

        {/* Lives Impacted - Right */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className={`relative flex flex-col p-6 sm:p-8 rounded-xl shadow-lg overflow-hidden min-h-[250px] 
                    transition-all duration-500 border ${
                      isDarkMode ? "border-gray-700" : "border-gray-300"
                    } hover:shadow-2xl`}
          style={{
            background: `linear-gradient(90deg, ${
              isDarkMode ? "#1F2937" : "white"
            } 50%, ${isDarkMode ? "#374151" : "#FAD1E5"})`,
            backgroundSize: "200% 100%",
            backgroundPosition: "right",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundPosition = "left")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundPosition = "right")
          }
        >
          <div className="flex items-center space-x-4">
            <div className="bg-pink-500 text-white p-3 sm:p-4 rounded-full shadow-lg">
              <FaUsers className="text-lg sm:text-xl" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-pink-500">
              {stats.fulfilledRequests}+
            </h2>
          </div>
          <p
            className={`text-lg sm:text-xl font-semibold ${
              isDarkMode ? "text-gray-200" : "text-gray-800"
            } mt-2`}
          >
            Lives Impacted
          </p>
          <div className="w-12 border-b-4 border-pink-500 my-2" />
          <p
            className={`text-sm sm:text-lg ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            } leading-relaxed`}
          >
            We've made a direct impact on {stats.fulfilledRequests}+ people by
            providing shelter, food, and healthcare. With every donation, we
            reach more communities, ensuring that no one is left behind.
          </p>
        </motion.div>

        {/* Trusted Partners - Left */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className={`relative flex flex-col p-6 sm:p-8 rounded-xl shadow-lg overflow-hidden min-h-[250px] 
                    transition-all duration-500 border ${
                      isDarkMode ? "border-gray-700" : "border-gray-300"
                    } hover:shadow-2xl`}
          style={{
            background: `linear-gradient(90deg, ${
              isDarkMode ? "#1F2937" : "white"
            } 50%, ${isDarkMode ? "#374151" : "#FAD1E5"})`,
            backgroundSize: "200% 100%",
            backgroundPosition: "right",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundPosition = "left")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundPosition = "right")
          }
        >
          <div className="flex items-center space-x-4">
            <div className="bg-pink-500 text-white p-3 sm:p-4 rounded-full shadow-lg">
              <FaHandshake className="text-lg sm:text-xl" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-pink-500">
              {stats.partners}+
            </h2>
          </div>
          <p
            className={`text-lg sm:text-xl font-semibold ${
              isDarkMode ? "text-gray-200" : "text-gray-800"
            } mt-2`}
          >
            Trusted Partners
          </p>
          <div className="w-12 border-b-4 border-pink-500 my-2" />
          <p
            className={`text-sm sm:text-lg ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            } leading-relaxed`}
          >
            We collaborate with {stats.partners}+ international organizations,
            ensuring transparency and efficiency. Our partnerships amplify our
            reach, allowing us to provide sustainable and scalable support.
          </p>
        </motion.div>

        {/* Active Donors - Right */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className={`relative flex flex-col p-6 sm:p-8 rounded-xl shadow-lg overflow-hidden min-h-[250px] 
                    transition-all duration-500 border ${
                      isDarkMode ? "border-gray-700" : "border-gray-300"
                    } hover:shadow-2xl`}
          style={{
            background: `linear-gradient(90deg, ${
              isDarkMode ? "#1F2937" : "white"
            } 50%, ${isDarkMode ? "#374151" : "#FAD1E5"})`,
            backgroundSize: "200% 100%",
            backgroundPosition: "right",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundPosition = "left")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundPosition = "right")
          }
        >
          <div className="flex items-center space-x-4">
            <div className="bg-pink-500 text-white p-3 sm:p-4 rounded-full shadow-lg">
              <FaGift className="text-lg sm:text-xl" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-pink-500">
              {stats.donors}+
            </h2>
          </div>
          <p
            className={`text-lg sm:text-xl font-semibold ${
              isDarkMode ? "text-gray-200" : "text-gray-800"
            } mt-2`}
          >
            Active Donors
          </p>
          <div className="w-12 border-b-4 border-pink-500 my-2" />
          <p
            className={`text-sm sm:text-lg ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            } leading-relaxed`}
          >
            Our {stats.donors}+ dedicated donors help us sustain and expand our
            initiatives. Their generosity fuels our mission, ensuring that aid
            reaches those who need it most, every single day.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutStats;
