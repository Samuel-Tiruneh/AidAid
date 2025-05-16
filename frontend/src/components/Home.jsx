import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaHandshake, FaHandHoldingHeart } from "react-icons/fa";
import { ThemeContext } from "../context/ThemeContext";
import Button from "./Button";
import Header from "./Header";
import Footer from "./Footer";
import Partners from "./Partners";
import AboutStats from "./AboutStats";
import AboutGoal from "./AboutGoal";
import Image from "../assets/images/donation_image2.jpg";
import TestimonialSection from '../components/testimonials/TestimonialSection';

const Home = () => {
  const { isDarkMode } = useContext(ThemeContext); // Get theme state

  return (
    <>
     

      {/* Hero Section */}
      <main className={`min-h-screen font-[poppins] ${isDarkMode ? "bg-gray-900" : "bg-white"}`}>
        <section className="container mx-auto px-4 sm:px-6 py-16 sm:py-20 flex flex-col lg:flex-row items-center gap-6 sm:gap-12">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2 text-center lg:text-left space-y-4 sm:space-y-6"
          >
            <h1 className={`text-4xl sm:text-6xl md:text-7xl font-extrabold drop-shadow-lg ${
              isDarkMode ? "text-pink-400" : "text-pink-600"
            }`}>
              Tsedey Aid
            </h1>
            <p className={`text-base sm:text-lg md:text-2xl leading-relaxed font-medium ${
              isDarkMode ? "text-gray-200" : "text-gray-800"
            }`}>
              <span className={`${isDarkMode ? "text-pink-300" : "text-pink-500"} font-bold`}>
                Empowering Change, One Donation at a Time.
              </span>
              <br />
              Together, we can uplift communities, provide relief, and create lasting change for those in need.
            </p>

            {/* Action Buttons (unchanged) */}
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start mt-6 space-y-4 sm:space-y-0 sm:space-x-6">
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link to="/join">
                  <Button
                    aria-label="Join Our Mission"
                    className="px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg bg-gradient-to-r from-pink-600 to-pink-700 hover:bg-pink text-white rounded-full shadow-lg hover:shadow-xl transition-all font-semibold"
                  >
                    <span className="flex items-center gap-x-2 sm:gap-x-3">
                      <FaHandshake className="text-white w-5 sm:w-6 h-5 sm:h-6" />
                      Join Us
                    </span>
                  </Button>
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }}>
                <Link to="/donate-page">
                  <Button
                    aria-label="Make a Donation"
                    className="px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg bg-gradient-to-r from-yellow-500 to-yellow-600 hover:bg-yellow text-white rounded-full shadow-lg hover:shadow-xl transition-all font-semibold"
                  >
                    <span className="flex items-center gap-x-2 sm:gap-x-3">
                      <FaHandHoldingHeart className="text-white w-5 sm:w-6 h-5 sm:h-6" />
                      Donate 
                    </span>
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>





          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="lg:w-1/2 relative"
          >
            <div className={`absolute inset-0 bg-gradient-to-r rounded-xl blur-xl opacity-30 -z-10 ${
              isDarkMode ? "from-pink-700 to-yellow-700" : "from-pink-400 to-yellow-400"
            }`}></div>
            <img
              src={Image}
              alt="People receiving aid"
              className="w-full max-w-md md:max-w-lg lg:max-w-xl h-auto object-cover rounded-xl shadow-lg transition-all duration-300"
              loading="lazy"
            />
          </motion.div>
        </section>

        {/* Mission Statement */}
        <section className="container mx-auto px-4 sm:px-6 py-16 sm:py-20 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-12">
          {/* Left Box */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className={`bg-gradient-to-br p-6 sm:p-8 border-t-4 sm:border-t-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 ${
              isDarkMode 
                ? "from-gray-800 to-gray-700 border-pink-400" 
                : "from-pink-100 to-pink-50 border-pink-500"
            }`}
          >
            <p className={`text-base sm:text-lg md:text-xl leading-relaxed italic font-medium ${
              isDarkMode ? "text-gray-200" : "text-gray-700"
            }`}>
              “No act of kindness is too small. Every donation, every helping hand, and every voice raised in support brings hope to those in need.”
              <p className={`text-sm sm:text-base mt-4 ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}>— Mother Teresa</p>
            </p>
          </motion.div>

          {/* Right Box */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className={`bg-gradient-to-br p-6 sm:p-8 rounded-lg shadow-md hover:shadow-lg transition duration-300 border-t-4 sm:border-t-6 ${
              isDarkMode 
                ? "from-gray-800 to-gray-700 border-pink-400" 
                : "from-pink-100 to-pink-50 border-pink-500"
            }`}
          >
            <p className={`text-base sm:text-lg md:text-xl leading-relaxed italic font-medium ${
              isDarkMode ? "text-gray-200" : "text-gray-800"
            }`}>
              "By donating, you are giving hope, opportunity, and a chance for a better life. Join us in making a difference and creating a brighter future for all."
              <p className={`text-sm sm:text-base mt-4 ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}>— Anonymous</p>
            </p>
          </motion.div>
        </section>

        {/* Partners Section */}
        <Partners />

        {/* Stats & Goals */}
        <AboutGoal />
       
        <TestimonialSection />
      </main>

      
    </>
  );
};

export default Home;
