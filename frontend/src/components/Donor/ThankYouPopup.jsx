// ThankYouPopup.jsx
import React, { useState } from 'react';

const ThankYouPopup = () => {
  const [visible, setVisible] = useState(true);

  const handleClose = () => setVisible(false);

  return (
    visible && (
      <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded-xl shadow-md w-96">
          <h2 className="text-2xl font-semibold mb-4">Thank You!</h2>
          <p>Your donation has been successfully received. Thank you for your generosity!</p>
          <button
            onClick={handleClose}
            className="mt-4 bg-pink-600 text-white px-6 py-2 rounded-xl w-full hover:bg-pink-700"
          >
            Close
          </button>
        </div>
      </div>
    )
  );
};

export default ThankYouPopup;
