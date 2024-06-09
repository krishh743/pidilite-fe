import React from 'react'
import { Navigate } from 'react-router-dom';

const TrainerProtectedRoute = ({ children }) => {

    const token = localStorage.getItem('token');
    const type = localStorage.getItem('type');

    if (token && type === '2') {
        return children; // Render the children if the condition is true
    } else {
        return <Navigate to="/" replace />; // Redirect to login page if conditions are not met
    }
    return children;
}

export default TrainerProtectedRoute