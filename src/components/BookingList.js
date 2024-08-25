import axios from "axios";
import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Spinner, Alert, Pagination } from "react-bootstrap";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../bookings.css"; // Import custom CSS

export default function BookingList() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const serviceId = 'your_service_id'; // Replace with actual service ID or get it from context

  useEffect(() => {
    fetchBookings(currentPage);
  }, [currentPage]);

  const fetchBookings = async (page) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3017/booking?page=${page}&limit=3`, {
        headers: {
          Authorization: localStorage.getItem('token')
        }
      });

      console.log('API Response:', response.data); // Check this to ensure `serviceName` is present

      const bookings = response.data.bookings.map(booking => ({
        ...booking,
        servicename: booking.servicename || 'Service name not available' // Ensure serviceName is included
      }));
      setBookings(bookings);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      setError('Failed to fetch bookings');
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (bookingId) => {
    try {
      const response = await axios.put(
        `http://localhost:3017/booking/provider/${serviceId}/booking/${bookingId}`,
        {
          isAccepted: true,
          status: 'successful',
        },
        {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        }
      );

      if (response.status === 200) {
        const updatedBooking = response.data;
        setBookings(bookings.map(booking =>
          booking._id === bookingId ? { ...updatedBooking } : booking
        ));
        toast.success('Booking accepted successfully!');
      } else {
        toast.error('Failed to accept booking.');
      }
    } catch (err) {
      setError('Failed to accept booking');
      console.error('Error during booking acceptance:', err);
      toast.error('Failed to accept booking.');
    }
  };

  const handleReject = async (bookingId) => {
    try {
      await axios.delete(`http://localhost:3017/booking/${bookingId}`, {
         
        headers: {
          Authorization: localStorage.getItem('token')
        }
        
      });
      setBookings(bookings.filter(booking => booking._id !== bookingId));
      toast.success('Booking rejected successfully!');
    } catch (err) {
      setError('Failed to reject booking');
      console.error(err);
      toast.error('Failed to reject booking.');
    }
  };

  if (loading) {
    return (
      <Container className="loading-container">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert variant="danger" className="error-alert">{error}</Alert>
      </Container>
    );
  }

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <Container className="booking-list-container">
      <h2 className="header">Booking List ({bookings.length})</h2>
      <Row>
        {bookings.map((booking) => (
          <Col key={booking._id} xs={12} md={6} lg={4} className="booking-col">
            <Card className="booking-card">
              <Card.Body>
                <Card.Title className="booking-card-title">Booking ID: {booking._id}</Card.Title>
                <Card.Text>
                  <strong className="highlight">Service Name:</strong> {booking.serviceProviderId?.servicename || 'Service name not available'}<br />
                  <strong>Customer Username:</strong> {booking.customerId?.username || 'Username not available'}<br />
                  <strong>Customer Email:</strong> {booking.customerId?.email || 'Email not available'}<br />
                  <strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}<br />
                  <strong>Description:</strong> {booking.description || 'Description not available'}<br />
                  <strong>Price:</strong> {booking.price}<br />
                  <strong>Booking Status:</strong> <span className={booking.status === 'successful' ? 'status-success' : 'status-warning'}>{booking.status}</span><br />
                  <strong>Accepted:</strong> {booking.isAccepted ? 'Yes' : 'No'}<br />
                </Card.Text>

                {!booking.isAccepted && (
                  <div className="button-container">
                    <Button className="accept-button" onClick={() => handleAccept(booking._id)}>
                      Accept Booking
                    </Button>
                    <Button className="reject-button" onClick={() => handleReject(booking._id)}>
                      Reject Booking
                    </Button>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <Pagination className="pagination-container">
        {Array.from({ length: totalPages }, (_, index) => (
          <Pagination.Item
            key={index + 1}
            className="pagination-item"
            active={index + 1 === currentPage}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </Pagination.Item>
        ))}
      </Pagination>
    </Container>
  );
}
