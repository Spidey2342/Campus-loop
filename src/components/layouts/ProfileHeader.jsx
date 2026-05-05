import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MoreVertical, Share2, X, LogOut } from 'lucide-react'

function ProfileHeader({ username, isOwnProfile }) {
  const navigate = useNavigate()
  const [showMenu, setShowMenu] = useState(false)

  const handleShare = async () => {
    const url = `${window.location.origin}/profile/${username}`
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${username} on CampusVibe`,
          text: `Check out ${username}'s profile on CampusVibe!`,
          url,
        })
      } catch (err) {
        if (err.name !== "AbortError") {
          await navigator.clipboard.writeText(url)
          alert("Profile link copied!")
        }
      }
    } else {
      await navigator.clipboard.writeText(url)
      alert("Profile link copied to clipboard!")
    }
    setShowMenu(false)
  }

  const handleLogout = () => {
    localStorage.clear()
    window.location.href = "/login"
  }

  return (
    <>
      <div className="flex items-center justify-between px-4 py-3">
        <button
          onClick={() => navigate(-1)}
          className="text-white text-xl px-2"
        >
          ←
        </button>

        <h2 className="font-semibold text-white">
          @{username || "profile"}
        </h2>

        <button
          onClick={() => setShowMenu(true)}
          className="text-white p-1"
        >
          <MoreVertical size={20} />
        </button>
      </div>

      {showMenu && (
        <div
          className="fixed inset-0 z-50 flex items-end"
          onClick={() => setShowMenu(false)}
        >
          <div
            className="w-full bg-gray-900 rounded-t-2xl p-4 space-y-2 border-t border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-white">Options</h3>
              <button onClick={() => setShowMenu(false)}>
                <X size={18} className="text-gray-400" />
              </button>
            </div>

            {/* Share — shows on ALL profiles */}
            <button
              onClick={handleShare}
              className="w-full flex items-center gap-3 px-4 py-3 bg-white/10 rounded-xl text-white text-sm"
            >
              <Share2 size={16} />
              Share profile
            </button>

            {/* Report — only on OTHER people's profiles */}
            {!isOwnProfile && (
              <button
                onClick={() => {
                  alert("Report submitted. We'll review this account.")
                  setShowMenu(false)
                }}
                className="w-full flex items-center gap-3 px-4 py-3 bg-white/10 rounded-xl text-red-400 text-sm"
              >
                🚩 Report account
              </button>
            )}

            {/* Logout — only on YOUR OWN profile */}
            {isOwnProfile && (
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 bg-white/10 rounded-xl text-red-400 text-sm"
              >
                <LogOut size={16} />
                Log out
              </button>
            )}

            <button
              onClick={() => setShowMenu(false)}
              className="w-full py-3 text-gray-400 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default ProfileHeader