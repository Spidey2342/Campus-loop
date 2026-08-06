import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'

// This component wraps any page that requires login
// If no token — redirect to login
// If token exists but onboarding isn't done — redirect to onboarding first
//   (covers direct URLs/bookmarks/back-button, not just the signup flow)
// Otherwise — show the page normally
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token")
  const location = useLocation()

  if (!token) {
    // Replace means the login page replaces this in browser history
    // so pressing back doesn't bring them to the protected page
    return <Navigate to="/login" replace />
  }

  const user = JSON.parse(localStorage.getItem("user") || "{}")
  if (!user.has_completed_onboarding && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />
  }

  return children
}

export default ProtectedRoute