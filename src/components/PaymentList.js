import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../paymentList.css'; // Import the CSS file

export default function PaymentHistory() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3017/api/payment/list', {
        headers: {
            Authorization: localStorage.getItem('token')
        }
    })
      .then(response => {
        setPayments(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the payment history!', error);
      });
  }, []);

  return (
    <div className="payment-history">
      <h2>Payment History</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Customer Name</th>
            <th>Customer Email</th>
            <th>Date</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Method</th>
          </tr>
        </thead>
        <tbody>
          {payments.length > 0 ? (
            payments.map(payment => (
              <tr key={payment._id}>
                <td>{payment.customer?.username}</td> 
                <td>{payment.customer?.email}</td> 
                <td>{new Date(payment.createdAt).toLocaleDateString()}</td>
                <td>₹ {payment.amount.toFixed(2)}</td>
                <td>{payment.paymentStatus}</td>
                <td>{payment.paymentType}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No payment history available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
