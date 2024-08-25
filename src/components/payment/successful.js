import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Success() {
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const stripeId = localStorage.getItem('stripeId');

  useEffect(() => {
    if (stripeId) {
      (async () => {
        try {
          const response = await axios.put(`http://localhost:3017/api/payment/status/update/${stripeId}`);
          console.log('Response from Stripe put request', response.data);

          if (response.data && response.data.bookingId) {
            setSuccess(response.data);
          } else {
            setError('Booking ID not found in response');
          }
        } catch (err) {
          console.error('Error fetching payment status:', err);
          setError('Failed to fetch payment status');
        } finally {
          setLoading(false);
        }
      })();
    } else {
      setError('Stripe ID is missing');
      setLoading(false);
    }
  }, [stripeId]);

  if (loading) {
    return <div className="container mt-5 text-center"><p>Loading...</p></div>;
  }

  if (error) {
    return (
      <div className="container mt-5 text-center">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error</h4>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 text-center">
          <div className="alert alert-success" role="alert">
            <h4 className="alert-heading">Payment Successful!</h4>
            <p>Your payment has been processed successfully. Thank you for your booking.</p>
            <hr />
            {success && success.bookingId && (
              <p className="mb-0">Booking ID: {success.bookingId}</p>
            )}
            <button className="btn btn-primary mt-3" onClick={() => navigate('/')}>Go to Home</button>
          </div>
        </div>
      </div>
    </div>
  );
}
