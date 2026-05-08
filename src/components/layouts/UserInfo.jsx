import React, { useState } from 'react'
import { followUser } from '../../services/api'
import { startDM } from '../../services/api'

function UserInfo({ profile, onEditClick }) {
  const [isFollowing, setIsFollowing] = useState(profile.is_following)
  const [followersCount, setFollowersCount] = useState(profile.followers_count)
  const token = localStorage.getItem("token")

  const handleFollow = async () => {
    try {
      const data = await followUser(profile.username, token)
      setIsFollowing(data.following)
      setFollowersCount(prev => data.following ? prev + 1 : prev - 1)
    } catch (err) {
      console.error(err)
    }
  }

  // Generate initials from full name
  const getInitials = (name) => {
    if (!name) return "?"
    return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
  }

  return (
    <div className="px-4">

      {/* Avatar + Stats */}
      <div className="flex items-center gap-4">

        {/* Avatar — shows image or initials placeholder */}
        {profile.avatar_url ? (
          <img
            src={profile.avatar_url}
            className="w-20 h-20 rounded-full object-cover border-2 border-teal-500"
            alt={profile.username}
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-teal-900 border-2 border-teal-500 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xl font-bold">
              {getInitials(profile.full_name)}
            </span>
          </div>
        )}

        <div className="flex flex-1 justify-around text-center">
          <div>
            <p className="font-bold">{followersCount.toLocaleString()}</p>
            <p className="text-sm text-gray-400">Followers</p>
          </div>
          <div>
            <p className="font-bold">{profile.following_count.toLocaleString()}</p>
            <p className="text-sm text-gray-400">Following</p>
          </div>
          <div>
            <p className="font-bold">{profile.total_likes.toLocaleString()}</p>
            <p className="text-sm text-gray-400">Likes</p>
          </div>
        </div>
      </div>

      {/* Name + Bio */}
      <div className="mt-3 space-y-1">
        <h3 className="font-semibold text-white">
          {profile.full_name}
          {profile.is_verified && (
            <span className="ml-1 text-teal-400 text-sm">✓</span>
          )}
        </h3>
        <p className="text-sm text-gray-400">
          {profile.school_name}
          {profile.year_of_study && ` · ${profile.year_of_study}`}
        </p>
        {profile.programme && (
          <p className="text-sm text-gray-400">{profile.programme}</p>
        )}
        {profile.bio && (
          <p className="text-sm text-white">{profile.bio}</p>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 mt-4">
        {profile.is_own_profile ? (
          <button
            onClick={onEditClick}
            className="flex-1 border border-white/30 py-2 rounded-xl text-sm font-semibold text-white"
          >
            Edit Profile
          </button>
        ) : (
          <button
            onClick={handleFollow}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
              isFollowing
                ? "border border-white/30 text-white"
                : "bg-teal-600 hover:bg-teal-500 text-white"
            }`}
          >
            {isFollowing ? "Following" : "Follow"}
          </button>
          
        )}
        {!profile.is_own_profile && (
  <button
    onClick={async () => {
      const conv = await startDM(profile.username, token)
      navigate(`/messages/${conv.id}`)
    }}
    className="border border-white/30 px-4 py-2 rounded-xl text-sm text-white"
  >
    Message
  </button>
)}
        <button className="border border-white/30 px-4 py-2 rounded-xl text-sm text-white">
          Share
        </button>
      </div>
    </div>
  )
}

export default UserInfo