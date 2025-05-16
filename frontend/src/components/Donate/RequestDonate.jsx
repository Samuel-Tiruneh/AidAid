// import React, { useState, useContext } from "react";
// import { ThemeContext } from "../../context/ThemeContext";
// import {
//   FaInfoCircle,
//   FaMoneyCheck,
//   FaFileImage,
//   FaFileAlt,
//   FaVideo,
//   FaMapMarkerAlt,
//   FaBook,
//   FaCalendarAlt,
//   FaMoneyBillWave,
// } from "react-icons/fa";

// const RequestDonate = () => {
//   const { isDarkMode } = useContext(ThemeContext);

//   const [formData, setFormData] = useState({
//     fullName: "",
//     phoneNumber: "",
//     gender: "",
//     age: "",
//     photo: null,
//     document: null,
//     video: null,
//     paymentMethod: "",
//     accountNumber: "",
//     caseDescription: "",
//     bank: "",
//     description: "",
//     location: "",
//     category: "",
//     neededAmount: "",
//     durationDays: 30,
//     story: "",
//     additionalPhotos: [],
//     additionalDocuments: [],
//   });

//   const [errors, setErrors] = useState({});
//   const [focusedField, setFocusedField] = useState("");

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleFileChange = (e) => {
//     const { name, files } = e.target;
//     if (name === "additionalPhotos" || name === "additionalDocuments") {
//       setFormData({ ...formData, [name]: Array.from(files) });
//     } else {
//       setFormData({ ...formData, [name]: files[0] });
//     }
//   };

//   const validateForm = () => {
//     const errors = {};

//     if (!formData.fullName.trim()) errors.fullName = "Full name is required.";
//     if (!formData.phoneNumber.trim())
//       errors.phoneNumber = "Phone number is required.";
//     if (!formData.gender) errors.gender = "Gender is required.";
//     if (!formData.age) errors.age = "Age is required.";
//     if (!formData.photo) errors.photo = "A photo is required.";
//     if (!formData.document) errors.document = "A document is required.";
//     if (!formData.paymentMethod)
//       errors.paymentMethod = "Payment method is required.";
//     if (!formData.accountNumber.trim())
//       errors.accountNumber = "Account number is required.";
//     if (!formData.bank.trim()) errors.bank = "Bank name is required.";

//     if (!formData.caseDescription.trim())
//       errors.caseDescription = "Case description is required.";

//     if (!formData.location.trim()) errors.location = "Location is required.";
//     if (!formData.category.trim()) errors.category = "Category is required.";
//     if (!formData.neededAmount)
//       errors.neededAmount = "Needed amount is required.";
//     if (!formData.story.trim()) errors.story = "Story is required.";

//     // Optionally validate additional files
//     if (formData.additionalPhotos && formData.additionalPhotos.length > 5) {
//       errors.additionalPhotos = "You can upload up to 5 additional photos.";
//     }

//     if (
//       formData.additionalDocuments &&
//       formData.additionalDocuments.length > 5
//     ) {
//       errors.additionalDocuments =
//         "You can upload up to 5 additional documents.";
//     }
//     // Log errors to see which fields are invalid
//     console.log(errors);

//     // Show errors (optional)
//     setErrors(errors);

//     // ✅ Only return true if no errors
//     return Object.keys(errors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     console.log("Submit clicked");
//     console.log("🔍 Running validation...");

//     if (validateForm()) {
//       console.log("✅ Form is valid. Proceeding to submit...");
//       const form = new FormData();

//       // Append all simple fields
//       Object.keys(formData).forEach((key) => {
//         if (
//           key !== "photo" &&
//           key !== "document" &&
//           key !== "video" &&
//           key !== "additionalPhotos" &&
//           key !== "additionalDocuments"
//         ) {
//           form.append(key, formData[key]);
//         }
//       });

//       // Append single files
//       if (formData.photo) form.append("photo", formData.photo);
//       if (formData.document) form.append("document", formData.document);
//       if (formData.video) form.append("video", formData.video);

//       // Append multiple files
//       if (formData.additionalPhotos) {
//         Array.from(formData.additionalPhotos).forEach((file, i) => {
//           form.append(`additionalPhotos`, file);
//         });
//       }

//       if (formData.additionalDocuments) {
//         Array.from(formData.additionalDocuments).forEach((file, i) => {
//           form.append(`additionalDocuments`, file);
//         });
//       }

//       try {
//         const token = localStorage.getItem("token");
//         const response = await fetch(
//           "http://localhost:5000/api/request-donate",
//           {
//             method: "POST",
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//             body: form,
//           }
//         );

//         const result = await response.json();
//         if (response.ok) {
//           alert("Request submitted successfully!");
//           // Optionally reset the form here
//           setFormData({
//             fullName: "",
//             phoneNumber: "",
//             gender: "",
//             age: "",
//             photo: null,
//             document: null,
//             video: null,
//             paymentMethod: "",
//             accountNumber: "",
//             caseDescription: "",
//             bank: "",

//             location: "",
//             category: "",
//             neededAmount: "",
//             durationDays: 30,
//             story: "",
//             additionalPhotos: [],
//             additionalDocuments: [],
//           });
//         } else {
//           alert("Submission failed: " + (result.error || "Unknown error"));
//         }
//       } catch (err) {
//         console.error("Error submitting form:", err);
//         alert("Something went wrong. Please try again.");
//       }
//     }
//   };

//   return (
//     <div
//       className={`flex justify-center items-center min-h-screen ${
//         isDarkMode ? "bg-gray-900" : "bg-gray-100"
//       }`}
//     >
//       <div
//         className={`max-w-2xl w-full p-6 mt-10 mb-10 rounded-lg shadow-md ${
//           isDarkMode ? "bg-gray-800" : "bg-white"
//         }`}
//       >
//         <h2
//           className={`text-4xl font-bold text-center ${
//             isDarkMode ? "text-pink-400" : "text-pink-500"
//           } font-[poppins] mb-4`}
//         >
//           Request for Aid
//         </h2>

//         <p
//           className={`text-center mb-6 text-lg ${
//             isDarkMode ? "text-gray-300" : "text-gray-600"
//           } font-[poppins]`}
//         >
//           Please ensure that all personal details and supporting documents are
//           accurate. Attach the necessary files (photo, documents, and videos) as
//           required for your aid request.
//           <br /> Fields marked with <span className="text-pink-500">*</span> are
//           required.
//         </p>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           {/* Personal Information Section */}
//           <div className="space-y-4">
//             <h3
//               className={`text-xl font-semibold ${
//                 isDarkMode ? "text-white" : "text-gray-700"
//               }`}
//             >
//               Personal Information
//             </h3>

//             {/* Full Name */}
//             <div className="flex items-center">
//               <span className="text-pink-500 mr-2">*</span>
//               <input
//                 type="text"
//                 name="fullName"
//                 placeholder="Full Name"
//                 className={`w-full p-4 text-lg font-[poppins] rounded-lg ${
//                   isDarkMode
//                     ? "bg-gray-700 text-white placeholder-gray-400"
//                     : "bg-gray-100 text-gray-700 placeholder-gray-500"
//                 } ${errors.fullName ? "border border-red-500" : "border-0"} ${
//                   focusedField === "fullName"
//                     ? "border-pink-500 outline-pink-500"
//                     : ""
//                 }`}
//                 value={formData.fullName}
//                 onChange={handleChange}
//                 onFocus={() => setFocusedField("fullName")}
//                 onBlur={() => setFocusedField("")}
//               />
//             </div>
//             {errors.fullName && (
//               <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
//             )}

//             {/* Phone Number */}
//             <div className="flex items-center">
//               <span className="text-pink-500 mr-2">*</span>
//               <input
//                 type="tel"
//                 name="phoneNumber"
//                 placeholder="Phone Number"
//                 className={`w-full p-4 text-lg font-[poppins] rounded-lg ${
//                   isDarkMode
//                     ? "bg-gray-700 text-white placeholder-gray-400"
//                     : "bg-gray-100 text-gray-700 placeholder-gray-500"
//                 } ${
//                   errors.phoneNumber ? "border border-red-500" : "border-0"
//                 } ${
//                   focusedField === "phoneNumber"
//                     ? "border-pink-500 outline-pink-500"
//                     : ""
//                 }`}
//                 value={formData.phoneNumber}
//                 onChange={handleChange}
//                 onFocus={() => setFocusedField("phoneNumber")}
//                 onBlur={() => setFocusedField("")}
//               />
//             </div>
//             {errors.phoneNumber && (
//               <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>
//             )}

//             {/* Gender & Age */}
//             <div className="flex space-x-4">
//               <div className="flex-1 flex items-center">
//                 <span className="text-pink-500 mr-2">*</span>
//                 <select
//                   name="gender"
//                   className={`w-full p-4 text-lg font-[poppins] rounded-lg ${
//                     isDarkMode
//                       ? "bg-gray-700 text-white"
//                       : "bg-gray-100 text-gray-700"
//                   } ${errors.gender ? "border border-red-500" : "border-0"}`}
//                   value={formData.gender}
//                   onChange={handleChange}
//                 >
//                   <option value="">Gender</option>
//                   <option value="Male">Male</option>
//                   <option value="Female">Female</option>
//                   <option value="Other">Other</option>
//                 </select>
//               </div>
//               <div className="flex-1 flex items-center">
//                 <span className="text-pink-500 mr-2">*</span>
//                 <input
//                   type="number"
//                   name="age"
//                   placeholder="Age"
//                   className={`w-full p-4 text-lg font-[poppins] rounded-lg ${
//                     isDarkMode
//                       ? "bg-gray-700 text-white placeholder-gray-400"
//                       : "bg-gray-100 text-gray-700 placeholder-gray-500"
//                   } ${errors.age ? "border border-red-500" : "border-0"} ${
//                     focusedField === "age"
//                       ? "border-pink-500 outline-pink-500"
//                       : ""
//                   }`}
//                   value={formData.age}
//                   onChange={handleChange}
//                   onFocus={() => setFocusedField("age")}
//                   onBlur={() => setFocusedField("")}
//                 />
//               </div>
//             </div>
//             {errors.age && (
//               <p className="text-red-500 text-xs mt-1">{errors.age}</p>
//             )}
//             {errors.gender && (
//               <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
//             )}

//             {/* Location */}
//             <div className="flex items-center">
//               <span className="text-pink-500 mr-2">*</span>
//               <div
//                 className={`relative flex items-center w-full ${
//                   isDarkMode ? "bg-gray-700" : "bg-gray-100"
//                 } rounded-lg`}
//               >
//                 <FaMapMarkerAlt
//                   className={`absolute left-4 text-lg ${
//                     isDarkMode ? "text-white" : "text-gray-700"
//                   }`}
//                 />
//                 <input
//                   type="text"
//                   name="location"
//                   placeholder="Location (City/Town)"
//                   className={`w-full p-4 pl-12 text-lg font-[poppins] rounded-lg ${
//                     isDarkMode
//                       ? "bg-gray-700 text-white placeholder-gray-400"
//                       : "bg-gray-100 text-gray-700 placeholder-gray-500"
//                   } ${errors.location ? "border border-red-500" : "border-0"}`}
//                   value={formData.location}
//                   onChange={handleChange}
//                 />
//               </div>
//             </div>
//             {errors.location && (
//               <p className="text-red-500 text-xs mt-1">{errors.location}</p>
//             )}
//           </div>

//           {/* Case Information Section */}
//           <div className="space-y-4">
//             <h3
//               className={`text-xl font-semibold ${
//                 isDarkMode ? "text-white" : "text-gray-700"
//               }`}
//             >
//               Case Information
//             </h3>

//             {/* Category */}
//             <div className="flex items-center">
//               <span className="text-pink-500 mr-2">*</span>
//               <div
//                 className={`relative flex items-center w-full ${
//                   isDarkMode ? "bg-gray-700" : "bg-gray-100"
//                 } rounded-lg`}
//               >
//                 <FaBook
//                   className={`absolute left-4 text-lg ${
//                     isDarkMode ? "text-white" : "text-gray-700"
//                   }`}
//                 />
//                 <select
//                   name="category"
//                   className={`w-full p-4 pl-12 text-lg font-[poppins] rounded-lg ${
//                     isDarkMode
//                       ? "bg-gray-700 text-white"
//                       : "bg-gray-100 text-gray-700"
//                   } ${errors.category ? "border border-red-500" : "border-0"}`}
//                   value={formData.category}
//                   onChange={handleChange}
//                 >
//                   <option value="">Select Category</option>
//                   <option value="Education">Education</option>
//                   <option value="Medical">Medical</option>
//                   <option value="Business">Business</option>
//                   <option value="Emergency">Emergency</option>
//                   <option value="Housing">Housing</option>
//                   <option value="Other">Other</option>
//                 </select>
//               </div>
//             </div>
//             {errors.category && (
//               <p className="text-red-500 text-xs mt-1">{errors.category}</p>
//             )}

//             {/* Needed Amount */}
//             <div className="flex items-center">
//               <span className="text-pink-500 mr-2">*</span>
//               <div
//                 className={`relative flex items-center w-full ${
//                   isDarkMode ? "bg-gray-700" : "bg-gray-100"
//                 } rounded-lg`}
//               >
//                 <FaMoneyBillWave
//                   className={`absolute left-4 text-lg ${
//                     isDarkMode ? "text-white" : "text-gray-700"
//                   }`}
//                 />
//                 <input
//                   type="number"
//                   name="neededAmount"
//                   placeholder="Amount Needed (ETB)"
//                   className={`w-full p-4 pl-12 text-lg font-[poppins] rounded-lg ${
//                     isDarkMode
//                       ? "bg-gray-700 text-white placeholder-gray-400"
//                       : "bg-gray-100 text-gray-700 placeholder-gray-500"
//                   } ${
//                     errors.neededAmount ? "border border-red-500" : "border-0"
//                   }`}
//                   value={formData.neededAmount}
//                   onChange={handleChange}
//                 />
//               </div>
//             </div>
//             {errors.neededAmount && (
//               <p className="text-red-500 text-xs mt-1">{errors.neededAmount}</p>
//             )}

//             {/* Campaign Duration */}
//             <div className="flex items-center">
//               <span className="text-pink-500 mr-2">*</span>
//               <div
//                 className={`relative flex items-center w-full ${
//                   isDarkMode ? "bg-gray-700" : "bg-gray-100"
//                 } rounded-lg`}
//               >
//                 <FaCalendarAlt
//                   className={`absolute left-4 text-lg ${
//                     isDarkMode ? "text-white" : "text-gray-700"
//                   }`}
//                 />
//                 <input
//                   type="number"
//                   name="durationDays"
//                   placeholder="Campaign Duration (Days)"
//                   className={`w-full p-4 pl-12 text-lg font-[poppins] rounded-lg ${
//                     isDarkMode
//                       ? "bg-gray-700 text-white placeholder-gray-400"
//                       : "bg-gray-100 text-gray-700 placeholder-gray-500"
//                   }`}
//                   value={formData.durationDays}
//                   onChange={handleChange}
//                   min="1"
//                   max="90"
//                 />
//               </div>
//             </div>

//             {/* Short Description */}
//             <div className="flex items-center">
//               <span className="text-pink-500 mr-2">*</span>
//               <input
//                 type="text"
//                 name="caseDescription"
//                 placeholder="Short Description (Title)"
//                 className={`w-full p-4 text-lg font-[poppins] rounded-lg ${
//                   isDarkMode
//                     ? "bg-gray-700 text-white placeholder-gray-400"
//                     : "bg-gray-100 text-gray-700 placeholder-gray-500"
//                 } ${
//                   errors.caseDescription ? "border border-red-500" : "border-0"
//                 } ${
//                   focusedField === "caseDescription"
//                     ? "border-pink-500 outline-pink-500"
//                     : ""
//                 }`}
//                 value={formData.caseDescription}
//                 onChange={handleChange}
//                 onFocus={() => setFocusedField("caseDescription")}
//                 onBlur={() => setFocusedField("")}
//               />
//             </div>
//             {errors.caseDescription && (
//               <p className="text-red-500 text-xs mt-1">
//                 {errors.caseDescription}
//               </p>
//             )}

//             {/* Detailed Story */}
//             <div className="flex items-start">
//               <span className="text-pink-500 mr-2 mt-4">*</span>
//               <textarea
//                 name="story"
//                 placeholder="Tell your full story (What you need help with, why it's important, etc.)"
//                 className={`w-full p-4 text-lg font-[poppins] rounded-lg ${
//                   isDarkMode
//                     ? "bg-gray-700 text-white placeholder-gray-400"
//                     : "bg-gray-100 text-gray-700 placeholder-gray-500"
//                 } ${errors.story ? "border border-red-500" : "border-0"} ${
//                   focusedField === "story"
//                     ? "border-pink-500 outline-pink-500"
//                     : ""
//                 }`}
//                 value={formData.story}
//                 onChange={handleChange}
//                 onFocus={() => setFocusedField("story")}
//                 onBlur={() => setFocusedField("")}
//                 rows="6"
//               />
//             </div>
//             {errors.story && (
//               <p className="text-red-500 text-xs mt-1">{errors.story}</p>
//             )}
//           </div>

//           {/* Media Section */}
//           <div className="space-y-4">
//             <h3
//               className={`text-xl font-semibold ${
//                 isDarkMode ? "text-white" : "text-gray-700"
//               }`}
//             >
//               Supporting Documents & Media
//             </h3>

//             {/* Main Photo */}
//             <div className="w-full">
//               <label className="block text-lg font-[poppins] mb-2 text-gray-600 dark:text-gray-300">
//                 <span className="text-pink-500 mr-2">*</span> Main Photo
//               </label>
//               <div
//                 className={`relative ${
//                   isDarkMode ? "bg-gray-700" : "bg-gray-100"
//                 } p-4 rounded-lg`}
//               >
//                 <FaFileImage
//                   className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-lg ${
//                     isDarkMode ? "text-white" : "text-gray-700"
//                   }`}
//                 />
//                 <input
//                   type="file"
//                   name="photo"
//                   accept="image/*"
//                   onChange={handleFileChange}
//                   className={`w-full p-4 pl-12 text-lg font-[poppins] rounded-lg ${
//                     isDarkMode
//                       ? "bg-gray-700 text-white"
//                       : "bg-gray-100 text-gray-700"
//                   }`}
//                   required
//                 />
//                 <span
//                   className={`text-sm ${
//                     isDarkMode ? "text-gray-300" : "text-gray-600"
//                   }`}
//                 >
//                   {formData.photo ? formData.photo.name : "No file chosen"}
//                 </span>
//               </div>
//               {errors.photo && (
//                 <p className="text-red-500 text-xs mt-1">{errors.photo}</p>
//               )}
//             </div>

//             {/* Additional Photos */}
//             <div className="w-full">
//               <label className="block text-lg font-[poppins] mb-2 text-gray-600 dark:text-gray-300">
//                 Additional Photos (Optional)
//               </label>
//               <div
//                 className={`relative ${
//                   isDarkMode ? "bg-gray-700" : "bg-gray-100"
//                 } p-4 rounded-lg`}
//               >
//                 <FaFileImage
//                   className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-lg ${
//                     isDarkMode ? "text-white" : "text-gray-700"
//                   }`}
//                 />
//                 <input
//                   type="file"
//                   name="additionalPhotos"
//                   accept="image/*"
//                   onChange={handleFileChange}
//                   className={`w-full p-4 pl-12 text-lg font-[poppins] rounded-lg ${
//                     isDarkMode
//                       ? "bg-gray-700 text-white"
//                       : "bg-gray-100 text-gray-700"
//                   }`}
//                   multiple
//                 />
//                 <span
//                   className={`text-sm ${
//                     isDarkMode ? "text-gray-300" : "text-gray-600"
//                   }`}
//                 >
//                   {formData.additionalPhotos.length > 0
//                     ? `${formData.additionalPhotos.length} files chosen`
//                     : "No files chosen"}
//                 </span>
//               </div>
//             </div>

//             {/* Required Document */}
//             <div className="w-full">
//               <label className="block text-lg font-[poppins] mb-2 text-gray-600 dark:text-gray-300">
//                 <span className="text-pink-500 mr-2">*</span> Required Document
//                 (PDF)
//               </label>
//               <div
//                 className={`relative ${
//                   isDarkMode ? "bg-gray-700" : "bg-gray-100"
//                 } p-4 rounded-lg`}
//               >
//                 <FaFileAlt
//                   className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-lg ${
//                     isDarkMode ? "text-white" : "text-gray-700"
//                   }`}
//                 />
//                 <input
//                   type="file"
//                   name="document"
//                   accept="application/pdf"
//                   onChange={handleFileChange}
//                   className={`w-full p-4 pl-12 text-lg font-[poppins] rounded-lg ${
//                     isDarkMode
//                       ? "bg-gray-700 text-white"
//                       : "bg-gray-100 text-gray-700"
//                   }`}
//                   required
//                 />
//                 <span
//                   className={`text-sm ${
//                     isDarkMode ? "text-gray-300" : "text-gray-600"
//                   }`}
//                 >
//                   {formData.document
//                     ? formData.document.name
//                     : "No file chosen"}
//                 </span>
//               </div>
//               {errors.document && (
//                 <p className="text-red-500 text-xs mt-1">{errors.document}</p>
//               )}
//             </div>

//             {/* Additional Documents */}
//             <div className="w-full">
//               <label className="block text-lg font-[poppins] mb-2 text-gray-600 dark:text-gray-300">
//                 Additional Documents (Optional)
//               </label>
//               <div
//                 className={`relative ${
//                   isDarkMode ? "bg-gray-700" : "bg-gray-100"
//                 } p-4 rounded-lg`}
//               >
//                 <FaFileAlt
//                   className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-lg ${
//                     isDarkMode ? "text-white" : "text-gray-700"
//                   }`}
//                 />
//                 <input
//                   type="file"
//                   name="additionalDocuments"
//                   accept="application/pdf,image/*"
//                   onChange={handleFileChange}
//                   className={`w-full p-4 pl-12 text-lg font-[poppins] rounded-lg ${
//                     isDarkMode
//                       ? "bg-gray-700 text-white"
//                       : "bg-gray-100 text-gray-700"
//                   }`}
//                   multiple
//                 />
//                 <span
//                   className={`text-sm ${
//                     isDarkMode ? "text-gray-300" : "text-gray-600"
//                   }`}
//                 >
//                   {formData.additionalDocuments.length > 0
//                     ? `${formData.additionalDocuments.length} files chosen`
//                     : "No files chosen"}
//                 </span>
//               </div>
//             </div>

//             {/* Video */}
//             <div className="w-full">
//               <label className="block text-lg font-[poppins] mb-2 text-gray-600 dark:text-gray-300">
//                 Video (Optional)
//               </label>
//               <div
//                 className={`relative ${
//                   isDarkMode ? "bg-gray-700" : "bg-gray-100"
//                 } p-4 rounded-lg`}
//               >
//                 <FaVideo
//                   className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-lg ${
//                     isDarkMode ? "text-white" : "text-gray-700"
//                   }`}
//                 />
//                 <input
//                   type="file"
//                   name="video"
//                   accept="video/*"
//                   onChange={handleFileChange}
//                   className={`w-full p-4 pl-12 text-lg font-[poppins] rounded-lg ${
//                     isDarkMode
//                       ? "bg-gray-700 text-white"
//                       : "bg-gray-100 text-gray-700"
//                   }`}
//                 />
//                 <span
//                   className={`text-sm ${
//                     isDarkMode ? "text-gray-300" : "text-gray-600"
//                   }`}
//                 >
//                   {formData.video ? formData.video.name : "No file chosen"}
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* Payment Information Section */}
//           <div className="space-y-4">
//             <h3
//               className={`text-xl font-semibold ${
//                 isDarkMode ? "text-white" : "text-gray-700"
//               }`}
//             >
//               Payment Information
//             </h3>

