import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';

export default function ConfirmedBooking() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Destructure and provide default values to avoid undefined issues
  const { bookingId = '', price = '' } = location.state || {};

  const handleGoToPayment = () => {
    if (bookingId && price) {
      navigate(`/bookingpayment/${bookingId}/${price}`);
    } else {
      console.error('Booking ID or price not found');
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6} className="text-center">
          <div className="p-4 border rounded shadow-sm bg-light">
            <h2 className="mb-4">Booking Confirmed!</h2>
            <p className="lead mb-4">Thank you for your booking. Your order has been successfully confirmed.</p>
            <Button variant="primary" onClick={() => navigate('/')}>
              Go to Home
            </Button>
            <Button variant="secondary" onClick={handleGoToPayment} className="ms-2">
              Proceed to Payment
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
