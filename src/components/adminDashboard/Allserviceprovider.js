import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export default function Allserviceprovider() {
    const [unverifiedServiceProviders, setUnverifiedServiceProviders] = useState([]);
    const [verifiedServiceProviders, setVerifiedServiceProviders] = useState([]);

    useEffect(() => {
        const fetchUnverifiedServiceProviders = async () => {
            try {
                const response = await axios.get('http://localhost:3017/unverified-providers', {
                    headers: {
                        Authorization: localStorage.getItem('token'),
                    },
                });
                setUnverifiedServiceProviders(response.data);
            } catch (error) {
                console.error('Error fetching unverified service providers:', error);
            }
        };

        const fetchVerifiedServiceProviders = async () => {
            try {
                const response = await axios.get('http://localhost:3017/verifiedproviders', {
                    headers: {
                        Authorization: localStorage.getItem('token'),
                    },
                });
                setVerifiedServiceProviders(response.data);
            } catch (error) {
                console.error('Error fetching verified service providers:', error);
            }
        };

        fetchUnverifiedServiceProviders();
        fetchVerifiedServiceProviders();
    }, []);

    const handleVerify = async (userId) => {
        try {
            await axios.post('http://localhost:3017/verify-providers', { userId }, {
                headers: {
                    Authorization: localStorage.getItem('token'),
                },
            });
            toast.success('Service provider verified successfully');
            const verifiedServiceProvider = unverifiedServiceProviders.find(provider => provider._id === userId);
            setUnverifiedServiceProviders(unverifiedServiceProviders.filter(provider => provider._id !== userId));
            setVerifiedServiceProviders([...verifiedServiceProviders, verifiedServiceProvider]);
        } catch (error) {
            console.error('Error verifying service provider:', error);
            toast.error('Failed to verify service provider');
        }
    };

    const handleReject = async (userId) => {
        try {
            await axios.post('http://localhost:3017/reject-providers', { userId }, {
                headers: {
                    Authorization: localStorage.getItem('token'),
                },
            });
            toast.success('Service provider rejected successfully');
            setUnverifiedServiceProviders(unverifiedServiceProviders.filter(provider => provider._id !== userId));
        } catch (error) {
            console.error('Error rejecting service provider:', error);
            toast.error('Failed to reject service provider');
        }
    };

    const handleRemove = async (userId) => {
        try {
            await axios.post('http://localhost:3017/reject-providers', { userId }, {
                headers: {
                    Authorization: localStorage.getItem('token'),
                },
            });
            toast.success('Service provider removed successfully');
            // Remove from verified list
            setVerifiedServiceProviders(verifiedServiceProviders.filter(provider => provider._id !== userId));
        } catch (error) {
            console.error('Error removing service provider:', error);
            toast.error('Failed to remove service provider');
        }
    };

    return (
        <div className="container" style={{ backgroundColor: "#f0f0f0", padding: "20px" }}>
            <h1 className="my-4 text-center">Service Providers Management</h1>
            
            <div className="mb-4">
                <h2 className="text-center">Unverified Service Providers</h2>
                {unverifiedServiceProviders.length === 0 ? (
                    <p className="text-center">No unverified service providers found</p>
                ) : (
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {unverifiedServiceProviders.map(provider => (
                                <tr key={provider._id}>
                                    <td>{provider.username}</td>
                                    <td>{provider.email}</td>
                                    <td>
                                        <button className="btn btn-success mr-2" onClick={() => handleVerify(provider._id)}>Verify</button>
                                        <button className="btn btn-danger" onClick={() => handleReject(provider._id)}>Reject</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div className="mb-4">
                <h2 className="text-center">Verified Service Providers</h2>
                {verifiedServiceProviders.length === 0 ? (
                    <p className="text-center">No verified service providers found</p>
                ) : (
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {verifiedServiceProviders.map(provider => (
                                <tr key={provider._id}>
                                    <td>{provider.username}</td>
                                    <td>{provider.email}</td>
                                    <td>
                                        <button className="btn btn-danger" onClick={() => handleRemove(provider._id)}>Remove</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