//             {/* Bank */}
//             <div className="flex items-center">
//               <span className="text-pink-500 mr-2">*</span>
//               <select
//                 name="bank"
//                 className={`w-full p-4 text-lg font-[poppins] rounded-lg ${
//                   isDarkMode
//                     ? "bg-gray-700 text-white"
//                     : "bg-gray-100 text-gray-700"
//                 } ${errors.bank ? "border border-red-500" : "border-0"}`}
//                 value={formData.bank}
//                 onChange={handleChange}
//               >
//                 <option value="">Choose Bank</option>
//                 <option value="CBE">Commercial Bank of Ethiopia</option>
//                 <option value="Awash">Awash Bank</option>
//                 <option value="Dashen">Dashen Bank</option>
//                 <option value="Abyssinia">Bank of Abyssinia</option>
//                 <option value="Wegagen">Wegagen Bank</option>
//                 <option value="Nib">Nib International Bank</option>
//                 <option value="Berhan">Berhan Bank</option>
//               </select>
//             </div>
//             {errors.bank && (
//               <p className="text-red-500 text-xs mt-1">{errors.bank}</p>
//             )}

//             {/* Account Number */}
//             <div className="flex items-center">
//               <span className="text-pink-500 mr-2">*</span>
//               <input
//                 type="text"
//                 name="accountNumber"
//                 placeholder="Account Number"
//                 className={`w-full p-4 text-lg font-[poppins] rounded-lg ${
//                   isDarkMode
//                     ? "bg-gray-700 text-white placeholder-gray-400"
//                     : "bg-gray-100 text-gray-700 placeholder-gray-500"
//                 } ${
//                   errors.accountNumber ? "border border-red-500" : "border-0"
//                 } ${
//                   focusedField === "accountNumber"
//                     ? "border-pink-500 outline-pink-500"
//                     : ""
//                 }`}
//                 value={formData.accountNumber}
//                 onChange={handleChange}
//                 onFocus={() => setFocusedField("accountNumber")}
//                 onBlur={() => setFocusedField("")}
//               />
//             </div>
//             {errors.accountNumber && (
//               <p className="text-red-500 text-xs mt-1">
//                 {errors.accountNumber}
//               </p>
//             )}

