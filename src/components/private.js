import React from 'react';
import { useAuth } from "../Context/AuthContext";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ permittedRoles, children }) {
    const { user } = useAuth();

    if (!user.account && localStorage.getItem('token')) {
        return <p>Loading...</p>;
    }

    if (!user.account) {
        // If not logged in, allow access (for public routes)
        if (permittedRoles.includes(undefined)) {
            return children;
        }
        return <Navigate to="/Unathorized" />;
    }

    if (!permittedRoles.includes(user.account.role)) {
        return <Navigate to="/Unathorized" />;
    }

    if (!user.account.isVerified && user.account.role === 'serviceprovider') {
        return <Navigate to="/verification" />;
    }

    
    if (!user.isLoggedIn) {
        return <Navigate to="/login" />;
    }

    return children;
}
