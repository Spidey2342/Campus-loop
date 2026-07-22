import React, { useEffect, useState } from 'react'
import { Search, Bell } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getUnreadCount } from '../../services/api'

function TopBar({ feedType, onTabChange }) {
  const navigate = useNavigate()
  const [unreadCount, setUnreadCount] = useState(0)
  const token = localStorage.getItem("token")

  // Poll for unread notifications every 60 seconds
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
    const interval = setInterval(fetchCount, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="absolute top-0 left-0 w-full z-50 flex items-center justify-between px-4 py-4 text-white">

      <button
        onClick={() => {
          setUnreadCount(0)
          navigate("/notifications")
        }}
        className="relative"
      >
        <Bell size={22} />
        {unreadCount > 0 && (
          <div className="absolute -top-1.5 -right-1.5 bg-red-500 rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
            <span className="text-white text-[9px] font-bold">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          </div>
        )}
      </button>

      <div className="flex gap-4 mx-auto">
        <button
          onClick={() => onTabChange("following")}
          className={`px-4 py-1 rounded-full text-sm transition-all ${
            feedType === "following"
              ? "bg-white/20 font-semibold"
              : "text-gray-300"
          }`}
        >
          Following
        </button>

        <button
          onClick={() => onTabChange("foryou")}
          className={`px-4 py-1 rounded-full text-sm transition-all ${
            feedType === "foryou"
              ? "bg-teal-500 text-black font-semibold"
              : "text-gray-300"
          }`}
        >
          For You
        </button>
      </div>

      <Search
        className="cursor-pointer"
        onClick={() => navigate("/discover")}
      />
    </div>
  )
}

export default TopBar