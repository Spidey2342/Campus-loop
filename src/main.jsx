import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

// Register the Firebase service worker — MUST be firebase-messaging-sw.js
// for background push notifications to work. This replaces sw.js.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/firebase-messaging-sw.js')
      .then(reg => console.log('SW registered:', reg.scope))
      .catch(err => console.error('SW failed:', err))
  })
}

// Keep Render backend alive (free tier sleeps after inactivity)
if (import.meta.env.PROD) {
  setInterval(() => {
    fetch(`${import.meta.env.VITE_API_URL}/health`).catch(() => {})
  }, 10 * 60 * 1000)
}

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)