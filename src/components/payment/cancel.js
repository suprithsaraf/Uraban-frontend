import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Cancel() {
    const navigate=useNavigate()
  useEffect(() => {
    const stripeId = localStorage.getItem('stripeId');

    // Ensure stripeId is not null or undefined
    if (stripeId) {
      (async () => {
        try {
          const response = await axios.put(`http://localhost:3017/paymentfailed/${stripeId}`);
          console.log('Response from stripe put request:', response.data);
          const bookingId = response.data.bookingId;
          // Optionally update the booking status in your own backend
          // const updatedBooking = await axios.put(`http://localhost:3045/api/payment/failer/${bookingId}`);
          // console.log("Update response:", updatedBooking.data);
        } catch (err) {
          console.error('Error updating payment status:', err);
        }
      })();
    } else {
      console.error('No stripeId found in localStorage');
    }
  }, []);

  return (
    <div className="container" style={{ paddingTop: '80px' }}>
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header bg-danger text-white">
              <h4 className="mb-0">Payment Failed</h4>
            </div>
            <div className="card-body text-center">
              <p className="lead">Unfortunately, your payment could not be processed.</p>
              <p className="text-muted">Please try again later or contact support.</p>
              <button className="btn btn-primary mt-3" onClick={() => window.location.reload()}>
                Try Again
              </button>{' '}

              <button className="btn btn-primary mt-3" onClick={() => navigate('/')}>
              Go to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
