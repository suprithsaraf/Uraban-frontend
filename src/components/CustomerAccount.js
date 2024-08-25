import axios from "axios";
import { useState, useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import 'bootstrap/dist/css/bootstrap.min.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CustomerAccount() {
  const [profile, setProfile] = useState({
    firstName: "",
    phone: "",
    address: "",
    profilePic: "",
    aadhaarPhoto: "",
  });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (user.account && user.account.role === "customer") {
          const token = localStorage.getItem('token');
          if (!token) throw new Error("No token found in localStorage");

          const response = await axios.get('http://localhost:3017/get/customer', {
            headers: { 
                Authorization: token 
            },
          });

          if (response.data && response.data.profile) { 
            setProfile(response.data.profile); 
          } else {
            console.error("Profile data is missing or empty in response");
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error.message || error);
        toast.error('Failed to fetch profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (user && user.account) {
      fetchProfile();
    }
  }, [user]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error("No token found in localStorage");
  
      const formData = new FormData();
      formData.append("firstName", profile.firstName);
      formData.append("phone", profile.phone);
      formData.append("address", profile.address);
      
      if (profile.profilePic) formData.append("profilePic", profile.profilePic);
      if (profile.aadhaarPhoto) formData.append("aadhaarPhoto", profile.aadhaarPhoto);
  
      const response = await axios.put('http://localhost:3017/customer/update', formData, {
        headers: { 
          Authorization: token,
          'Content-Type': 'multipart/form-data' // Removed this line
        },
      });
  
      if (response.status === 200) {
        toast.success('Profile updated successfully!');
        setIsEditing(false); // Exit edit mode
      }
    } catch (error) {
      console.error("Error updating profile:", error.response ? error.response.data : error.message);
      toast.error('Failed to update profile. Please try again.');
    }
  };
  

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.files[0] });
  };

  if (loading) {
    return <p className="text-center">Loading...</p>;
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Customer Details</h2>
              {profile ? (
                <div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label><strong>First Name:</strong></label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="firstName"
                          value={profile.firstName || ""}
                          onChange={handleChange}
                          className="form-control"
                        />
                      ) : (
                        <p>{profile.firstName || "Not available"}</p>
                      )}
                    </div>
                    <div className="col-md-6">
                      <label><strong>Email:</strong></label>
                      <p>{user.account.email || "Not available"}</p>
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label><strong>Phone:</strong></label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="phone"
                          value={profile.phone || ""}
                          onChange={handleChange}
                          className="form-control"
                        />
                      ) : (
                        <p>{profile.phone || "Not available"}</p>
                      )}
                    </div>
                    <div className="col-md-6">
                      <label><strong>Address:</strong></label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="address"
                          value={profile.address || ""}
                          onChange={handleChange}
                          className="form-control"
                        />
                      ) : (
                        <p>{profile.address || "Not available"}</p>
                      )}
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6 text-center">
                      <label><strong>Profile Picture:</strong></label>
                      {isEditing ? (
                        <input
                          type="file"
                          name="profilePic"
                          onChange={handleFileChange}
                          className="form-control"
                        />
                      ) : (
                        profile.profilePic ? (
                          <img
                            src={profile.profilePic}
                            alt="Profile"
                            className="img-thumbnail"
                            style={{ width: "150px", height: "150px", objectFit: "cover" }}
                          />
                        ) : (
                          <p className="text-muted">Not available</p>
                        )
                      )}
                    </div>
                    <div className="col-md-6 text-center">
                      <label><strong>Aadhaar Photo:</strong></label>
                      {isEditing ? (
                        <input
                          type="file"
                          name="aadhaarPhoto"
                          onChange={handleFileChange}
                          className="form-control"
                        />
                      ) : (
                        profile.aadhaarPhoto ? (
                          <img
                            src={profile.aadhaarPhoto}
                            alt="Aadhaar"
                            className="img-thumbnail"
                            style={{ width: "150px", height: "150px", objectFit: "cover" }}
                          />
                        ) : (
                          <p className="text-muted">Not available</p>
                        )
                      )}
                    </div>
                  </div>
                  {isEditing ? (
                    <button onClick={handleSave} className="btn btn-primary">
                      Save
                    </button>
                  ) : (
                    <button onClick={handleEdit} className="btn btn-secondary">
                      Edit
                    </button>
                  )}
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
