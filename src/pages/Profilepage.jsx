import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ProfileHeader from '../components/layouts/ProfileHeader'
import Highlights from '../components/layouts/Highlights'
import VideoGrid from '../components/layouts/VideoGrid'
import UserInfo from '../components/layouts/UserInfo'
import EditProfileModal from '../components/layouts/EditProfileModal'
import { getProfile, getUserReels } from '../services/api'

function Profilepage() {
  const { username } = useParams()
  const navigate = useNavigate()

  const [profile, setProfile] = useState(null)
  const [reels, setReels] = useState([])
  const [loading, setLoading] = useState(true)
  const [showEditModal, setShowEditModal] = useState(false)

  const token = localStorage.getItem("token")
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}")
  const profileUsername = username || currentUser.username

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true)
        const [profileData, reelsData] = await Promise.all([
          getProfile(profileUsername, token),
          getUserReels(profileUsername, token),
        ])
        setProfile(profileData)
        setReels(Array.isArray(reelsData) ? reelsData : [])
      } catch (err) {
        console.error(err)
        // Don't redirect to login on profile not found
        // Just show the not found screen
        setProfile(null)
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
  }, [profileUsername])

  if (loading) return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <p className="text-gray-400">Loading profile...</p>
    </div>
  )

  if (!profile) return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
      <p className="text-4xl">👤</p>
      <p className="font-semibold">Profile not found</p>
      <p className="text-gray-400 text-sm text-center px-8">
        This account doesn't exist or may have been deleted.
      </p>
      <button
        onClick={() => navigate("/feed")}
        className="bg-teal-500 px-6 py-2 rounded-full text-black font-semibold text-sm"
      >
        Go to feed
      </button>
    </div>
  )

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Pass real username and isOwnProfile to header */}
      <ProfileHeader
        username={profile.username}
        isOwnProfile={profile.is_own_profile}
      />

      <div className="pb-20">
        <UserInfo
          profile={profile}
          onEditClick={() => setShowEditModal(true)}
        />
        <Highlights />
        <VideoGrid reels={reels} />
      </div>

      {showEditModal && (
        <EditProfileModal
          profile={profile}
          token={token}
          onClose={() => setShowEditModal(false)}
          onSave={(updatedUser) => {
            // Update localStorage so navbar reflects new info
            localStorage.setItem("user", JSON.stringify({
              ...currentUser,
              ...updatedUser
            }))
            setProfile({ ...profile, ...updatedUser })
            setShowEditModal(false)
          }}
        />
      )}
    </div>
  )
}

export default Profilepage