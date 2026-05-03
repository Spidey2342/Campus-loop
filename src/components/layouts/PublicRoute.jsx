import React from 'react'
import { Navigate } from 'react-router-dom'

// This component wraps login/signup pages
// If already logged in — redirect to feed
// If not logged in — show the page normally
function PublicRoute({ children }) {
  const token = localStorage.getItem("token")

  if (token) {
    // Already logged in — send to feed
    return <Navigate to="/feed" replace />
  }

  return children
}

export default PublicRoute