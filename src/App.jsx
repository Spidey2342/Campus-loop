import React from 'react'
import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/layouts/ProtectedRoute'
import PublicRoute from './components/layouts/PublicRoute'

// Pages
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Feedpage from './pages/Feedpage'
import UploadPage from './pages/UploadPage'
import Profilepage from './pages/Profilepage'
import DiscoverPage from './pages/DiscoverPage'
import ReelPage from './pages/ReelPage'
import NotificationsPage from './pages/NotificationsPage'


function App() {
  return (
    <Routes>

      {/* Public routes — logged in users get redirected to feed */}
      <Route path="/" element={
        <PublicRoute><Login /></PublicRoute>
      } />
      <Route path="/login" element={
        <PublicRoute><Login /></PublicRoute>
      } />
      <Route path="/signup" element={
        <PublicRoute><SignUp /></PublicRoute>
      } />

      {/* Protected routes — logged out users get redirected to login */}
      <Route path="/feed" element={
        <ProtectedRoute><Feedpage /></ProtectedRoute>
      } />
      <Route path="/upload" element={
        <ProtectedRoute><UploadPage /></ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute><Profilepage /></ProtectedRoute>
      } />
      <Route path="/profile/:username" element={
        <ProtectedRoute><Profilepage /></ProtectedRoute>
      } />
      <Route path="/discover" element={
        <ProtectedRoute><DiscoverPage /></ProtectedRoute>
      } />
      <Route path="/reel/:reelId" element={
        <ProtectedRoute><ReelPage /></ProtectedRoute>
      } />

<Route path="/notifications" element={
  <ProtectedRoute><NotificationsPage /></ProtectedRoute>
} />

    </Routes>
  )
}

export default App