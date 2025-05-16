
const crypto = require('crypto');
const axios = require('axios');

const CHAPA_SECRET_KEY = process.env.CHAPA_SECRET_KEY;
const BASE_URL = 'https://api.chapa.co/v1/transaction/initialize';

const initiateChapaPayment = async (donation) => {
  try {
    const tx_ref = `TXN-${Date.now()}`;
    const [firstName, ...lastNameParts] = donation.fullName.split(' ');
    const lastName = lastNameParts.join(' ') || 'Donor';

    const payload = {
      amount: Number(donation.amount).toFixed(2),
      currency: 'ETB',
      email: `${donation.phone.replace(/\D/g, '')}@donor.com`,
      first_name: firstName,
      last_name: lastName,
      phone_number: donation.phone.replace(/^0/, '+251'),
      tx_ref,
      callback_url: 'https://1afe-196-188-253-129.ngrok-free.app/api/webhooks/chapa',
       return_url: 'http://localhost:5173/donation-success',
      customization: {
        title: "Tsedy Aid", // Max 16 chars
        description: "Donation", // Generic description
      }
    };

    const response = await axios.post(BASE_URL, payload, {
      headers: {
        Authorization: `Bearer ${CHAPA_SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.data.status !== 'success') {
      throw new Error(`Chapa error: ${JSON.stringify(response.data.message)}`);
    }

    return {
      tx_ref,
      data: response.data.data
    };
  } catch (error) {
    console.error('Chapa Error:', error.response?.data || error.message);
    throw new Error('Payment initiation failed. Please try again.');
  }
};

module.exports = { initiateChapaPayment };
