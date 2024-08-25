import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function Service() {
  const initialValues = {
    servicename: '',
    category: '',
    description: [''],
    price: '',
    duration: '',
    address: '',  // Ensure the field name matches with your backend
  };

  const navigate = useNavigate();
  const [serverError, setServerError] = useState(null);

  const validationSchema = Yup.object().shape({
    servicename: Yup.string().required('Service name is required'),
    category: Yup.string().required('Category is required'),
    description: Yup.array()
      .of(Yup.string().required('Description item is required'))
      .min(1, 'At least one description item is required'),
    price: Yup.number()
      .required('Price is required')
      .positive('Price must be positive'),
    duration: Yup.string().required('Duration is required'),
    address: Yup.string().required('Address is required'),  // Match the case with the backend field
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    setServerError(null);
    try {
      const response = await axios.post("http://localhost:3017/service", values, {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      });

  
      if (response.status === 201) {
        toast.success('Service added successfully', {
          autoClose: 1000,
          position: 'top-center',
          pauseOnHover: false,
        });
        navigate('/');  // Navigate to home or another page after success
      } else {
        throw new Error('Service could not be added');
      }
    } catch (errors) {
      console.error("Error details:", errors);  // Log the full error object
      if (errors.response && errors.response.data) {
        console.error("Response data:", errors.response.data);  // Log the server's response data
      }
  
      if (errors.response && errors.response.data && errors.response.data.errors) {
        setServerError(errors.response.data.errors);
      } else {
        setServerError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };
  
  const displayErrors = () => {
    if (!serverError) return null;

    return (
      <div className="alert alert-danger">
        <h3>These errors prohibited the form from being saved:</h3>
        <ul>
          {Array.isArray(serverError) ? (
            serverError.map((ele, i) => <li key={i}>{ele.msg}</li>)
          ) : (
            <li>{serverError}</li>
          )}
        </ul>
      </div>
    );
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Add Service</h1>
      {displayErrors()}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, values, setFieldValue }) => (
          <Form className="bg-light p-4 rounded shadow">
            <div className="mb-3">
              <label htmlFor="servicename" className="form-label">Service Name</label>
              <Field type="text" name="servicename" className="form-control" />
              <ErrorMessage name="servicename" component="div" className="text-danger" />
            </div>

            <div className="mb-3">
              <label htmlFor="category" className="form-label">Category</label>
              <Field as="select" name="category" className="form-select">
                <option value="">Select Category</option>
                <option value="Painting of walls and furniture">Painting of walls and furniture</option>
                <option value="AC Repair and service">AC Repair and service</option>
                <option value="Electrician, plumber & Carpenter">Electrician, plumber & Carpenter</option>
                <option value="Bathroom and Kitchen cleaning">Bathroom and Kitchen cleaning</option>
                <option value="Salon for kids and men">Salon for kids and men</option>
                <option value="Salon for women">Salon for women</option>
              </Field>
              <ErrorMessage name="category" component="div" className="text-danger" />
            </div>

            <div className="mb-3">
              <label htmlFor="description" className="form-label">Description</label>
              {values.description.map((_, index) => (
                <div key={index} className="d-flex mb-2">
                  <Field
                    type="text"
                    name={`description[${index}]`}
                    className="form-control me-2"
                  />
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => {
                      const desc = [...values.description];
                      desc.splice(index, 1);
                      setFieldValue('description', desc);
                    }}
                  >
                    X
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setFieldValue('description', [...values.description, ''])}
              >
                Add Description
              </button>
              <ErrorMessage name="description" component="div" className="text-danger" />
            </div>

            <div className="mb-3">
              <label htmlFor="price" className="form-label">Price</label>
              <Field type="text" name="price" className="form-control" />
              <ErrorMessage name="price" component="div" className="text-danger" />
            </div>

            <div className="mb-3">
              <label htmlFor="duration" className="form-label">Duration</label>
              <Field type="text" name="duration" className="form-control" />
              <ErrorMessage name="duration" component="div" className="text-danger" />
            </div>
            
            <div className="mb-3">
              <label htmlFor="address" className="form-label">Address</label>
              <Field type="text" name="address" className="form-control" />
              <ErrorMessage name="address" component="div" className="text-danger" />
            </div>

            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>Submit</button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
