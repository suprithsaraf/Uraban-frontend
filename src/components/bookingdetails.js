 import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const BookingDetail = () => {
    const { bookingId } = useParams();
    const [booking, setBooking] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const response = await axios.get(`http://localhost:3017/booking/${bookingId}`, {
                    headers: {
                        Authorization: localStorage.getItem("token")
                    }
                });
                setBooking(response.data.bookingId);
            } catch (err) {
                alert('Failed to fetch booking details');
                console.error(err);
            }
        })();
    }, [bookingId]);

    if (!booking) return <div>Loading...</div>;

    return (
        <div>
            <h2>Booking Details</h2>
            <p>Type: {booking.type}</p>
            <p>Date: {new Date(booking.date).toLocaleDateString()}</p>
            <p>Status: {booking.status}</p>
            {/* Add more details as needed */}
        </div>
    );
}

export default BookingDetail;
