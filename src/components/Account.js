import axios from "axios";
import { useState, useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import 'bootstrap/dist/css/bootstrap.min.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Account() {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const { user } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (user && user.account && user.account.role === "serviceprovider") {
          const token = localStorage.getItem('token');
          
          if (!token) {
            throw new Error("No token found in localStorage");
          }

          const response = await axios.get('http://localhost:3017/profile/allserviceprovider', {
            headers: {
              Authorization: token,
            },
          });

          if (response.data && response.data) {
            setProfile(response.data.profile);
            setFormData(response.data.profile); // Set form data for editing
          } else {
            console.error("Profile data is missing or empty in response");
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error.message || error);
      }
    };

    if (user && user.account) {
      fetchProfile();
    }
  }, [user]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      setFormData((prevState) => ({
        ...prevState,
        [name]: files[0]
      }));
    }
  };
  const handleSave = async () => {
  try {
    const token = localStorage.getItem('token');
    const formDataToSend = new FormData();
    for (const key in formData) {
      if (formData[key] !== null) {
        formDataToSend.append(key, formData[key]);
      }
    }

    const response = await axios.put('http://localhost:3017/provider/Updateprofile', formDataToSend, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: token,
      },
    });

    if (response.data) {
      setProfile(response.data); // Update profile with the latest data
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } else {
      toast.error('Failed to update profile. Please try again.');
    }
  } catch (error) {
    console.error('Error updating profile:', error.response?.data || error.message || error);
    toast.error('Error updating profile. Please try again.');
  }
};


  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Account Details</h2>
              {profile ? (
                <div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <p><strong>First Name:</strong> 
                        {isEditing ? 
                          <input 
                            type="text" 
                            name="firstName" 
                            value={formData.firstName || ''} 
                            onChange={handleChange} 
                            className="form-control" 
                          /> 
                          : profile.firstName || "Not available"
                        }
                      </p>
                    </div>
                    <div className="col-md-6">
                      <p><strong>Email:</strong> {user.account.email || "Not available"}</p>
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <p><strong>Phone:</strong> 
                        {isEditing ? 
                          <input 
                            type="text" 
                            name="phone" 
                            value={formData.phone || ''} 
                            onChange={handleChange} 
                            className="form-control" 
                          /> 
                          : profile.phone || "Not available"
                        }
                      </p>
                    </div>
                    <div className="col-md-6">
                      <p><strong>Address:</strong> 
                        {isEditing ? 
                          <input 
                            type="text" 
                            name="address" 
                            value={formData.address || ''} 
                            onChange={handleChange} 
                            className="form-control" 
                          /> 
                          : profile.address || "Not available"
                        }
                      </p>
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6 text-center">
                      <p><strong>Profile Picture:</strong></p>
                      {isEditing ? 
                        <input 
                          type="file" 
                          name="profilePic" 
                          onChange={handleFileChange} 
                          className="form-control" 
                        /> 
                        : profile.profilePic ? (
                          <img
                            src={profile.profilePic}
                            alt="Profile"
                            className="img-thumbnail"
                            style={{ width: "150px", height: "150px", objectFit: "cover" }}
                          />
                        ) : (
                          <p className="text-muted">Not available</p>
                        )
                      }
                    </div>
                    <div className="col-md-6 text-center">
                      <p><strong>Aadhaar Photo:</strong></p>
                      {isEditing ? 
                        <input 
                          type="file" 
                          name="aadhaarPhoto" 
                          onChange={handleFileChange} 
                          className="form-control" 
                        /> 
                        : profile.aadhaarPhoto ? (
                          <img
                            src={profile.aadhaarPhoto}
                            alt="Aadhaar"
                            className="img-thumbnail"
                            style={{ width: "150px", height: "150px", objectFit: "cover" }}
                          />
                        ) : (
                          <p className="text-muted">Not available</p>
                        )
                      }
                    </div>
                  </div>
                  <div className="text-center mt-4">
                    {isEditing ? (
                      <>
                        <button className="btn btn-primary" onClick={handleSave}>Save</button>
                        <button className="btn btn-secondary ml-2" onClick={() => setIsEditing(false)}>Cancel</button>
                      </>
                    ) : (
                      <button className="btn btn-primary" onClick={handleEditClick}>Edit</button>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-muted text-center">No profile data available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
