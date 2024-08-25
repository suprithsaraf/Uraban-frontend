import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../Context/AuthContext';
import { Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function AllService() {
  const { user } = useAuth();
  const [service, setService] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const allService = await axios.get('http://localhost:3017/service', {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        });
        setService(allService.data);
        console.log(allService.data); // Check the response here
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
    fetchServices();
  }, []);

  const handleRemove = async (id) => {
    try {
      await axios.delete(`http://localhost:3017/service/${id}`, {
        headers: {
          Authorization: localStorage.getItem('token'),
        }
      });
      setService(service.filter((ele) => ele._id !== id));
    } catch (err) {
      console.error("Error removing service:", err);
    }
  };

  return (
    <div className="container mt-5" style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
      {service.length === 0 ? (
        <div className="text-center">
          <h3 className="text-danger">No service found</h3>
        </div>
      ) : (
        <div className="row">
          {service.map((ele) => (
            <div className="col-md-4 mb-4" key={ele._id}>
              <div className="card shadow-sm h-100">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title text-primary">{ele.servicename}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">
                    Price - ₹{ele.price} {ele.duration}
                  </h6>
                  <h6 className="card-subtitle mb-2 text-secondary">
                    Category - {ele.servicename || 'Not specified'}
                  </h6>
                  <ul className="list-unstyled mb-3">
                    {Array.isArray(ele.description) ? (
                      ele.description.map((desc, i) => (
                        <li key={i}><strong>Description:</strong> {desc}</li>
                      ))
                    ) : (
                      <li><strong>Description:</strong> {ele.description}</li>
                    )}
                  </ul>
                  <div className="mt-auto">
                    {user.account.role === "serviceprovider" && (
                      <Button color="danger" onClick={() => handleRemove(ele._id)} className="w-100">
                        Remove
                      </Button>
                    )}
                    {user.account.role === "customer" && (
                      <Button color="primary" tag={Link} to={`/booking/${ele._id}`} className="w-100 text-white">
                        Book
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
