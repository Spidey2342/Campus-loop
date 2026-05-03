import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { followUser } from '../../services/api'

function SearchResults({ results, loading, query }) {
  const navigate = useNavigate()
  const token = localStorage.getItem("token")
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}")

  // Track follow state for each user in results
  const [followStates, setFollowStates] = useState({})

  const getInitials = (name) => {
    if (!name) return "?"
    return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
  }

  const handleFollow = async (e, username) => {
    // Stop click from also navigating to profile
    e.stopPropagation()

    try {
      const data = await followUser(username, token)
      setFollowStates(prev => ({
        ...prev,
        [username]: data.following
      }))
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center py-16">
      <p className="text-gray-400 text-sm">Searching...</p>
    </div>
  )

  if (!results) return null

  const hasResults = results.users.length > 0 || results.reels.length > 0

  if (!hasResults) return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <p className="text-3xl">🔍</p>
      <p className="text-gray-400 text-sm">No results for "{query}"</p>
    </div>
  )

  return (
    <div className="space-y-6">

      {/* Users */}
      {results.users.length > 0 && (
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">
            Students & Schools
          </p>
          <div className="space-y-3">
            {results.users.map((user) => {
              // Don't show follow button on your own account
              const isOwnAccount = user.id === currentUser.id
              // Check follow state — use local state if toggled, otherwise false
              const isFollowing = followStates[user.username] ?? false

              return (
                <div
                  key={user.id}
                  onClick={() => navigate(`/profile/${user.username}`)}
                  className="flex items-center gap-3 p-3 bg-white/10 rounded-xl cursor-pointer hover:bg-white/20 transition-all"
                >
                  {/* Avatar */}
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-teal-900 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">
                        {getInitials(user.full_name)}
                      </span>
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">
                      {user.full_name}
                      {user.is_verified && (
                        <span className="ml-1 text-teal-400 text-xs">✓</span>
                      )}
                    </p>
                    <p className="text-gray-400 text-xs">@{user.username}</p>
                    {user.school_name && (
                      <p className="text-gray-500 text-xs truncate">
                        {user.school_name}
                      </p>
                    )}
                  </div>

                  {/* Follow button — hidden on own account */}
                  {!isOwnAccount && (
                    <button
                      onClick={(e) => handleFollow(e, user.username)}
                      className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all flex-shrink-0 ${
                        isFollowing
                          ? "border border-white/30 text-white"
                          : "bg-teal-500 text-black"
                      }`}
                    >
                      {isFollowing ? "Following" : "Follow"}
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Reels */}
      {results.reels.length > 0 && (
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">
            Reels
          </p>
          <div className="grid grid-cols-3 gap-1">
            {results.reels.map((reel) => (
              <div
                key={reel.id}
                onClick={() => navigate(`/reel/${reel.id}`)}
                className="relative cursor-pointer"
              >
                {reel.thumbnail_url ? (
                  <img
                    src={reel.thumbnail_url}
                    className="w-full h-36 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-36 bg-gray-800 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🎬</span>
                  </div>
                )}
                <div className="absolute bottom-1 left-1 text-white text-xs bg-black/50 px-1 rounded">
                  ▶ {reel.views_count?.toLocaleString() || 0}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}

export default SearchResults