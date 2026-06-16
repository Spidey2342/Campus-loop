import React from 'react'
import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/layouts/ProtectedRoute'
import PublicRoute from './components/layouts/PublicRoute'
import InstallPrompt from './components/InstallPrompt'
import NotificationToast from './components/layouts/NotificationToast'
import { useNotifications } from './hooks/useNotifications'

// Pages
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import SignUp from './pages/SignUp'
import Feedpage from './pages/Feedpage'
import UploadPage from './pages/UploadPage'
import Profilepage from './pages/Profilepage'
import DiscoverPage from './pages/DiscoverPage'
import ReelPage from './pages/ReelPage'
import NotificationsPage from './pages/NotificationsPage'
import NewMessagePage from './pages/NewMessagePage'
import MessagesPage from './pages/MessagesPage'
import ChatPage from './pages/ChatPage'
import AdminPage from './pages/AdminPage'
import HashtagPage from './pages/HashtagPage'


function App() {
  // Request notification permission + save FCM token once logged in
  useNotifications()

  return (
    <>
    <NotificationToast />
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
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

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
      <Route path="/messages" element={
  <ProtectedRoute><MessagesPage /></ProtectedRoute>
} />
<Route path="/messages/new" element={
  <ProtectedRoute><NewMessagePage /></ProtectedRoute>
} />
<Route path="/messages/:conversationId" element={
  <ProtectedRoute><ChatPage /></ProtectedRoute>
} />

<Route path="/notifications" element={
  <ProtectedRoute><NotificationsPage /></ProtectedRoute>
} />

<Route path="/admin" element={
  <ProtectedRoute><AdminPage /></ProtectedRoute>
} />

<Route path="/hashtag/:tag" element={
  <ProtectedRoute><HashtagPage /></ProtectedRoute>
} />

    </Routes>
     <InstallPrompt />
     </>
  )
}

export default App