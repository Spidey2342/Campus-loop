import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Edit, Search, Users } from 'lucide-react'
import { ConversationSkeleton } from '../components/layouts/Skeleton'
import BottomNav from '../components/layouts/BottomNav'

function MessagesPage() {
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const navigate = useNavigate()
  const token = localStorage.getItem("token")

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getConversations(token)
        setConversations(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const getInitials = (name) => {
    if (!name) return "?"
    return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
  }

  const formatTime = (dateStr) => {
    if (!dateStr) return ""
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return "now"
    if (mins < 60) return `${mins}m`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h`
    return `${Math.floor(hrs / 24)}d`
  }

  const filtered = conversations.filter(c =>
    c.name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-black text-white pb-24">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
        <h1 className="font-bold text-xl">Messages</h1>
        <button
          onClick={() => navigate("/messages/new")}
          className="w-9 h-9 bg-teal-500 rounded-full flex items-center justify-center"
        >
          <Edit size={16} className="text-black" />
        </button>
      </div>

      {/* Search */}
      <div className="px-4 py-3">
        <div className="flex items-center bg-white/10 rounded-xl px-3 py-2 gap-2">
          <Search size={14} className="text-gray-400" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search messages..."
            className="flex-1 bg-transparent text-sm outline-none text-white placeholder-gray-500"
          />
        </div>
      </div>

      {/* Conversations list */}
      {loading ? (
        <div className="divide-y divide-white/5">
          {Array.from({ length: 7 }).map((_, i) => <ConversationSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <p className="text-3xl">💬</p>
          <p className="text-gray-400 font-semibold">No messages yet</p>
          <p className="text-gray-600 text-sm text-center px-8">
            Start a conversation by tapping the edit button above
          </p>
        </div>
      ) : (
        <div className="divide-y divide-white/5">
          {filtered.map((conv) => (
            <div
              key={conv.id}
              onClick={() => navigate(`/messages/${conv.id}`)}
              className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-white/5 transition-all"
            >
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                {conv.avatar_url ? (
                  <img
                    src={conv.avatar_url}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                    conv.type === "group" ? "bg-purple-700 rounded-xl" : "bg-teal-800"
                  }`}>
                    {conv.type === "group"
                      ? <Users size={20} />
                      : getInitials(conv.name)
                    }
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm truncate">{conv.name}</p>
                    {/* School badge for DMs */}
                    {conv.school_name && conv.type === "dm" && (
                      <span className="text-xs bg-teal-900/50 text-teal-400 px-2 py-0.5 rounded-full flex-shrink-0">
                        {conv.school_name.split(" ")[0]}
                      </span>
                    )}
                    {/* Group badge */}
                    {conv.type === "group" && (
                      <span className="text-xs bg-purple-900/50 text-purple-400 px-2 py-0.5 rounded-full flex-shrink-0">
                        GROUP
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 flex-shrink-0">
                    {formatTime(conv.last_message_time)}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-0.5">
                  <p className="text-xs text-gray-400 truncate">
                    {conv.last_message || "Start a conversation"}
                  </p>
                  {conv.unread_count > 0 && (
                    <div className="w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center flex-shrink-0 ml-2">
                      <span className="text-black text-xs font-bold">
                        {conv.unread_count > 9 ? "9+" : conv.unread_count}
                      </span>
                    </div>
                  )}
                </div>
                {/* Group member count */}
                {conv.type === "group" && (
                  <p className="text-xs text-gray-600 mt-0.5">
                    {conv.members_count} members
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <BottomNav />
    </div>
  )
}

export default MessagesPage