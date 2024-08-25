import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from "../Context/AuthContext";
import validator from "validator";
import 'bootstrap/dist/css/bootstrap.min.css';
import "../Login.css"; // Import your custom CSS file

export default function Login() {
    const navigate = useNavigate();
    const { dispatch } = useAuth();
    const [form, setForm] = useState({
        email: "",
        password: "",
        serverErrors: null,
        clientErrors: {}
    });

    const errors = {};

    const runValidations = () => {
        if (form.email.trim().length === 0) {
            errors.email = 'Email is required';
        } else if (!validator.isEmail(form.email)) {
            errors.email = 'Email must be valid';
        }
        if (form.password.trim().length === 0) {
            errors.password = 'Password is required';
        } else if (form.password.trim().length < 8 || form.password.trim().length > 128) {
            errors.password = 'Password must be between 8 and 128 characters';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = { email: form.email, password: form.password };
        runValidations();

        if (Object.keys(errors).length === 0) {
            try {
                const response = await axios.post('http://localhost:3017/users/login', formData);
                localStorage.setItem('token', response.data.token);
                toast.success('🎉 Login successful', {
                    autoClose: 1000,
                    position: 'top-center',
                    pauseOnHover: false,
                });
                const userResponse = await axios.get('http://localhost:3017/users/account', {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                });
                dispatch({ type: 'LOGIN', payload: { account: userResponse.data } });
                navigate('/');
            } catch (err) {
                setForm({ ...form, serverErrors: err.response.data.errors });
            }
        } else {
            setForm({ ...form, clientErrors: errors });
        }
    };

    const handleChange = (e) => {
        const { value, name } = e.target;
        setForm({ ...form, [name]: value });
    };

    const displayErrors = () => {
        if (typeof form.serverErrors === 'string') {
            return <p>{form.serverErrors}</p>;
        } else {
            return (
                <div>
                    <h4 className="text-danger">⚠️ These errors prevented the form from being submitted:</h4>
                    <ul>
                        {form.serverErrors.map((ele, i) => (
                            <li key={i}>{ele.msg}</li>
                        ))}
                    </ul>
                </div>
            );
        }
    };

    return (
        <div className="login-background">
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-6 col-lg-4">
                        <div className="card shadow-sm border-primary">
                            <div className="card-body p-4">
                                <h2 className="card-title text-center mb-4">🔑 Login</h2> {/* Added a "key" emoji */}

                                {form.serverErrors && (
                                    <div className="alert alert-danger">
                                        {displayErrors()}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">📧 Email</label> {/* Added an "email" emoji */}
                                        <input 
                                            type="email" 
                                            className={`form-control ${form.clientErrors.email ? 'is-invalid' : ''}`} 
                                            id="email" 
                                            name="email" 
                                            value={form.email} 
                                            onChange={handleChange} 
                                            placeholder="Enter your email"
                                        />
                                        {form.clientErrors.email && <div className="invalid-feedback">{form.clientErrors.email}</div>}
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label">🔒 Password</label> {/* Added a "lock" emoji */}
                                        <input 
                                            type="password" 
                                            className={`form-control ${form.clientErrors.password ? 'is-invalid' : ''}`} 
                                            id="password" 
                                            name="password" 
                                            value={form.password} 
                                            onChange={handleChange} 
                                            placeholder="Enter your password"
                                        />
                                        {form.clientErrors.password && <div className="invalid-feedback">{form.clientErrors.password}</div>}
                                    </div>

                                    <button type="submit" className="btn btn-primary w-100">🚀 Login</button> {/* Added a "rocket" emoji */}
                                </form>

                                <div className="mt-3 text-center">
                                    <Link to="/forgetPassword" className="text-primary"> Forgot Password❓</Link> {/* Added a "question mark" emoji */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
