
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function BookingPayment() {
  const { bookingId, price } = useParams();
  const [paymentAmount, setPaymentAmount] = useState(price || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (bookingId && price) {
      setPaymentAmount(price);
    } else {
      console.error('URL parameters are missing.');
    }
  }, [bookingId, price]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const paymentForm = {
      bookingId: bookingId,
      amount: Number(paymentAmount)
    };

    try {
      const response = await axios.post('http://localhost:3017/api/create-checkout-session', paymentForm, {
        headers: {
          Authorization: localStorage.getItem("token")
        }
      });

      // Store the transaction ID in local storage
      localStorage.setItem('stripeId', response.data.id);

      // Redirect the user to the checkout page of Stripe
      window.location.href = response.data.url;

    } catch (err) {
      setError('Failed to initiate payment. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '80px' }}>
      <form onSubmit={handleSubmit}>
        <h2>Payment Method</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="mb-3">
          <label className="form-label">Booking ID</label>
          <input type="text" className="form-control" value={bookingId || ''} readOnly />
        </div>
        <div className="mb-3">
          <label className="form-label">Amount</label>
          <input type="text" className="form-control" value={paymentAmount || ''} readOnly />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Processing...' : 'Pay'}
        </button>
      </form>
    </div>
  );
}