//             {/* Payment Method */}
//             <div className="flex items-center">
//               <span className="text-pink-500 mr-2">*</span>
//               <select
//                 name="paymentMethod"
//                 className={`w-full p-4 text-lg font-[poppins] rounded-lg ${
//                   isDarkMode
//                     ? "bg-gray-700 text-white"
//                     : "bg-gray-100 text-gray-700"
//                 } ${
//                   errors.paymentMethod ? "border border-red-500" : "border-0"
//                 }`}
//                 value={formData.paymentMethod}
//                 onChange={handleChange}
//               >
//                 <option value="">Payment Method</option>
//                 <option value="Bank Transfer">Bank Transfer</option>
//                 <option value="Mobile Banking">Mobile Banking</option>
//                 <option value="Other">Other</option>
//               </select>
//             </div>
//             {errors.paymentMethod && (
//               <p className="text-red-500 text-xs mt-1">
//                 {errors.paymentMethod}
//               </p>
//             )}
//           </div>

//           {/* Submit Button */}
//           <div className="flex justify-center pt-6">
//             <button
//               type="submit"
//               className={`w-full py-3 px-6 text-lg font-[poppins] bg-pink-500 text-white rounded-lg hover:bg-pink-600 ${
//                 isDarkMode ? "hover:bg-pink-600" : "hover:bg-pink-700"
//               } transition duration-300`}
//             >
//               Submit Request
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default RequestDonate;


