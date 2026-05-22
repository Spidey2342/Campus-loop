import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, X } from 'lucide-react'

/**
 * NotificationToast — listens for foreground push notifications
 * and shows a banner at the top of the screen.
 * Mount this once inside a logged-in layout.
 */
function NotificationToast() {
  const [toast, setToast] = useState(null)
  const [visible, setVisible] = useState(false)
  const navigate = useNavigate()
  const timerRef = React.useRef(null)

  useEffect(() => {
    const handler = (e) => {
      const { title, body, url } = e.detail

      // Clear any existing toast timer
      if (timerRef.current) clearTimeout(timerRef.current)

      setToast({ title, body, url })
      setVisible(true)

      // Auto-dismiss after 4 seconds
      timerRef.current = setTimeout(() => {
        setVisible(false)
        setTimeout(() => setToast(null), 300) // wait for fade out
      }, 4000)
    }

    window.addEventListener('campusvibe-notification', handler)
    return () => {
      window.removeEventListener('campusvibe-notification', handler)
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const handleTap = () => {
    if (toast?.url) navigate(toast.url)
    setVisible(false)
    setTimeout(() => setToast(null), 300)
  }

  const handleDismiss = (e) => {
    e.stopPropagation()
    setVisible(false)
    setTimeout(() => setToast(null), 300)
  }

  if (!toast) return null

  return (
    <div
      onClick={handleTap}
      className={`fixed top-4 left-4 right-4 z-[100] transition-all duration-300 cursor-pointer ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
      }`}
    >
      <div className="bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl p-4 flex items-start gap-3">
        <div className="w-10 h-10 bg-teal-500/20 rounded-full flex items-center justify-center flex-shrink-0">
          <Bell size={18} className="text-teal-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-sm">{toast.title}</p>
          {toast.body && <p className="text-gray-400 text-xs mt-0.5 line-clamp-2">{toast.body}</p>}
        </div>
        <button
          onClick={handleDismiss}
          className="text-gray-500 flex-shrink-0 mt-0.5"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}

export default NotificationToast