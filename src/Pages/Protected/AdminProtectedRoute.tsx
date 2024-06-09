import React from 'react'
import { Navigate } from 'react-router-dom';

const AdminProtectedRoute = ({ children }) => {

    const token = localStorage.getItem('token');
    const type = localStorage.getItem('type');

    console.log("token check")

    // Check if token exists and type is '2'
    if (token && type === '1') {
        return children; // Render the children if the condition is true
    } else {
        return <Navigate to="/" replace />; // Redirect to login page if conditions are not met
    }
}

export default AdminProtectedRoute