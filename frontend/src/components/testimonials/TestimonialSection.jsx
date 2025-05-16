import React, { useState, useEffect, useContext } from "react";
import testimonialImage from "../../assets/images/test.jpg";
import platformLogo from "../../assets/images/logo.png";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { ThemeContext } from "../../context/ThemeContext";


const testimonials = [
  {
    id: 1,
    name: "Yohanes Belay",
    role: "Beneficiary",
    photo: testimonialImage,
    content:
      "This platform changed my life! I'm truly grateful for the help I received.",
  },
  {
    id: 2,
    name: "Almaz Sisay",
    role: "Beneficiary",
    photo: testimonialImage,
    content:
      "Tsedey Aid made it possible for me to receive the support I needed. Thank you!",
  },
  {
    id: 3,
    name: "Mohamed Hassen",
    role: "Donor",
    photo: testimonialImage,
    content:
      "A great initiative that connects people who need help with kind-hearted donors.",
  },
  {
    id: 4,
    name: "Another User",
    role: "Beneficiary",
    photo: testimonialImage,
    content:
      "This platform is amazing! It helped me in ways I never imagined.",
  },
];

const TestimonialSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { isDarkMode } = useContext(ThemeContext); // Use theme context

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    const interval = setInterval(nextTestimonial, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`text-center py-16 min-h-screen flex flex-col items-center justify-center ${
      isDarkMode ? "bg-gray-800" : "bg-white"
    }`}>
      <h2 className={`text-4xl font-bold mb-8 font-['Poppins'] ${
        isDarkMode ? "text-pink-400" : "text-pink-600"
      }`}>
        What People Say About Us
      </h2>
      <p className={`text-lg mt-3 max-w-2xl font-bold font-['Poppins'] ${
        isDarkMode ? "text-gray-200" : "text-gray-600"
      }`}>
        Hear stories from people whose lives have been changed by Tsedey Aid.
      </p>
      <p className={`text-base mt-3 max-w-2xl leading-relaxed px-4 sm:px-0 font-['Poppins'] ${
        isDarkMode ? "text-gray-300" : "text-slate-500"
      }`}>
        These are just a few of the many users of the platform who have shared
        their genuine feedback and heartfelt appreciation for the positive
        impact it has had on their lives.
      </p>

      <div className="relative w-full max-w-6xl mt-10 flex items-center justify-center h-[500px] overflow-visible">
        {testimonials.map((testimonial, index) => {
          const position =
            (index - currentIndex + testimonials.length) % testimonials.length;

          return (
            <div
              key={testimonial.id}
              className={`absolute flex flex-col items-center text-center p-8 rounded-lg shadow-lg transition-all duration-500 ${
                isDarkMode ? "bg-gray-700" : "bg-white"
              } ${
                position === 0
                  ? "left-1/2 transform -translate-x-1/2 scale-100 opacity-100 z-10"
                  : position === 1
                  ? "left-3/4 transform -translate-x-1/2 scale-90 opacity-50 blur-sm z-0"
                  : "left-1/4 transform -translate-x-1/2 scale-90 opacity-50 blur-sm z-0"
              }`}
              style={{
                width: "clamp(300px, 30%, 400px)",
              }}
            >
              <div className={`absolute -top-8 left-1/2 transform -translate-x-1/2 w-18 h-18 rounded-full flex items-center justify-center shadow-lg ${
                isDarkMode ? "bg-gray-700" : "bg-white"
              }`}>
                <img
                  src={platformLogo}
                  alt="Platform Logo"
                  className="w-12 h-12"
                />
              </div>

              <img
                src={testimonial.photo}
                alt={testimonial.name}
                className="w-40 h-40 object-cover rounded-full mt-8"
              />
              <h4 className={`mt-6 font-bold text-xl font-[Poppins] ${
                isDarkMode ? "text-pink-300" : "text-pink-500"
              }`}>
                {testimonial.name}
              </h4>
              <p className={`text-lg font-[Poppins] ${
                isDarkMode ? "text-gray-300" : "text-gray-500"
              }`}>
                {testimonial.role}
              </p>
              <p className={`mt-4 italic text-xl font-[Poppins] ${
                isDarkMode ? "text-gray-200" : "text-gray-800"
              }`}>
                "{testimonial.content}"
              </p>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center space-x-4 mt-6">
        <button
          onClick={prevTestimonial}
          aria-label="Previous testimonial"
          className={`px-4 py-2 rounded-md transition ${
            isDarkMode ? "bg-pink-600 hover:bg-pink-700" : "bg-pink-500 hover:bg-pink-600"
          } text-white`}
        >
          <FaChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextTestimonial}
          aria-label="Next testimonial"
          className={`px-4 py-2 rounded-md transition ${
            isDarkMode ? "bg-pink-600 hover:bg-pink-700" : "bg-pink-500 hover:bg-pink-600"
          } text-white`}
        >
          <FaChevronRight className="w-6 h-6" />
        </button>
      </div>

      <div className="flex justify-center mt-6 space-x-2">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to testimonial ${index + 1}`}
            className={`h-3 w-3 rounded-full focus:outline-none ${
              index === currentIndex ? "bg-pink-500" : isDarkMode ? "bg-gray-500" : "bg-gray-300"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default TestimonialSection;
