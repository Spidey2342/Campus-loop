import React from 'react'
import { Home, Compass, Plus, MessageCircle, User, LogOut } from "lucide-react"
import { useNavigate, useLocation } from 'react-router-dom'

function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  // Check which page is active so we can highlight the right icon
  const isActive = (path) => location.pathname.startsWith(path)

  const handleLogout = () => {
    // Clear everything from localStorage
    localStorage.clear()
    // Send to login
    navigate("/login", { replace: true })
  }

  return (
    <div className="fixed bottom-0 left-0 w-full bg-black/80 backdrop-blur-md py-3 flex justify-around items-center text-white z-50"
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

      {/* Center upload button */}
      <button
        onClick={() => navigate("/upload")}
        className="bg-teal-500 p-3 rounded-full -mt-6 shadow-lg"
      >
        <Plus className="text-black" size={22} />
      </button>

      <button
        onClick={() => navigate("/profile")}
        className={`flex flex-col items-center gap-0.5 ${isActive("/profile") ? "text-teal-400" : "text-gray-400"}`}
      >
        <User size={22} />
        <span className="text-xs">Profile</span>
      </button>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex flex-col items-center gap-0.5 text-gray-400"
      >
        <LogOut size={22} />
        <span className="text-xs">Logout</span>
      </button>

    </div>
  )
}

export default BottomNav