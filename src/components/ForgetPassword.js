
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import {  useNavigate } from 'react-router-dom';
export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [model,setModel]=useState(true)

  const navigate=useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        await axios.post(`http://localhost:3017/users/forgot-password`, { email });
        toast.success('OTP sent to email', {  
        autoClose: 1000,
        position: "top-center",
        pauseOnHover: false, });
      navigate('/resetpassword')
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('Failed to send OTP');
      }
    }
  };
  const closeModal=()=>{
    setModel(!model)
  }

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card mt-4">
            <div className="card-header">
              <h5>Forgot Password</h5>
            </div>
            <div className="bg-light p-4 rounded shadow">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="email">Enter Email</label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="form-control"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mt-3">
                  {error && <div className="alert alert-danger">{error}</div>}
                </div>
                <div className="mt-3">
                  <button type="submit" className="btn btn-primary">
                    Submit
                  </button>{' '}
                  <button type="button" className="btn btn-secondary ml-2" onClick={closeModal}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
