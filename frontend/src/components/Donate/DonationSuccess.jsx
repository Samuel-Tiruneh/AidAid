import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaExclamationTriangle,
  FaCopy
} from 'react-icons/fa';

const DonationSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');
  const [donation, setDonation] = useState(null);
  const [error, setError] = useState(null);
  const retryCount = useRef(0);
  const timeoutRef = useRef(null);

  const tx_ref = searchParams.get('tx_ref') || localStorage.getItem('lastTransactionId');

  const copyToClipboard = () => {
    navigator.clipboard.writeText(tx_ref);
    alert('Transaction reference copied!');
  };

  useEffect(() => {
    if (!tx_ref) {
      navigate('/');
      return;
    }

    const verifyPayment = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/donations/verify?tx_ref=${encodeURIComponent(tx_ref)}`
        );

        const data = await response.json();

        if (!response.ok) {
          console.log('❌ Verification failed:', data);
          throw new Error(data.error || 'Verification failed');
        }

        if (data.verified) {
          console.log('✅ Verification success:', data);
          setStatus('success');
          setDonation(data.donation);
        } else {
          retryCount.current += 1;
          console.log(`🔄 Retry ${retryCount.current} - Not yet verified`);
          if (retryCount.current >= 5) {
            setStatus('timeout');
            return;
          }
          timeoutRef.current = setTimeout(verifyPayment, 3000); // Retry every 3 seconds
        }
      } catch (err) {
        console.error('🚨 Error verifying payment:', err.message);
        setStatus('error');
        setError(err.message);
      }
    };

    verifyPayment();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [tx_ref, navigate]);

  // Verifying
  if (status === 'verifying') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <FaSpinner className="animate-spin text-4xl text-blue-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Verifying Your Payment</h2>
        <p className="mb-2">Please wait while we confirm your transaction...</p>
      </div>
    );
  }

  // Success
  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <FaCheckCircle className="text-6xl text-green-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Payment Confirmed!</h2>
        <div className="bg-gray-50 p-6 rounded-lg max-w-md w-full mt-4 text-left">
          <h3 className="font-semibold mb-3 border-b pb-2">Transaction Details</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="font-medium">Reference:</span>
              <div className="flex items-center">
                <span className="font-mono mr-2">{donation.transactionId}</span>
                <button onClick={copyToClipboard} className="text-blue-500 hover:text-blue-700" title="Copy reference">
                  <FaCopy size={14} />
                </button>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Amount:</span>
              <span>{donation.amount} ETB</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Recipient:</span>
              <span>{donation.recipientName}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Method:</span>
              <span>{donation.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Date:</span>
              <span>{new Date(donation.createdAt).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Status:</span>
              <span className="capitalize">{donation.status}</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate('/')}
          className="mt-8 bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Return Home
        </button>
      </div>
    );
  }

  // Timeout (Webhook delay)
  if (status === 'timeout') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <FaExclamationTriangle className="text-5xl text-yellow-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Payment Processing</h2>
        <p className="mb-4 max-w-md">
          Your payment was successful but verification is taking longer than expected.
          The transaction may appear in your account shortly.
        </p>

        <div className="bg-gray-50 p-4 rounded-lg mb-6 w-full max-w-md">
          <div className="flex justify-between items-center">
            <span className="font-medium">Reference Number:</span>
            <div className="flex items-center">
              <span className="font-mono mr-2">{tx_ref}</span>
              <button onClick={copyToClipboard} className="text-blue-500 hover:text-blue-700" title="Copy reference">
                <FaCopy size={14} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => navigate('/')}
            className="bg-gray-200 text-gray-800 py-2 px-6 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Return Home
          </button>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Check Again
          </button>
        </div>
      </div>
    );
  }

  // Error
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <FaTimesCircle className="text-6xl text-red-500 mb-4" />
      <h2 className="text-2xl font-bold mb-2">Payment Verification Failed</h2>
      <div className="bg-red-50 p-4 rounded-lg max-w-md mb-6 w-full">
        <p className="text-red-600">{error || 'Unknown error occurred'}</p>
        <div className="mt-3 flex justify-between items-center">
          <span className="font-medium">Reference:</span>
          <div className="flex items-center">
            <span className="font-mono mr-2">{tx_ref}</span>
            <button onClick={copyToClipboard} className="text-blue-500 hover:text-blue-700" title="Copy reference">
              <FaCopy size={14} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => navigate('/')}
          className="bg-gray-200 text-gray-800 py-2 px-6 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Return Home
        </button>
        <button
          onClick={() => navigate('/contact')}
          className="bg-red-600 text-white py-2 px-6 rounded-lg hover:bg-red-700 transition-colors"
        >
          Contact Support
        </button>
      </div>
    </div>
  );
};

export default DonationSuccess;
