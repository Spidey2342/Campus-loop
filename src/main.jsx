import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { requestNotificationPermission, onForegroundMessage } from './services/firebase'
import { saveFCMToken } from './services/api'
import './index.css'
import App from './App.jsx'


if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => console.log('SW registered:', reg.scope))
      .catch((err) => console.log('SW failed:', err))
  })
}

if (import.meta.env.PROD) {
  setInterval(() => {
    fetch(`${import.meta.env.VITE_API_URL}/health`).catch(() => {})
  }, 10 * 60 * 1000)
}

// After app mounts request notification permission
const setupNotifications = async () => {
  const authToken = localStorage.getItem("token")
  if (!authToken) return

  try {
    const fcmToken = await requestNotificationPermission()
    if (fcmToken) {
      // Save to backend so we can send notifications to this device
      await saveFCMToken(fcmToken, authToken)
    }

    // Handle notifications when app is open
    onForegroundMessage((payload) => {
      console.log('Foreground notification:', payload)
      // Show a toast/banner instead of system notification
      // when app is already open
    })
  } catch (err) {
    console.error('Notification setup failed:', err)
  }
}

// Run after a short delay so it doesn't block initial render
setTimeout(setupNotifications, 3000)

createRoot(document.getElementById('root')).render(
   <BrowserRouter>
    <App />
  </BrowserRouter>
)
