import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { toast } from "react-toastify";
import validator from "validator";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');
  const [adminExists, setAdminExists] = useState(false); 
  const [serverErrors, setServerErrors] = useState(null);
  const [clientErrors, setClientErrors] = useState({});

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = await axios.get('http://localhost:3017/users/admin');
        setAdminExists(response.data.adminExists);
      } catch (err) {
        console.error("Error checking admin existence:", err);
      }
    };

    checkAdmin();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      username,
      email,
      password,
      role
    };

    const errors = {};

    const runValidations = () => {
      if (username.trim().length === 0) {
        errors.username = 'Username is required';
      }
      if (email.trim().length === 0) {
        errors.email = 'Email is required';
      } else if (!validator.isEmail(email)) {
        errors.email = 'Email should be valid';
      }
      if (password.trim().length === 0) {
        errors.password = 'Password is required';
      } else if (password.trim().length < 8 || password.trim().length > 128) {
        errors.password = 'Password should be between 8-128 characters';
      }
      if (role.trim().length === 0) {
        errors.role = 'Role is required';
      }
      if (phone.trim().length === 0) {
        errors.phone = "Phone number is required";
      }
    };

    runValidations();
    if (Object.keys(errors).length === 0) {
      try {
        await axios.post('http://localhost:3017/users/register', formData);
        toast.success('🎉 Registration Successful!', {
          autoClose: 1000,
          position: 'top-center',
          pauseOnHover: false,
        });
        navigate("/login");
      } catch (err) {
        setServerErrors(err.response.data.errors);
      }
    } else {
      setClientErrors(errors);
    }
  };

  const handleEmail = async () => {
    if (validator.isEmail(email)) {
      const response = await axios.get(`http://localhost:3017/users/checkemail?email=${email}`);
      if (response.data.is_email_registered) {
        setClientErrors({ email: '🚫 Email is already registered' });
      }
    }
  };

  return (
    <div className="container-fluid" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <div className="row justify-content-center align-items-center h-100">
        <div className="col-lg-6 col-md-8 col-sm-10">
          <div className="card shadow-lg">
            <div className="card-body p-4">
              <h2 className="card-title text-center mb-4">📝 Register</h2>

              {serverErrors && (
                <div className="alert alert-danger">
                  <h4 className="alert-heading">❗ Errors:</h4>
                  <ul>
                    {serverErrors.map((ele, i) => (
                      <li key={i}>{ele.msg}</li>
                    ))}
                  </ul>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">👤 Username</label>
                  <input 
                    type="text" 
                    className={`form-control ${clientErrors.username ? 'is-invalid' : ''}`} 
                    id="username" 
                    value={username} 
                    placeholder="Enter Username"
                    onChange={(e) => setUsername(e.target.value)} 
                  />
                  {clientErrors.username && <div className="invalid-feedback">{clientErrors.username}</div>}
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">📧 Email</label>
                  <input 
                    type="email" 
                    className={`form-control ${clientErrors.email ? 'is-invalid' : ''}`} 
                    id="email" 
                    value={email} 
                    placeholder="Enter Email"
                    onChange={(e) => setEmail(e.target.value)} 
                    onBlur={handleEmail} 
                  />
                  {clientErrors.email && <div className="invalid-feedback">{clientErrors.email}</div>}
                </div>

                <div className="mb-3">
                  <label htmlFor="phone" className="form-label">📱 Phone Number</label>
                  <input 
                    type="text" 
                    className={`form-control ${clientErrors.phone ? 'is-invalid' : ''}`} 
                    id="phone" 
                    value={phone} 
                    placeholder="Enter Phone Number"
                    onChange={(e) => setPhone(e.target.value)} 
                  />
                  {clientErrors.phone && <div className="invalid-feedback">{clientErrors.phone}</div>}
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">🔑 Password</label>
                  <input 
                    type="password" 
                    className={`form-control ${clientErrors.password ? 'is-invalid' : ''}`} 
                    id="password" 
                    value={password} 
                    placeholder="Enter Password"
                    onChange={(e) => setPassword(e.target.value)} 
                  />
                  {clientErrors.password && <div className="invalid-feedback">{clientErrors.password}</div>}
                </div>

                <div className="mb-4">
                  <label htmlFor="role" className="form-label">💼 Role</label>
                  <select
                    id="role"
                    className={`form-select ${clientErrors.role ? 'is-invalid' : ''}`}
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="">Select Role</option>
                    {!adminExists && <option value="admin">Admin</option>}
                    <option value="serviceprovider">Service Provider</option>
                    <option value="customer">Customer</option>
                  </select>
                  {clientErrors.role && <div className="invalid-feedback">{clientErrors.role}</div>}
                </div>

                <button type="submit" className="btn btn-primary w-100">🚀 Register</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
