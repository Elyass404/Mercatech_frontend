// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
    // Check if we have a user saved in local storage
    const user = localStorage.getItem('currentUser');

    if (!user) {
        // If there is no user, redirect them immediately to the login page
        return <Navigate to="/login" replace />;
    }

    // If they are logged in, render the protected page (the 'children')
    return children;
}