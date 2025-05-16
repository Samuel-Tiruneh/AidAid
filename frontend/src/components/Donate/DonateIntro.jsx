import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import helpImage from "../../assets/DonateAssets/help.png";
import DonateStatus from "./DonateStatus";
import { useState, useEffect, useRef, useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext"; // Import ThemeContext

const DonateIntro = () => {
  const [animateText, setAnimateText] = useState(false);
  const [animateImage, setAnimateImage] = useState(false);
  const { isDarkMode } = useContext(ThemeContext); // Use theme context

  const textRef = useRef(null);
  const imageRef = useRef(null);

  const isTextInView = useInView(textRef, { once: false });
  const isImageInView = useInView(imageRef, { once: false });

  useEffect(() => {
    if (isTextInView) {
      setAnimateText(true);
    } else {
      setAnimateText(false);
    }
  }, [isTextInView]);

  useEffect(() => {
    if (isImageInView) {
      setAnimateImage(true);
    } else {
      setAnimateImage(false);
    }
  }, [isImageInView]);

  return (
    <div className={`shadow-lg rounded-lg ${
      isDarkMode ? "bg-gray-800 shadow-gray-900/50" : "bg-white shadow-gray-400/50"
    }`}>
      <div className="p-8 pb-24 flex flex-col md:flex-row justify-around items-center">
        {/* Text Section */}
        <motion.div
          ref={textRef}
          className="max-w-xl text-left"
          initial={{ x: -200, opacity: 0 }}
          animate={animateText ? { x: 0, opacity: 1 } : { x: -200, opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className={`text-3xl md:text-4xl font-bold ${
            isDarkMode ? "text-pink-400" : "text-pink-500"
          }`}>
            People in Need of Your Help
          </h1>

          <p className={`font-['Poppins'] tracking-wider rounded-lg text-base md:text-2xl mt-4 relative before:bg-pink-500 before:w-[4px] before:h-full before:absolute before:left-0 before:top-0 before:rounded-l-lg before:mr-2 pl-4 pr-4 pt-8 pb-8 ${
            isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-slate-500"
          }`}>
            We believe in the power of community and compassion. Each
            contribution, no matter the size, makes a significant impact. Browse
            through the stories of those in need and extend a helping hand
            today. Together, we can make a difference.
          </p>
        </motion.div>

        {/* Image Section */}
        <motion.div
          ref={imageRef}
          className="w-full md:w-80 md:w-96 mt-4 md:mt-0"
          initial={{ x: 200, opacity: 0 }}
          animate={animateImage ? { x: 0, opacity: 1 } : { x: 200, opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <img src={helpImage} alt="Help" className="w-full h-auto" />
        </motion.div>
      </div>

      {/* Divider */}
      <div className={`border-b-4 mx-8 ${
        isDarkMode ? "border-gray-600" : "border-gray-300"
      }`}></div>

      {/* Donate Status Section */}
      <DonateStatus />
    </div>
  );
};

export default DonateIntro;
