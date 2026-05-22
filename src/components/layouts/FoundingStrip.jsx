import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Crown } from 'lucide-react'

const BASE_URL = 'https://campus-backend-moz5.onrender.com'

function FoundingStrip() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await fetch(`${BASE_URL}/users/founding-members`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        })
        const data = await res.json()
        setMembers(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading || members.length === 0) return null

  return (
    <div className="bg-gradient-to-r from-teal-950/80 via-black/90 to-teal-950/80 border-b border-teal-500/20 py-3">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 mb-2.5">
        <Crown size={14} className="text-yellow-400" />
        <p className="text-xs font-semibold text-yellow-400 tracking-wide uppercase">
          Founding Members
        </p>
        <span className="text-xs text-gray-500">· First 100 on CampusVibe</span>
      </div>

      {/* Scrollable avatar row */}
      <div className="flex gap-3 overflow-x-auto px-4 pb-1 no-scrollbar">
        {members.map((member) => (
          <button
            key={member.id}
            onClick={() => navigate(`/profile/${member.username}`)}
            className="flex flex-col items-center gap-1 flex-shrink-0"
          >
            <div className="relative">
              {member.avatar_url ? (
                <img
                  src={member.avatar_url}
                  className="w-12 h-12 rounded-full object-cover border-2 border-yellow-400/60"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-teal-800 border-2 border-yellow-400/60 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {member.username?.[0]?.toUpperCase()}
                  </span>
                </div>
              )}
              {/* Crown badge */}
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                <Crown size={10} className="text-black" />
              </div>
            </div>
            <p className="text-xs text-gray-300 max-w-[52px] truncate">
              {member.username}
            </p>
          </button>
        ))}
      </div>
    </div>
  )
}

export default FoundingStrip