import React, { useState, useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { useAuth } from "../Authentication/AuthContext";

import {
  FaInfoCircle,
  FaMoneyCheck,
  FaFileImage,
  FaFileAlt,
  FaVideo,
  FaMapMarkerAlt,
  FaBook,
  FaCalendarAlt,
  FaMoneyBillWave,
} from "react-icons/fa";

const RequestDonate = ({ openPopup }) => {
  const { isDarkMode } = useContext(ThemeContext);
  const { user, logout } = useAuth();
  const [notAllowed, setNotAllowed] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    gender: "",
    age: "",
    photo: null,
    document: null,
    video: null,
    paymentMethod: "",
    accountNumber: "",
    caseDescription: "",
    bank: "",
    description: "",
    location: "",
    category: "",
    neededAmount: "",
    durationDays: 30,
    story: "",
    additionalPhotos: [],
    additionalDocuments: [],
  });

  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "additionalPhotos" || name === "additionalDocuments") {
      setFormData({ ...formData, [name]: Array.from(files) });
    } else {
      setFormData({ ...formData, [name]: files[0] });
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.fullName.trim()) errors.fullName = "Full name is required.";
    if (!formData.phoneNumber.trim())
      errors.phoneNumber = "Phone number is required.";
    if (!formData.gender) errors.gender = "Gender is required.";
    if (!formData.age) errors.age = "Age is required.";
    if (!formData.photo) errors.photo = "A photo is required.";
    if (!formData.document) errors.document = "A document is required.";
    if (!formData.paymentMethod)
      errors.paymentMethod = "Payment method is required.";
    if (!formData.accountNumber.trim())
      errors.accountNumber = "Account number is required.";
    if (!formData.bank.trim()) errors.bank = "Bank name is required.";

    if (!formData.caseDescription.trim())
      errors.caseDescription = "Case description is required.";

    if (!formData.location.trim()) errors.location = "Location is required.";
    if (!formData.category.trim()) errors.category = "Category is required.";
    if (!formData.neededAmount)
      errors.neededAmount = "Needed amount is required.";
    if (!formData.story.trim()) errors.story = "Story is required.";

    // Optionally validate additional files
    if (formData.additionalPhotos && formData.additionalPhotos.length > 5) {
      errors.additionalPhotos = "You can upload up to 5 additional photos.";
    }

    if (
      formData.additionalDocuments &&
      formData.additionalDocuments.length > 5
    ) {
      errors.additionalDocuments =
        "You can upload up to 5 additional documents.";
    }
    // Log errors to see which fields are invalid
    console.log(errors);

    // Show errors (optional)
    setErrors(errors);

    // ✅ Only return true if no errors
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submit clicked");
    console.log("🔍 Running validation...");

    // Check if user is authenticated and a donor
    if (user?.role !== "Requester") {
      setNotAllowed(
        "You are not allowed to make a request. Please register as a requester."
      );
      return;
    }

    if (validateForm()) {
      console.log("✅ Form is valid. Proceeding to submit...");
      const form = new FormData();

      // Append all simple fields
      Object.keys(formData).forEach((key) => {
        if (
          key !== "photo" &&
          key !== "document" &&
          key !== "video" &&
          key !== "additionalPhotos" &&
          key !== "additionalDocuments"
        ) {
          form.append(key, formData[key]);
        }
      });

      // Append single files
      if (formData.photo) form.append("photo", formData.photo);
      if (formData.document) form.append("document", formData.document);
      if (formData.video) form.append("video", formData.video);

      // Append multiple files
      if (formData.additionalPhotos) {
        Array.from(formData.additionalPhotos).forEach((file, i) => {
          form.append(`additionalPhotos`, file);
        });
      }

      if (formData.additionalDocuments) {
        Array.from(formData.additionalDocuments).forEach((file, i) => {
          form.append(`additionalDocuments`, file);
        });
      }

      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:5000/api/request-donate",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: form,
          }
        );

        const result = await response.json();
        if (response.ok) {
          alert("Request submitted successfully!");
          // Optionally reset the form here
          setFormData({
            fullName: "",
            phoneNumber: "",
            gender: "",
            age: "",
            photo: null,
            document: null,
            video: null,
            paymentMethod: "",
            accountNumber: "",
            caseDescription: "",
            bank: "",

            location: "",
            category: "",
            neededAmount: "",
            durationDays: 30,
            story: "",
            additionalPhotos: [],
            additionalDocuments: [],
          });
        } else {
          alert("Submission failed: " + (result.error || "Unknown error"));
        }
      } catch (err) {
        console.error("Error submitting form:", err);
        alert("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div
      className={`flex justify-center items-center min-h-screen ${
        isDarkMode ? "bg-gray-900" : "bg-gray-100"
      }`}
    >
      <div
        className={`max-w-2xl w-full p-6 mt-10 mb-10 rounded-lg shadow-md ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <h2
          className={`text-4xl font-bold text-center ${
            isDarkMode ? "text-pink-400" : "text-pink-500"
          } font-[poppins] mb-4`}
        >
          Request for Aid
        </h2>

        <p
          className={`text-center mb-6 text-lg ${
            isDarkMode ? "text-gray-300" : "text-gray-600"
          } font-[poppins]`}
        >
          Please ensure that all personal details and supporting documents are
          accurate. Attach the necessary files (photo, documents, and videos) as
          required for your aid request.
          <br /> Fields marked with <span className="text-pink-500">*</span> are
          required.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Personal Information Section */}
          <div className="space-y-4">
            <h3
              className={`text-xl font-semibold ${
                isDarkMode ? "text-white" : "text-gray-700"
              }`}
            >
              Personal Information
            </h3>

            {/* Full Name */}
            <div className="flex items-center">
              <span className="text-pink-500 mr-2">*</span>
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                className={`w-full p-4 text-lg font-[poppins] rounded-lg ${
                  isDarkMode
                    ? "bg-gray-700 text-white placeholder-gray-400"
                    : "bg-gray-100 text-gray-700 placeholder-gray-500"
                } ${errors.fullName ? "border border-red-500" : "border-0"} ${
                  focusedField === "fullName"
                    ? "border-pink-500 outline-pink-500"
                    : ""
                }`}
                value={formData.fullName}
                onChange={handleChange}
                onFocus={() => setFocusedField("fullName")}
                onBlur={() => setFocusedField("")}
              />
            </div>
            {errors.fullName && (
              <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
            )}

            {/* Phone Number */}
            <div className="flex items-center">
              <span className="text-pink-500 mr-2">*</span>
              <input
                type="tel"
                name="phoneNumber"
                placeholder="Phone Number"
                className={`w-full p-4 text-lg font-[poppins] rounded-lg ${
                  isDarkMode
                    ? "bg-gray-700 text-white placeholder-gray-400"
                    : "bg-gray-100 text-gray-700 placeholder-gray-500"
                } ${
                  errors.phoneNumber ? "border border-red-500" : "border-0"
                } ${
                  focusedField === "phoneNumber"
                    ? "border-pink-500 outline-pink-500"
                    : ""
                }`}
                value={formData.phoneNumber}
                onChange={handleChange}
                onFocus={() => setFocusedField("phoneNumber")}
                onBlur={() => setFocusedField("")}
              />
            </div>
            {errors.phoneNumber && (
              <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>
            )}

            {/* Gender & Age */}
            <div className="flex space-x-4">
              <div className="flex-1 flex items-center">
                <span className="text-pink-500 mr-2">*</span>
                <select
                  name="gender"
                  className={`w-full p-4 text-lg font-[poppins] rounded-lg ${
                    isDarkMode
                      ? "bg-gray-700 text-white"
                      : "bg-gray-100 text-gray-700"
                  } ${errors.gender ? "border border-red-500" : "border-0"}`}
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="">Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="flex-1 flex items-center">
                <span className="text-pink-500 mr-2">*</span>
                <input
                  type="number"
                  name="age"
                  placeholder="Age"
                  className={`w-full p-4 text-lg font-[poppins] rounded-lg ${
                    isDarkMode
                      ? "bg-gray-700 text-white placeholder-gray-400"
                      : "bg-gray-100 text-gray-700 placeholder-gray-500"
                  } ${errors.age ? "border border-red-500" : "border-0"} ${
                    focusedField === "age"
                      ? "border-pink-500 outline-pink-500"
                      : ""
                  }`}
                  value={formData.age}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("age")}
                  onBlur={() => setFocusedField("")}
                />
              </div>
            </div>
            {errors.age && (
              <p className="text-red-500 text-xs mt-1">{errors.age}</p>
            )}
            {errors.gender && (
              <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
            )}

            {/* Location */}
            <div className="flex items-center">
              <span className="text-pink-500 mr-2">*</span>
              <div
                className={`relative flex items-center w-full ${
                  isDarkMode ? "bg-gray-700" : "bg-gray-100"
                } rounded-lg`}
              >
                <FaMapMarkerAlt
                  className={`absolute left-4 text-lg ${
                    isDarkMode ? "text-white" : "text-gray-700"
                  }`}
                />
                <input
                  type="text"
                  name="location"
                  placeholder="Location (City/Town)"
                  className={`w-full p-4 pl-12 text-lg font-[poppins] rounded-lg ${
                    isDarkMode
                      ? "bg-gray-700 text-white placeholder-gray-400"
                      : "bg-gray-100 text-gray-700 placeholder-gray-500"
                  } ${errors.location ? "border border-red-500" : "border-0"}`}
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>
            </div>
            {errors.location && (
              <p className="text-red-500 text-xs mt-1">{errors.location}</p>
            )}
          </div>

          {/* Case Information Section */}
          <div className="space-y-4">
            <h3
              className={`text-xl font-semibold ${
                isDarkMode ? "text-white" : "text-gray-700"
              }`}
            >
              Case Information
            </h3>

            {/* Category */}
            <div className="flex items-center">
              <span className="text-pink-500 mr-2">*</span>
              <div
                className={`relative flex items-center w-full ${
                  isDarkMode ? "bg-gray-700" : "bg-gray-100"
                } rounded-lg`}
              >
                <FaBook
                  className={`absolute left-4 text-lg ${
                    isDarkMode ? "text-white" : "text-gray-700"
                  }`}
                />
                <select
                  name="category"
                  className={`w-full p-4 pl-12 text-lg font-[poppins] rounded-lg ${
                    isDarkMode
                      ? "bg-gray-700 text-white"
                      : "bg-gray-100 text-gray-700"
                  } ${errors.category ? "border border-red-500" : "border-0"}`}
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="">Select Category</option>
                  <option value="Education">Education</option>
                  <option value="Medical">Medical</option>
                  <option value="Business">Business</option>
                  <option value="Emergency">Emergency</option>
                  <option value="Housing">Housing</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            {errors.category && (
              <p className="text-red-500 text-xs mt-1">{errors.category}</p>
            )}

            {/* Needed Amount */}
            <div className="flex items-center">
              <span className="text-pink-500 mr-2">*</span>
              <div
                className={`relative flex items-center w-full ${
                  isDarkMode ? "bg-gray-700" : "bg-gray-100"
                } rounded-lg`}
              >
                <FaMoneyBillWave
                  className={`absolute left-4 text-lg ${
                    isDarkMode ? "text-white" : "text-gray-700"
                  }`}
                />
                <input
                  type="number"
                  name="neededAmount"
                  placeholder="Amount Needed (ETB)"
                  className={`w-full p-4 pl-12 text-lg font-[poppins] rounded-lg ${
                    isDarkMode
                      ? "bg-gray-700 text-white placeholder-gray-400"
                      : "bg-gray-100 text-gray-700 placeholder-gray-500"
                  } ${
                    errors.neededAmount ? "border border-red-500" : "border-0"
                  }`}
                  value={formData.neededAmount}
                  onChange={handleChange}
                />
              </div>
            </div>
            {errors.neededAmount && (
              <p className="text-red-500 text-xs mt-1">{errors.neededAmount}</p>
            )}

            {/* Campaign Duration */}
            <div className="flex items-center">
              <span className="text-pink-500 mr-2">*</span>
              <div
                className={`relative flex items-center w-full ${
                  isDarkMode ? "bg-gray-700" : "bg-gray-100"
                } rounded-lg`}
              >
                <FaCalendarAlt
                  className={`absolute left-4 text-lg ${
                    isDarkMode ? "text-white" : "text-gray-700"
                  }`}
                />
                <input
                  type="number"
                  name="durationDays"
                  placeholder="Campaign Duration (Days)"
                  className={`w-full p-4 pl-12 text-lg font-[poppins] rounded-lg ${
                    isDarkMode
                      ? "bg-gray-700 text-white placeholder-gray-400"
                      : "bg-gray-100 text-gray-700 placeholder-gray-500"
                  }`}
                  value={formData.durationDays}
                  onChange={handleChange}
                  min="1"
                  max="90"
                />
              </div>
            </div>

            {/* Short Description */}
            <div className="flex items-center">
              <span className="text-pink-500 mr-2">*</span>
              <input
                type="text"
                name="caseDescription"
                placeholder="Short Description (Title)"
                className={`w-full p-4 text-lg font-[poppins] rounded-lg ${
                  isDarkMode
                    ? "bg-gray-700 text-white placeholder-gray-400"
                    : "bg-gray-100 text-gray-700 placeholder-gray-500"
                } ${
                  errors.caseDescription ? "border border-red-500" : "border-0"
                } ${
                  focusedField === "caseDescription"
                    ? "border-pink-500 outline-pink-500"
                    : ""
                }`}
                value={formData.caseDescription}
                onChange={handleChange}
                onFocus={() => setFocusedField("caseDescription")}
                onBlur={() => setFocusedField("")}
              />
            </div>
            {errors.caseDescription && (
              <p className="text-red-500 text-xs mt-1">
                {errors.caseDescription}
              </p>
            )}

            {/* Detailed Story */}
            <div className="flex items-start">
              <span className="text-pink-500 mr-2 mt-4">*</span>
              <textarea
                name="story"
                placeholder="Tell your full story (What you need help with, why it's important, etc.)"
                className={`w-full p-4 text-lg font-[poppins] rounded-lg ${
                  isDarkMode
                    ? "bg-gray-700 text-white placeholder-gray-400"
                    : "bg-gray-100 text-gray-700 placeholder-gray-500"
                } ${errors.story ? "border border-red-500" : "border-0"} ${
                  focusedField === "story"
                    ? "border-pink-500 outline-pink-500"
                    : ""
                }`}
                value={formData.story}
                onChange={handleChange}
                onFocus={() => setFocusedField("story")}
                onBlur={() => setFocusedField("")}
                rows="6"
              />
            </div>
            {errors.story && (
              <p className="text-red-500 text-xs mt-1">{errors.story}</p>
            )}
          </div>

          {/* Media Section */}
          <div className="space-y-4">
            <h3
              className={`text-xl font-semibold ${
                isDarkMode ? "text-white" : "text-gray-700"
              }`}
            >
              Supporting Documents & Media
            </h3>

            {/* Main Photo */}
            <div className="w-full">
              <label className="block text-lg font-[poppins] mb-2 text-gray-600 dark:text-gray-300">
                <span className="text-pink-500 mr-2">*</span> Main Photo
              </label>
              <div
                className={`relative ${
                  isDarkMode ? "bg-gray-700" : "bg-gray-100"
                } p-4 rounded-lg`}
              >
                <FaFileImage
                  className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-lg ${
                    isDarkMode ? "text-white" : "text-gray-700"
                  }`}
                />
                <input
                  type="file"
                  name="photo"
                  accept="image/*"
                  onChange={handleFileChange}
                  className={`w-full p-4 pl-12 text-lg font-[poppins] rounded-lg ${
                    isDarkMode
                      ? "bg-gray-700 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                  required
                />
                <span
                  className={`text-sm ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {formData.photo ? formData.photo.name : "No file chosen"}
                </span>
              </div>
              {errors.photo && (
                <p className="text-red-500 text-xs mt-1">{errors.photo}</p>
              )}
            </div>

            {/* Additional Photos */}
            <div className="w-full">
              <label className="block text-lg font-[poppins] mb-2 text-gray-600 dark:text-gray-300">
                Additional Photos (Optional)
              </label>
              <div
                className={`relative ${
                  isDarkMode ? "bg-gray-700" : "bg-gray-100"
                } p-4 rounded-lg`}
              >
                <FaFileImage
                  className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-lg ${
                    isDarkMode ? "text-white" : "text-gray-700"
                  }`}
                />
                <input
                  type="file"
                  name="additionalPhotos"
                  accept="image/*"
                  onChange={handleFileChange}
                  className={`w-full p-4 pl-12 text-lg font-[poppins] rounded-lg ${
                    isDarkMode
                      ? "bg-gray-700 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                  multiple
                />
                <span
                  className={`text-sm ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {formData.additionalPhotos.length > 0
                    ? `${formData.additionalPhotos.length} files chosen`
                    : "No files chosen"}
                </span>
              </div>
            </div>

            {/* Required Document */}
            <div className="w-full">
              <label className="block text-lg font-[poppins] mb-2 text-gray-600 dark:text-gray-300">
                <span className="text-pink-500 mr-2">*</span> Required Document
                (PDF)
              </label>
              <div
                className={`relative ${
                  isDarkMode ? "bg-gray-700" : "bg-gray-100"
                } p-4 rounded-lg`}
              >
                <FaFileAlt
                  className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-lg ${
                    isDarkMode ? "text-white" : "text-gray-700"
                  }`}
                />
                <input
                  type="file"
                  name="document"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className={`w-full p-4 pl-12 text-lg font-[poppins] rounded-lg ${
                    isDarkMode
                      ? "bg-gray-700 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                  required
                />
                <span
                  className={`text-sm ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {formData.document
                    ? formData.document.name
                    : "No file chosen"}
                </span>
              </div>
              {errors.document && (
                <p className="text-red-500 text-xs mt-1">{errors.document}</p>
              )}
            </div>

            {/* Additional Documents */}
            <div className="w-full">
              <label className="block text-lg font-[poppins] mb-2 text-gray-600 dark:text-gray-300">
                Additional Documents (Optional)
              </label>
              <div
                className={`relative ${
                  isDarkMode ? "bg-gray-700" : "bg-gray-100"
                } p-4 rounded-lg`}
              >
                <FaFileAlt
                  className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-lg ${
                    isDarkMode ? "text-white" : "text-gray-700"
                  }`}
                />
                <input
                  type="file"
                  name="additionalDocuments"
                  accept="application/pdf,image/*"
                  onChange={handleFileChange}
                  className={`w-full p-4 pl-12 text-lg font-[poppins] rounded-lg ${
                    isDarkMode
                      ? "bg-gray-700 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                  multiple
                />
                <span
                  className={`text-sm ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {formData.additionalDocuments.length > 0
                    ? `${formData.additionalDocuments.length} files chosen`
                    : "No files chosen"}
                </span>
              </div>
            </div>

            {/* Video */}
            <div className="w-full">
              <label className="block text-lg font-[poppins] mb-2 text-gray-600 dark:text-gray-300">
                Video (Optional)
              </label>
              <div
                className={`relative ${
                  isDarkMode ? "bg-gray-700" : "bg-gray-100"
                } p-4 rounded-lg`}
              >
                <FaVideo
                  className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-lg ${
                    isDarkMode ? "text-white" : "text-gray-700"
                  }`}
                />
                <input
                  type="file"
                  name="video"
                  accept="video/*"
                  onChange={handleFileChange}
                  className={`w-full p-4 pl-12 text-lg font-[poppins] rounded-lg ${
                    isDarkMode
                      ? "bg-gray-700 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                />
                <span
                  className={`text-sm ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {formData.video ? formData.video.name : "No file chosen"}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Information Section */}
          <div className="space-y-4">
            <h3
              className={`text-xl font-semibold ${
                isDarkMode ? "text-white" : "text-gray-700"
              }`}
            >
              Payment Information
            </h3>

            {/* Bank */}
            <div className="flex items-center">
              <span className="text-pink-500 mr-2">*</span>
              <select
                name="bank"
                className={`w-full p-4 text-lg font-[poppins] rounded-lg ${
                  isDarkMode
                    ? "bg-gray-700 text-white"
                    : "bg-gray-100 text-gray-700"
                } ${errors.bank ? "border border-red-500" : "border-0"}`}
                value={formData.bank}
                onChange={handleChange}
              >
                <option value="">Choose Bank</option>
                <option value="CBE">Commercial Bank of Ethiopia</option>
                <option value="Awash">Awash Bank</option>
                <option value="Dashen">Dashen Bank</option>
                <option value="Abyssinia">Bank of Abyssinia</option>
                <option value="Wegagen">Wegagen Bank</option>
                <option value="Nib">Nib International Bank</option>
                <option value="Berhan">Berhan Bank</option>
              </select>
            </div>
            {errors.bank && (
              <p className="text-red-500 text-xs mt-1">{errors.bank}</p>
            )}

            {/* Account Number */}
            <div className="flex items-center">
              <span className="text-pink-500 mr-2">*</span>
              <input
                type="text"
                name="accountNumber"
                placeholder="Account Number"
                className={`w-full p-4 text-lg font-[poppins] rounded-lg ${
                  isDarkMode
                    ? "bg-gray-700 text-white placeholder-gray-400"
                    : "bg-gray-100 text-gray-700 placeholder-gray-500"
                } ${
                  errors.accountNumber ? "border border-red-500" : "border-0"
                } ${
                  focusedField === "accountNumber"
                    ? "border-pink-500 outline-pink-500"
                    : ""
                }`}
                value={formData.accountNumber}
                onChange={handleChange}
                onFocus={() => setFocusedField("accountNumber")}
                onBlur={() => setFocusedField("")}
              />
            </div>
            {errors.accountNumber && (
              <p className="text-red-500 text-xs mt-1">
                {errors.accountNumber}
              </p>
            )}

            {/* Payment Method */}
            <div className="flex items-center">
              <span className="text-pink-500 mr-2">*</span>
              <select
                name="paymentMethod"
                className={`w-full p-4 text-lg font-[poppins] rounded-lg ${
                  isDarkMode
                    ? "bg-gray-700 text-white"
                    : "bg-gray-100 text-gray-700"
                } ${
                  errors.paymentMethod ? "border border-red-500" : "border-0"
                }`}
                value={formData.paymentMethod}
                onChange={handleChange}
              >
                <option value="">Payment Method</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Mobile Banking">Mobile Banking</option>
                <option value="Other">Other</option>
              </select>
            </div>
            {errors.paymentMethod && (
              <p className="text-red-500 text-xs mt-1">
                {errors.paymentMethod}
              </p>
            )}
          </div>

          {/* Not Allowed Message */}
          {notAllowed && (
            <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-500 text-center">
              <p className="text-lg">{notAllowed}</p>
              <button
                onClick={() => openPopup("register")} // Redirect to registration
                className="mt-2 hover:rounded-md p-1 text-lg text-pink-500 hover:text-white hover:bg-pink-500"
              >
                Register as a Requester
              </button>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <button
              type="submit"
              className={`w-full py-3 px-6 text-lg font-[poppins] bg-pink-500 text-white rounded-lg hover:bg-pink-600 ${
                isDarkMode ? "hover:bg-pink-600" : "hover:bg-pink-700"
              } transition duration-300`}
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestDonate;