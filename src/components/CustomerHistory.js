import axios from 'axios';
import { useState, useEffect } from 'react';
import { useAuth } from '../Context/AuthContext';
import '../CustomerHistory.css';

export default function CustomerHistory() {
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user || !user.account) {
        console.error('User object or user account is missing.');
        setLoading(false);
        return;
      }
  
      if (user.account.role !== 'customer') {
        console.error('User is not a customer.');
        setLoading(false);
        return;
      }
  
      try {
        const customerId = user.account._id;
  
        if (customerId) {
          const response = await axios.get(`http://localhost:3017/customer-history/${customerId}/history`);
          console.log('Fetched history:', response.data.bookings);
          setHistory(response.data.bookings);
        } else {
          console.error('Customer ID is not available.');
        }
      } catch (error) {
        console.error('Error fetching customer history:', error.response ? error.response.data : error.message);
      } finally {
        setLoading(false);
      }
    };
  
    if (user) {
      fetchHistory();
    }
  }, [user]);

  const handleViewMore = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!history) {
    return <p>No history found.</p>;
  }

  return (
    <div className="customer-history">
      <h1>Customer History</h1>
      <ul>
        {history.length > 0 ? (
          history.map((booking, index) => (
            <li key={booking._id} className={expandedIndex === index ? 'show-info' : ''}>
              <p className="highlight-username">Username: {user.account.username}</p>
              <p className="highlight-email">Email: {user.account.email}</p>
              {/* <p className="highlight-phone">Phone: {user.account.phone}</p> */}
              <p className="highlight-service">Service: {booking.serviceProviderId?.servicename}</p>
              <p className="highlight-date">Date: {new Date(booking.date).toLocaleDateString()}</p>
              <p className="highlight-status">Status: {booking.status}</p>
              <div className="hidden-info">
                <p className="highlight-price">Price: {booking.price}</p>
                <p className='highlight-Customer-ID'>Customer ID :{booking.customerId} </p>
                <p className='highlight-payment-status'>Payment Status: {booking.payment?.paymentStatus}</p>
                <p className='highlight-payment-type'> Payment Type: {booking.payment?.paymentType}</p>
                <p className='highlight-TransactionID'>TransactionID : {booking.payment?.transactionId}</p>


              </div>
              <button
                className="view-more-button"
                onClick={() => handleViewMore(index)}
              >
                {expandedIndex === index ? 'View Less' : 'View More'}
              </button>
            </li>
          ))
        ) : (
          <p>No bookings found.</p>
        )}
      </ul>
    </div>
  );
}
