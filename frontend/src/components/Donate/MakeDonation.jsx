import React, { useState, useContext } from "react";
import {
  FaHandHoldingHeart,
  FaUser,
  FaUniversity,
  FaPhone,
  FaDollarSign,
} from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom"; // Changed import
import ChapaLogo from "../../assets/images/chapa.png";
import ArifPayLogo from "../../assets/images/arifpay.png";
import BankLogo from "../../assets/images/banks.png";
import { ThemeContext } from "../../context/ThemeContext";
import { useAuth } from "../Authentication/AuthContext";

const MakeDonation = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const { id, name } = useParams(); // Get the name from URL params
  const history = useNavigate(); // Changed to useNavigate
    const { user } = useAuth();

  const [formData, setFormData] = useState({
    paymentOption: "",
    amount: "",
    phone: "",
    fullName: "",
    bank: "",
    accountNumber: "",
  });

  const [errors, setErrors] = useState({});
   const [notAllowed, setNotAllowed] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("Chapa");

  const paymentMethods = [
    { name: "Chapa", logo: ChapaLogo },
    { name: "Arifpay", logo: ArifPayLogo },
    { name: "Bank", logo: BankLogo },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
     setNotAllowed("");
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.paymentOption && selectedPayment !== "Bank")
      newErrors.paymentOption = "Required";
    if (!formData.amount) newErrors.amount = "Required";
    if (!formData.phone) newErrors.phone = "Required";
    if (!formData.fullName) newErrors.fullName = "Required";
    if (selectedPayment === "Bank" && !formData.bank)
      newErrors.bank = "Required";
    if (selectedPayment === "Bank" && !formData.accountNumber)
      newErrors.accountNumber = "Required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };



  const handleSubmit = async (e) => {
    e.preventDefault();

        if (user?.role !== "Donor") {
      setNotAllowed(
        "You are not allowed to make a donation. Please register as a donor."
      );
      return;
    }

    if (!validateForm()) return;

    try {
      const donationData = {
        recipientName: decodeURIComponent(name),
        amount: Number(formData.amount),
        phone: formData.phone,
        fullName: formData.fullName,
        paymentMethod: selectedPayment,
        requester: id,
        donor: user.id
      };


      if (selectedPayment === "Bank") {
        donationData.bank = formData.bank;
        donationData.accountNumber = formData.accountNumber;
      } else {
        donationData.paymentOption = formData.paymentOption;
      }

     donationData.donor = user.id;


       console.log('Final donation data being sent:', donationData);

      const endpoint =
        selectedPayment === "Bank"
          ? "http://localhost:5000/api/donations/bank"
          : "http://localhost:5000/api/payment/process";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(donationData),
      });

      const data = await response.json();

            if (!data.success) {
        throw new Error(data.error || "Donation failed");
      }


      if (selectedPayment === "Bank") {
        // Add the bank parameter here
        history(
          `/donation-pending?tx_ref=${data.transactionId}&bank=${formData.bank}`
        );
      } else if (data.requiresRedirect) {
        localStorage.setItem("lastTransactionId", data.transactionId);
        window.location.href = data.checkoutUrl;
      } else {
        history(`/donation-success?tx_ref=${data.transactionId}`);
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed: " + error.message);
    }
  };






  return (
    <div
      className={`flex justify-center items-center min-h-screen px-4 py-6 ${
        isDarkMode ? "bg-gray-900" : "bg-gray-100"
      }`}
    >
      <div
        className={`w-full max-w-3xl p-4 md:p-6 rounded-lg shadow-md ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-700"
        } mt-4 md:mt-10 mb-4 md:mb-10`}
      >
        <h2
          className={`text-2xl md:text-3xl font-bold mb-2 text-center ${
            isDarkMode ? "text-pink-400" : "text-pink-500"
          }`}
        >
          Donate to {decodeURIComponent(name)}
        </h2>

        {/* Payment Method Selection */}
        <div
          className={`flex flex-wrap justify-center gap-2 md:gap-6 p-3 md:p-4 border-b ${
            isDarkMode ? "border-gray-600" : "border-gray-300"
          }`}
        >
          {paymentMethods.map((method) => (
            <button
              key={method.name}
              onClick={() => setSelectedPayment(method.name)}
              className={`p-2 rounded-md border ${
                selectedPayment === method.name
                  ? isDarkMode
                    ? "border-pink-400 bg-gray-700"
                    : "border-pink-500 bg-gray-200"
                  : isDarkMode
                  ? "border-gray-600"
                  : "border-gray-300"
              }`}
            >
              <img
                src={method.logo}
                alt={method.name}
                className="h-8 md:h-12"
              />
            </button>
          ))}
        </div>

        {/* Dynamic Header */}
        <h3
          className={`text-xl md:text-2xl text-center font-semibold mt-4 md:mt-6 ${
            isDarkMode ? "text-gray-200" : "text-gray-700"
          }`}
        >
          Donate via {selectedPayment}
        </h3>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-3 md:space-y-4 p-3 md:p-6"
        >
          {/* Payment Option for Chapa & Arifpay */}
          {(selectedPayment === "Chapa" || selectedPayment === "Arifpay") && (
            <div className="relative">
              <select
                name="paymentOption"
                value={formData.paymentOption}
                onChange={handleChange}
                className={`w-full p-2 md:p-3 border rounded focus:outline-none focus:border-pink-500 focus:ring-pink-500 ${
                  isDarkMode
                    ? "bg-gray-700 text-white border-gray-600"
                    : "bg-gray-100 text-gray-700 border-gray-200"
                }`}
              >
                <option value="">Select Payment Option</option>
                <option value="Telebirr">Telebirr</option>
                <option value="CBE Birr">CBE Birr</option>
              </select>
              {errors.paymentOption && (
                <p className="text-red-500 text-sm">{errors.paymentOption}</p>
              )}
            </div>
          )}

          {/* Bank: Ethiopian Banks & Account Number */}
          {selectedPayment === "Bank" && (
            <>
              <div className="relative">
                <FaUniversity
                  className={`absolute left-3 top-3 md:top-4 ${
                    isDarkMode ? "text-gray-300" : "text-gray-400"
                  }`}
                />
                <select
                  name="bank"
                  value={formData.bank}
                  onChange={handleChange}
                  className={`w-full p-2 md:p-3 pl-8 md:pl-10 border rounded focus:outline-none focus:border-pink-500 focus:ring-pink-500 ${
                    isDarkMode
                      ? "bg-gray-700 text-white border-gray-600"
                      : "bg-gray-100 text-gray-700 border-gray-200"
                  }`}
                >
                  <option value="">Select a Bank</option>
                  <option value="CBE">Commercial Bank of Ethiopia</option>
                  <option value="Awash">Awash Bank</option>
                  <option value="Dashen">Dashen Bank</option>
                  <option value="Abyssinia">Bank of Abyssinia</option>
                  <option value="Wegagen">Wegagen Bank</option>
                  <option value="Nib">Nib International Bank</option>
                  <option value="Berhan">Berhan Bank</option>
                </select>
                {errors.bank && (
                  <p className="text-red-500 text-sm">{errors.bank}</p>
                )}
              </div>

              {/* Account Number */}
              <div className="relative">
                <FaUser
                  className={`absolute left-3 top-3 md:top-4 ${
                    isDarkMode ? "text-gray-300" : "text-gray-400"
                  }`}
                />
                <input
                  type="text"
                  name="accountNumber"
                  placeholder="Account No"
                  className={`w-full p-2 md:p-3 pl-8 md:pl-10 border rounded focus:outline-none focus:border-pink-500 focus:ring-pink-500 ${
                    isDarkMode
                      ? "bg-gray-700 text-white border-gray-600"
                      : "bg-gray-100 text-gray-700 border-gray-200"
                  }`}
                  value={formData.accountNumber}
                  onChange={handleChange}
                />
                {errors.accountNumber && (
                  <p className="text-red-500 text-sm">{errors.accountNumber}</p>
                )}
              </div>
            </>
          )}

          {/* Amount & Phone Number */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <div className="relative">
              <FaDollarSign
                className={`absolute left-3 top-3 md:top-4 ${
                  isDarkMode ? "text-gray-300" : "text-gray-400"
                }`}
              />
              <input
                type="number"
                name="amount"
                placeholder="Amount"
                className={`w-full p-2 md:p-3 pl-8 md:pl-10 border rounded focus:outline-none focus:border-pink-500 focus:ring-pink-500 ${
                  isDarkMode
                    ? "bg-gray-700 text-white border-gray-600"
                    : "bg-gray-100 text-gray-700 border-gray-200"
                }`}
                value={formData.amount}
                onChange={handleChange}
              />
              {errors.amount && (
                <p className="text-red-500 text-sm">{errors.amount}</p>
              )}
            </div>

            <div className="relative">
              <FaPhone
                className={`absolute left-3 top-3 md:top-4 ${
                  isDarkMode ? "text-gray-300" : "text-gray-400"
                }`}
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                className={`w-full p-2 md:p-3 pl-8 md:pl-10 border rounded focus:outline-none focus:border-pink-500 focus:ring-pink-500 ${
                  isDarkMode
                    ? "bg-gray-700 text-white border-gray-600"
                    : "bg-gray-100 text-gray-700 border-gray-200"
                }`}
                value={formData.phone}
                onChange={handleChange}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone}</p>
              )}
            </div>
          </div>

          {/* Full Name */}
          <div className="relative">
            <FaUser
              className={`absolute left-3 top-3 md:top-4 ${
                isDarkMode ? "text-gray-300" : "text-gray-400"
              }`}
            />
            <input
              type="text"
              name="fullName"
              placeholder="Name"
              className={`w-full p-2 md:p-3 pl-8 md:pl-10 border rounded focus:outline-none focus:border-pink-500 focus:ring-pink-500 ${
                isDarkMode
                  ? "bg-gray-700 text-white border-gray-600"
                  : "bg-gray-100 text-gray-700 border-gray-200"
              }`}
              value={formData.fullName}
              onChange={handleChange}
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm">{errors.fullName}</p>
            )}
          </div>

          {/* Donation Appreciation Message */}
          <div
            className={`p-3 md:p-4 rounded-lg text-center ${
              isDarkMode
                ? "bg-gray-700 text-gray-200"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            <p className="font-medium text-sm md:text-base">
              We deeply value your generous donation to{" "}
              {decodeURIComponent(name)}. Your transaction will be{" "}
              <span className="text-pink-500 font-semibold">
                {" "}
                confidentially handled
              </span>{" "}
              by our staff.
            </p>
            <p className="mt-1 md:mt-2 text-xs md:text-sm">
              Thank you for supporting our cause and making a difference.
            </p>
          </div>


              {/* Not Allowed Message */}
          {notAllowed && (
            <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-500 text-center">
              <p className="text-lg">{notAllowed}</p>
              <button
                onClick={() => openPopup("register")} // Redirect to registration
                className="mt-2 hover:rounded-md p-1 text-lg text-pink-500 hover:text-white hover:bg-pink-500"
              >
                Register as a Donor
              </button>
            </div>
          )}

          {/* Donate Button */}
          <button
            type="submit"
            className={`w-full p-2 md:p-3 text-white rounded focus:outline-none flex items-center justify-center ${
              isDarkMode
                ? "bg-pink-600 hover:bg-pink-700"
                : "bg-pink-500 hover:bg-pink-600"
            }`}
          >
            <FaHandHoldingHeart className="mr-2" /> Donate to{" "}
            {decodeURIComponent(name)}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MakeDonation;
