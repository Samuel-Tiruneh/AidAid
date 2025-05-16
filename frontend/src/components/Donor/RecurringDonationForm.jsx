// RecurringDonationForm.jsx
import React, { useState } from 'react';

const RecurringDonationForm = () => {
  const [amount, setAmount] = useState('');
  const [frequency, setFrequency] = useState('monthly');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic for submitting the form
    alert(`Recurring donation of $${amount} every ${frequency}`);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md mt-8">
      <h2 className="text-xl font-semibold mb-4">Recurring Donation</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          className="w-full p-2 rounded-xl border border-gray-300"
        />
        <select
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
          className="w-full p-2 rounded-xl border border-gray-300"
        >
          <option value="monthly">Monthly</option>
          <option value="weekly">Weekly</option>
          <option value="annually">Annually</option>
        </select>
        <button
          type="submit"
          className="bg-pink-600 text-white px-6 py-2 rounded-xl w-full hover:bg-pink-700"
        >
          Set Recurring Donation
        </button>
      </form>
    </div>
  );
};

export default RecurringDonationForm;
