import React from 'react'
import { Navigate } from 'react-router-dom'

// This component wraps any page that requires login
// If no token — redirect to login
// If token exists — show the page normally
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token")

  if (!token) {
    // Replace means the login page replaces this in browser history
    // so pressing back doesn't bring them to the protected page
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute