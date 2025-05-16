// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import DonorsImg from "../../assets/DonateAssets/group.png";
import DollarImg from "../../assets/DonateAssets/dollar-symbol.png";
import { FaBullhorn } from "react-icons/fa";
import { ThemeContext } from "../../context/ThemeContext"; // Import ThemeContext
import { useContext } from "react"; // Import useContext

const DonateStatus = () => {
  const { isDarkMode } = useContext(ThemeContext); // Use theme context

  return (
    <div className={`pt-12 pb-20 mt-6 mb-8 text-center ${
      isDarkMode ? "bg-gray-800" : "bg-white"
    }`}>
      <h2 className={`text-3xl md:text-5xl font-bold font-oswald flex items-center justify-center ${
        isDarkMode ? "text-pink-400" : "text-pink-500"
      }`}>
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: false }}
        >
          <FaBullhorn className="text-3xl md:text-5xl mr-4" />
        </motion.div>
        This Week's Donations
      </h2>

      <div className="flex flex-col md:flex-row justify-around items-center mt-6">
        {/* Donors Section */}
        <motion.div
          className="text-center mb-6 md:mb-0"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: false }}
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: false }}
          >
            <img src={DonorsImg} alt="Donors" className="w-24 md:w-36 mx-auto mb-2" />
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: false }}
            className={`text-2xl md:text-3xl font-bold ${
              isDarkMode ? "text-blue-400" : "text-blue-700"
            }`}
          >
            Donors
          </motion.p>
          <motion.p
            initial={{ y: 20 }}
            whileInView={{ y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: false }}
            className={`text-xl md:text-2xl font-semibold ${
              isDarkMode ? "text-blue-300" : "text-blue-700"
            }`}
          >
            100+
          </motion.p>
        </motion.div>

        {/* Amount Raised Section */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: false }}
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: false }}
          >
            <img src={DollarImg} alt="Amount Raised" className="w-24 md:w-36 mx-auto mb-2" />
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: false }}
            className={`text-2xl md:text-3xl font-bold ${
              isDarkMode ? "text-green-400" : "text-green-600"
            }`}
          >
            Amount Raised
          </motion.p>
          <motion.p
            initial={{ y: 20 }}
            whileInView={{ y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: false }}
            className={`text-xl md:text-2xl font-semibold ${
              isDarkMode ? "text-green-300" : "text-green-700"
            }`}
          >
            $10,000
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default DonateStatus;
