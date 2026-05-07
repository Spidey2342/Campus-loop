import React, { useState, useEffect } from 'react'
import { Home, Compass, Plus, Bell, User, LogOut } from "lucide-react"
import { useNavigate, useLocation } from 'react-router-dom'
import { getUnreadCount } from '../../services/api'

function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const token = localStorage.getItem("token")

  const isActive = (path) => location.pathname.startsWith(path)

  // Poll for unread notifications every 30 seconds
  useEffect(() => {
  const fetchCount = async () => {
    try {
      const data = await getUnreadCount(token)
      setUnreadCount(data?.unread_count || 0)
    } catch {
      // Server sleeping — ignore silently
    }
  }

  fetchCount()
  const interval = setInterval(fetchCount, 60000) // every 60s not 30s
  return () => clearInterval(interval)
}, [])

  const handleLogout = () => {
    localStorage.clear()
    navigate("/login", { replace: true })
  }

  return (
    <>
      <div
        className="fixed bottom-0 left-0 w-full bg-black/80 backdrop-blur-md py-3 flex justify-around items-center text-white z-50"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <button
          onClick={() => navigate("/feed")}
          className={`flex flex-col items-center gap-0.5 ${isActive("/feed") ? "text-teal-400" : "text-gray-400"}`}
        >
          <Home size={22} />
          <span className="text-xs">Home</span>
        </button>

        <button
          onClick={() => navigate("/discover")}
          className={`flex flex-col items-center gap-0.5 ${isActive("/discover") ? "text-teal-400" : "text-gray-400"}`}
        >
          <Compass size={22} />
          <span className="text-xs">Discover</span>
        </button>

        <button
          onClick={() => navigate("/upload")}
          className="bg-teal-500 p-3 rounded-full -mt-6 shadow-lg"
        >
          <Plus className="text-black" size={22} />
        </button>

        {/* Notifications bell with unread badge */}
        <button
          onClick={() => {
            setUnreadCount(0)
            navigate("/notifications")
          }}
          className={`flex flex-col items-center gap-0.5 relative ${isActive("/notifications") ? "text-teal-400" : "text-gray-400"}`}
        >
          <div className="relative">
            <Bell size={22} />
            {unreadCount > 0 && (
              <div className="absolute -top-1 -right-1 bg-red-500 rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
                <span className="text-white text-[9px] font-bold">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              </div>
            )}
          </div>
          <span className="text-xs">Activity</span>
        </button>

        <button
          onClick={() => navigate("/profile")}
          className={`flex flex-col items-center gap-0.5 ${isActive("/profile") ? "text-teal-400" : "text-gray-400"}`}
        >
          <User size={22} />
          <span className="text-xs">Profile</span>
        </button>
      </div>

      {/* Logout modal — triggered from profile page settings */}
      {showLogoutModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-6"
          onClick={() => setShowLogoutModal(false)}
        >
          <div
            className="bg-gray-900 w-full max-w-sm rounded-2xl p-6 border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-white text-lg font-semibold mb-2">Log out?</h2>
            <p className="text-gray-400 text-sm mb-6">
              You'll need to sign in again to access your account.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 bg-white/10 py-3 rounded-xl text-white text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 bg-red-500 py-3 rounded-xl text-white text-sm font-semibold"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default BottomNav