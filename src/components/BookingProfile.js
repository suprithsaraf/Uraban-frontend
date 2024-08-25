import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import validator from "validator";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MapWithMarker = ({ location }) => {
  const map = useMap();

  useEffect(() => {
    if (location) {
      map.setView(location, 13); // Adjust zoom level as needed
    }
  }, [location, map]);

  return (
    <Marker position={location} icon={L.divIcon({ className: 'custom-icon', html: '👤' })}>
      <Popup>Your current location</Popup>
    </Marker>
  );
};

export default function BookingProfile() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [serverErrors, setServerErrors] = useState(null);
  const [clientErrors, setClientErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [bookingId, setBookingId] = useState('');
  const [location, setLocation] = useState(null); // Initialize as null
  const [currentLocationMessage, setCurrentLocationMessage] = useState('');
  const navigate = useNavigate();
  const { serviceId } = useParams();

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await axios.get(`http://localhost:3017/service/${serviceId}`, {
          headers: {
            Authorization: localStorage.getItem("token")
          }
        });
        setPrice(response.data.price || '');
      } catch (err) {
        console.error('Error fetching service price:', err);
      }
    };

    fetchPrice();
  }, [serviceId]);

  const fetchAddressFromLocation = async (lat, lon) => {
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
      console.log('Fetched address:', response.data.display_name); // Debugging
      setAddress(response.data.display_name || 'Unknown address');
    } catch (error) {
      console.error('Error fetching address:', error);
      setAddress('Unable to fetch address');
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log('Current location coordinates:', latitude, longitude); // Debugging
          setLocation([latitude, longitude]);
          setCurrentLocationMessage('Here is your current location.');
          fetchAddressFromLocation(latitude, longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
          setCurrentLocationMessage('Unable to retrieve location.');
        },
        {
          enableHighAccuracy: true,
          maximumAge: 10000,
          timeout: 10000
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      setCurrentLocationMessage('Geolocation is not supported by this browser.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = { username, email, address, phone, date, description, price };
    const errors = {};
  
    const runValidations = () => {
      if (username.trim().length === 0) errors.username = 'Username is required';
      if (email.trim().length === 0) errors.email = 'Email is required';
      else if (!validator.isEmail(email)) errors.email = 'Email should be valid';
      if (address.trim().length === 0) errors.address = 'Address is required';
      if (phone.trim().length === 0) errors.phone = 'Phone is required';
      if (date.trim().length === 0) errors.date = 'Date is required';
      else {
        const inputDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time for comparison
        if (inputDate < today) errors.date = 'Date cannot be in the past';
      }
      if (description.trim().length === 0) errors.description = 'Description is required';
    };
  
    runValidations();
  
    if (Object.keys(errors).length === 0) {
      try {
        const response = await axios.post(`http://localhost:3017/booking/${serviceId}`, formData, {
          headers: {
            Authorization: localStorage.getItem("token")
          }
        });
        const { _id, price } = response.data;
  
        setBookingId(_id);
        setShowModal(true);
      } catch (err) {
        setServerErrors(err.response.data.errors);
      }
    } else {
      setClientErrors(errors);
    }
  };
  

  const handleModalClose = () => setShowModal(false);
  const handleProceedToPayment = () => {
    navigate(`/bookingpayment/${bookingId}/${price}`);
    handleModalClose();
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Booking Profile</h2>

      {serverErrors && (
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">These errors are prohibiting the form from being saved:</h4>
          <ul>
            {serverErrors.map((ele, i) => (
              <li key={i}>{ele.msg}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Enter username</label>
          <input
            type="text"
            value={username}
            id="username"
            placeholder="Enter username"
            onChange={(e) => setUsername(e.target.value)}
            className="form-control"
          />
          {clientErrors.username && <div className="text-danger">{clientErrors.username}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">Enter email</label>
          <input
            type="text"
            value={email}
            id="email"
            placeholder="Enter email"
            onChange={(e) => setEmail(e.target.value)}
            className="form-control"
          />
          {clientErrors.email && <div className="text-danger">{clientErrors.email}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="address" className="form-label">Enter Address</label>
          <input
            type="text"
            value={address}
            id="address"
            placeholder="Enter address"
            onChange={(e) => setAddress(e.target.value)}
            className="form-control"
          />
          {clientErrors.address && <div className="text-danger">{clientErrors.address}</div>}
        </div>

        <button type="button" className="btn btn-secondary mb-3" onClick={getCurrentLocation}>
          Use My Location
        </button>

        <div className="mb-3">
          <label htmlFor="phone" className="form-label">Enter Phone</label>
          <input
            type="number"
            value={phone}
            id="phone"
            placeholder="Enter phone"
            onChange={(e) => setPhone(e.target.value)}
            className="form-control"
          />
          {clientErrors.phone && <div className="text-danger">{clientErrors.phone}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="date" className="form-label">Enter Date</label>
          <input
            type="date"
            value={date}
            id="date"
            placeholder="Enter date"
            onChange={(e) => setDate(e.target.value)}
            className="form-control"
          />
          {clientErrors.date && <div className="text-danger">{clientErrors.date}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label">Enter Description</label>
          <textarea
            value={description}
            id="description"
            placeholder="Enter description"
            onChange={(e) => setDescription(e.target.value)}
            className="form-control"
          />
          {clientErrors.description && <div className="text-danger">{clientErrors.description}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="price" className="form-label">Price</label>
          <input
            type="text"
            value={price}
            id="price"
            placeholder="Price"
            className="form-control"
            readOnly
          />
        </div>

        <button type="submit" className="btn btn-primary">Submit</button>
      </form>

      {location && (
        <div className="mt-4">
          <MapContainer center={location} zoom={13} style={{ height: "400px", width: "100%" }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <MapWithMarker location={location} />
          </MapContainer>
          <p>{currentLocationMessage}</p>
        </div>
      )}

      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Booking Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Your booking has been successfully created.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleProceedToPayment}>
            Proceed to Payment
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
