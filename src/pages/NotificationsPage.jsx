import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Heart, MessageCircle, UserPlus, Bell } from 'lucide-react'
import { getNotifications, markNotificationsRead } from '../services/api'
import BottomNav from '../components/layouts/BottomNav'
import { NotificationSkeleton } from '../components/layouts/Skeleton'

function NotificationsPage() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const token = localStorage.getItem("token")

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getNotifications(token)
        setNotifications(Array.isArray(data) ? data : [])
        // Mark all as read when page opens
        await markNotificationsRead(token)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const getIcon = (type) => {
    switch (type) {
      case "like": return <Heart size={16} className="text-red-400" fill="red" />
      case "comment": return <MessageCircle size={16} className="text-blue-400" />
      case "follow": return <UserPlus size={16} className="text-teal-400" />
      default: return <Bell size={16} className="text-gray-400" />
    }
  }

  const formatTime = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return "just now"
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    return `${Math.floor(hrs / 24)}d ago`
  }

  const getInitials = (name) => {
    if (!name) return "?"
    return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
  }

  return (
    <div className="min-h-screen bg-black text-white pb-24">

      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-white/10">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-bold text-lg">Notifications</h1>
      </div>

      {loading ? (
        <div className="divide-y divide-white/5">
          {Array.from({ length: 6 }).map((_, i) => <NotificationSkeleton key={i} />)}
        </div>
      ) : notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Bell size={40} className="text-gray-600" />
          <p className="text-gray-400 font-semibold">No notifications yet</p>
          <p className="text-gray-600 text-sm text-center px-8">
            When someone likes, comments or follows you it'll show up here
          </p>
        </div>
      ) : (
        <div className="divide-y divide-white/5">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                if (n.reel_id) navigate(`/reel/${n.reel_id}`)
                else if (n.type === "follow") navigate(`/profile/${n.sender_username}`)
              }}
              className={`flex items-center gap-3 px-4 py-4 cursor-pointer transition-all hover:bg-white/5 ${
                !n.is_read ? "bg-teal-500/5" : ""
              }`}
            >
              {/* Sender avatar */}
              <div
                className="relative flex-shrink-0"
                onClick={(e) => {
                  e.stopPropagation()
                  navigate(`/profile/${n.sender_username}`)
                }}
              >
                {n.sender_avatar ? (
                  <img
                    src={n.sender_avatar}
                    className="w-11 h-11 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-teal-900 flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {getInitials(n.sender_username)}
                    </span>
                  </div>
                )}
                {/* Notification type icon badge */}
                <div className="absolute -bottom-1 -right-1 bg-gray-900 rounded-full p-0.5">
                  {getIcon(n.type)}
                </div>
              </div>

              {/* Message */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white leading-snug">
                  {n.message}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {formatTime(n.created_at)}
                </p>
              </div>

              {/* Unread dot */}
              {!n.is_read && (
                <div className="w-2 h-2 bg-teal-400 rounded-full flex-shrink-0" />
              )}
            </div>
          ))}
        </div>
      )}

      <BottomNav />
    </div>
  )
}

export default NotificationsPage