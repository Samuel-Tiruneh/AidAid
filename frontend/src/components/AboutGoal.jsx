import { FaThumbtack, FaBullseye } from "react-icons/fa";
import missionBg from "../assets/images/mission2.webp"; // Ensure the path is correct
import goalBg from "../assets/images/goal1.webp"; // Add the new goal background image
import { ThemeContext } from "../context/ThemeContext";
import { useContext } from "react"; // Import useContext
import AboutStats from "./AboutStats";

const AboutGoal = () => {
  const { isDarkMode } = useContext(ThemeContext); // Use theme context

  return (
   <>
    <div id="about" className={`container mx-auto px-6 py-20 ${
      isDarkMode ? "bg-gray-900" : "bg-white"
    }`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Mission Section with Pink Shadow */}
        <div
          className="relative flex flex-col items-center p-8 rounded-2xl shadow-2xl border-4 hover:shadow-[0_15px_35px_rgba(236,72,153,0.6)] transition-all duration-500 transform hover:scale-105 overflow-hidden group"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 50, 0.9), rgba(0, 50, 100, 0.85)), url(${missionBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundBlendMode: "overlay",
            borderColor: isDarkMode ? "rgba(255, 255, 255, 0.4)" : "rgba(0, 0, 0, 0.4)",
          }}
        >
          {/* Glowing Overlay */}
          <div className="absolute inset-0 bg-pink-900/20 rounded-2xl blur-md group-hover:blur-lg transition-all duration-500"></div>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="bg-pink-500 text-white p-5 rounded-full mb-4 shadow-xl  transition-colors duration-300">
              <FaThumbtack size={30} className="hover:scale-125 transition-transform duration-300" />
            </div>
            <h2 className="text-4xl font-extrabold mb-4 text-white">
              Our Mission
            </h2>
            <p className="text-lg text-center leading-relaxed font-['Poppins'] tracking-wide text-white">
              We empower communities through donations, fostering a culture of
              compassion and support for those in need. Our mission is to bridge
              the gap between donors and recipients, ensuring that every
              contribution makes a meaningful impact.
            </p>
          </div>
        </div>

        {/* Goals Section with Pink Shadow */}
        <div
          className="relative flex flex-col items-center p-8 rounded-2xl shadow-2xl border-4 hover:shadow-[0_15px_35px_rgba(236,72,153,0.6)] transition-all duration-500 transform hover:scale-105 overflow-hidden group"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 50, 0.9), rgba(50, 100, 50, 0.85)), url(${goalBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundBlendMode: "overlay",
            borderColor: isDarkMode ? "rgba(255, 255, 255, 0.4)" : "rgba(0, 0, 0, 0.4)",
          }}
        >
          {/* Glowing Overlay */}
          <div className="absolute inset-0 bg-pink-900/20 rounded-2xl blur-md group-hover:blur-lg transition-all duration-500"></div>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="bg-pink-500 text-white p-5 rounded-full mb-4 shadow-xl transition-colors duration-300">
              <FaBullseye size={30} className="hover:scale-125 transition-transform duration-300" />
            </div>
            <h2 className="text-4xl font-extrabold mb-4 text-white">
              Our Goals
            </h2>
            <p className="text-lg text-center leading-relaxed font-['Poppins'] tracking-wide text-white">
              We strive to unite communities through donations, creating a lasting
              impact on the lives of those we serve. Our goal is to build strong
              relationships with our partners and donors, ensuring that our
              efforts are sustainable and effective.
            </p>
          </div>
        </div>
      </div>
    </div>
     <AboutStats />
    </>
  );
};

export default AboutGoal;
