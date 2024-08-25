import { useState } from "react";
import axios from "axios";
import _ from "lodash";
import validator from "validator";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function ResetPassword() {
  const [form, setForm] = useState({
    email: "",
    otp: "",
    newPassword: "",
    serverError: null,
    clientErrors: {},
  });

 
 
 
  const navigate = useNavigate();

  const runValidations = () => {
    const errors = {};
    if (form.email.trim().length === 0) {
      errors.email = "Email is required";
    } else if (!validator.isEmail(form.email)) {
      errors.email = "Invalid email format";
    }
    if (form.otp.trim().length === 0) {
      errors.otp = "OTP is required";
    }
    if (form.newPassword.trim().length === 0) {
      errors.newPassword = "New password is required";
    } else if (form.newPassword.trim().length < 8 || form.newPassword.trim().length > 128) {
      errors.newPassword = "New password should be between 8 - 128 characters";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = runValidations();
    if (Object.keys(errors).length === 0) {
      try {
        await axios.post(" http://localhost:3017/users/reset-password", _.pick(form, ["email", "otp", "newPassword"]));
        toast.success("Password changed successfully", {
          autoClose: 1000,
          position: "top-center",
          pauseOnHover: false,
        });
        navigate("/login");
      } catch (err) {
        setForm((prevForm) => ({
          ...prevForm,
          serverError: err.response?.data?.errors || "Failed to reset password",
          clientErrors: {},
        }));
      }
    } else {
      setForm((prevForm) => ({
        ...prevForm,
        clientErrors: errors,
        serverError: null,
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm( ({ ...form, [name]: value }));
  };

  const displayErrors = () => {
    if (typeof form.serverError === "string") {
      return <p className="alert alert-danger">{form.serverError}</p>;
    } else if (Array.isArray(form.serverError)) {
      return (
        <div className="alert alert-danger">
          <h4>These errors prohibited the form from being saved:</h4>
          <ul>
            {form.serverError.map((error, i) => (
              <li key={i}>{error.msg}</li>
            ))}
          </ul>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="container">
      <h1 className="text-center mb-4">Reset Password</h1>
      {form.serverError && displayErrors()}
      <div className="bg-light p-4 rounded shadow">
        <form onSubmit={handleSubmit} className="mb-3">
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Enter Email
            </label>
            <input
              type="email"
              className="form-control"
              value={form.email}
              id="email"
              name="email"
              onChange={handleChange}
            />
            {form.clientErrors.email && <span className="text-danger">{form.clientErrors.email}</span>}
          </div>
          <div className="mb-3">
            <label htmlFor="otp" className="form-label">
              Enter OTP
            </label>
            <input
              type="text"
              className="form-control"
              value={form.otp}
              id="otp"
              name="otp"
              onChange={handleChange}
            />
            {form.clientErrors.otp && <span className="text-danger">{form.clientErrors.otp}</span>}
          </div>
          <div className="mb-3">
            <label htmlFor="newPassword" className="form-label">
              Enter New Password
            </label>
            <input
              type="password"
              className="form-control"
              value={form.newPassword}
              id="newPassword"
              name="newPassword"
              onChange={handleChange}
            />
            {form.clientErrors.newPassword && <span className="text-danger">{form.clientErrors.newPassword}</span>}
          </div>
          <button type="submit" className="btn btn-primary">
            Reset
          </button>
        </form>
      </div>
    </div>
  );
}
