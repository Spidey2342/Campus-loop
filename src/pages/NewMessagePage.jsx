import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Search, Users } from 'lucide-react'
import { startDM, createGroup } from '../services/api'

const BASE_URL = "https://campus-backend-moz5.onrender.com"

function NewMessagePage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [selected, setSelected] = useState([])
  const [groupName, setGroupName] = useState("")
  const [loading, setLoading] = useState(false)
  const token = localStorage.getItem("token")
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}")

  // Search users
  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); return }
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/discover/search?q=${encodeURIComponent(searchQuery)}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        const data = await response.json()
        setSearchResults(data.users || [])
      } catch (err) {
        console.error(err)
      }
    }, 400)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const toggleSelect = (user) => {
    setSelected(prev => {
      const exists = prev.find(u => u.id === user.id)
      if (exists) return prev.filter(u => u.id !== user.id)
      return [...prev, user]
    })
  }

  const handleStart = async () => {
    if (selected.length === 0) return
    setLoading(true)
    try {
      if (selected.length === 1) {
        // Start DM
        const conv = await startDM(selected[0].username, token)
        navigate(`/messages/${conv.id}`)
      } else {
        // Create group
        const name = groupName || selected.map(u => u.username).join(", ")
        const usernames = selected.map(u => u.username).join(",")
        const conv = await createGroup(name, usernames, token)
        navigate(`/messages/${conv.id}`)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getInitials = (name) => {
    if (!name) return "?"
    return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-white/10">
        <button onClick={() => navigate("/messages")}>
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-bold text-lg flex-1">New Message</h1>
        {selected.length > 0 && (
          <button
            onClick={handleStart}
            disabled={loading}
            className="bg-teal-500 px-4 py-1.5 rounded-full text-black text-sm font-semibold"
          >
            {loading ? "..." : selected.length === 1 ? "Chat" : "Create Group"}
          </button>
        )}
      </div>

      {/* Selected users */}
      {selected.length > 0 && (
        <div className="px-4 py-3 flex gap-2 flex-wrap border-b border-white/10">
          {selected.map(user => (
            <div
              key={user.id}
              onClick={() => toggleSelect(user)}
              className="flex items-center gap-1 bg-teal-500/20 border border-teal-500/40 px-3 py-1 rounded-full cursor-pointer"
            >
              <span className="text-teal-400 text-sm">{user.username}</span>
              <span className="text-teal-400 text-xs">×</span>
            </div>
          ))}
        </div>
      )}

      {/* Group name input — shows when 2+ selected */}
      {selected.length >= 2 && (
        <div className="px-4 py-3 border-b border-white/10">
          <input
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Group name (optional)"
            className="w-full bg-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none placeholder-gray-500"
          />
        </div>
      )}

      {/* Search */}
      <div className="px-4 py-3">
        <div className="flex items-center bg-white/10 rounded-xl px-3 py-2 gap-2">
          <Search size={14} className="text-gray-400" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for people..."
            autoFocus
            className="flex-1 bg-transparent text-sm outline-none text-white placeholder-gray-500"
          />
        </div>
      </div>

      {/* Results */}
      <div className="divide-y divide-white/5">
        {searchResults.map(user => {
          if (user.id === currentUser.id) return null
          const isSelected = selected.find(u => u.id === user.id)
          return (
            <div
              key={user.id}
              onClick={() => toggleSelect(user)}
              className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-white/5"
            >
              {user.avatar_url ? (
                <img src={user.avatar_url} className="w-11 h-11 rounded-full object-cover flex-shrink-0" />
              ) : (
                <div className="w-11 h-11 rounded-full bg-teal-800 flex items-center justify-center font-bold flex-shrink-0">
                  {getInitials(user.full_name)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{user.full_name}</p>
                <p className="text-gray-400 text-xs">@{user.username}</p>
                {user.school_name && (
                  <p className="text-gray-600 text-xs truncate">{user.school_name}</p>
                )}
              </div>
              {/* Selection indicator */}
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                isSelected ? "bg-teal-500 border-teal-500" : "border-gray-600"
              }`}>
                {isSelected && <span className="text-black text-xs font-bold">✓</span>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default NewMessagePage