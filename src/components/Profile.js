import React, { useState } from 'react';
import axios from 'axios';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        address: '',
        profilePic: null,
        aadhaarPhoto: null,
    });

    const [errors, setErrors] = useState({});
    const [serverErrors, setServerErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const validationSchema = Yup.object().shape({
        firstName: Yup.string().required('First Name is required'),
        lastName: Yup.string().required('Last Name is required'),
        address: Yup.string().required('Address is required'),
        phone: Yup.string().required('Phone is required'),
        profilePic: Yup.mixed()
            .test('fileType', 'Image must be jpeg or png', value => 
                !value || ['image/jpeg', 'image/png'].includes(value?.type)
            ),
        aadhaarPhoto: Yup.mixed()
            .test('fileType', 'Image must be jpeg or png', value => 
                !value || ['image/jpeg', 'image/png'].includes(value?.type)
            ),
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await validationSchema.validate(form, { abortEarly: false });
            console.log('Validation successful');

            setIsLoading(true);

            const formData = new FormData();
            formData.append('firstName', form.firstName);
            formData.append('lastName', form.lastName);
            formData.append('address', form.address);
            formData.append('phone', form.phone);

            if (form.profilePic) formData.append('profilePic', form.profilePic);
            if (form.aadhaarPhoto) formData.append('aadhaarPhoto', form.aadhaarPhoto);

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: localStorage.getItem('token')
                }
            };

            const response = await axios.post('http://localhost:3017/provider/profile', formData, config);
            console.log('Response:', response.data);

            toast.success('Profile created successfully');
            
            setTimeout(() => navigate('/account'), 1000);

        } catch (err) {
            if (err.response) {
                console.error('Server Error:', err.response.data);
                setServerErrors(err.response.data.errors || { _error: 'Failed to save profile' });
            } else if (err.inner) {
                const formErrors = {};
                err.inner.forEach(err => {
                    formErrors[err.path] = err.message;
                });
                setErrors(formErrors);
            } else {
                console.error('Error saving profile:', err.message);
                setServerErrors({ _error: 'Failed to save profile' });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value
        });
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;

        if (files && files.length > 0) {
            setForm({
                ...form,
                [name]: files[0]
            });
        }
    };

    return (
        <div className="container" style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '10px' }}>
            <div className="row justify-content-center mt-5">
                <div className="col-md-6">
                    <h4 className="text-center" style={{ color: 'red' }}>
                        Create Profile
                    </h4>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="firstName"><strong>First Name:</strong></label>
                            <input
                                type="text"
                                name="firstName"
                                value={form.firstName}
                                onChange={handleInputChange}
                                placeholder='Enter First Name'
                                className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                                disabled={isLoading}
                            />
                            {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="lastName"><strong>Last Name:</strong></label>
                            <input
                                type="text"
                                name="lastName"
                                value={form.lastName}
                                onChange={handleInputChange}
                                placeholder='Enter Last Name'
                                className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                                disabled={isLoading}
                            />
                            {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="address"><strong>Address:</strong></label>
                            <input
                                type="text"
                                name="address"
                                value={form.address}
                                onChange={handleInputChange}
                                placeholder='Enter Address'
                                className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                                disabled={isLoading}
                            />
                            {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="phone"><strong>Phone:</strong></label>
                            <input
                                type="text"
                                name="phone"
                                value={form.phone}
                                onChange={handleInputChange}
                                placeholder='Enter Phone Number'
                                className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                                disabled={isLoading}
                            />
                            {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="profilePic"><strong>Profile Picture:</strong></label>
                            <input
                                type="file"
                                name="profilePic"
                                onChange={handleFileChange}
                                className={`form-control ${errors.profilePic ? 'is-invalid' : ''}`}
                                disabled={isLoading}
                            />
                            {errors.profilePic && <div className="invalid-feedback">{errors.profilePic}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="aadhaarPhoto"><strong>Aadhaar Photo:</strong></label>
                            <input
                                type="file"
                                name="aadhaarPhoto"
                                onChange={handleFileChange}
                                className={`form-control ${errors.aadhaarPhoto ? 'is-invalid' : ''}`}
                                disabled={isLoading}
                            />
                            {errors.aadhaarPhoto && <div className="invalid-feedback">{errors.aadhaarPhoto}</div>}
                        </div>
                        <div className="text-center mt-4">
                            <button type="submit" className="btn btn-primary" disabled={isLoading}>
                                Save
                            </button>
                        </div>
                        {serverErrors._error && <div className="text-danger text-center mt-2">{serverErrors._error}</div>}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
