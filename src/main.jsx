import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
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



createRoot(document.getElementById('root')).render(
   <BrowserRouter>
    <App />
  </BrowserRouter>
)
