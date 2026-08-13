import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ProfileHeader from '../components/layouts/ProfileHeader'
import Highlights from '../components/layouts/Highlights'
import VideoGrid from '../components/layouts/VideoGrid'
import UserInfo from '../components/layouts/UserInfo'
import EditProfileModal from '../components/layouts/EditProfileModal'
import SellerAccountCard from '../components/layouts/SellerAccountCard'
import { ProfileHeaderSkeleton, ProfileGridSkeleton } from '../components/layouts/Skeleton'
import { getProfile, getUserReels } from '../services/api'
import Sidebar from '../components/layouts/Sidebar'

function Profilepage() {
  const { username } = useParams()
  const navigate = useNavigate()

  const [profile, setProfile] = useState(null)
  const [reels, setReels] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [skip, setSkip] = useState(0)
  const [showEditModal, setShowEditModal] = useState(false)

  const PAGE_SIZE = 21
  const token = localStorage.getItem("token")
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}")
  const profileUsername = username || currentUser.username

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true)
        setSkip(0)
        setHasMore(true)
        const [profileData, reelsData] = await Promise.all([
          getProfile(profileUsername, token),
          getUserReels(profileUsername, token, 0, PAGE_SIZE),
        ])
        setProfile(profileData)
        const safeReels = Array.isArray(reelsData) ? reelsData : []
        setReels(safeReels)
        setSkip(safeReels.length)
        setHasMore(safeReels.length === PAGE_SIZE)
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

  const handleLoadMore = async () => {
    if (loadingMore || !hasMore) return
    setLoadingMore(true)
    try {
      const data = await getUserReels(profileUsername, token, skip, PAGE_SIZE)
      const safeData = Array.isArray(data) ? data : []
      setReels(prev => [...prev, ...safeData])
      setSkip(prev => prev + safeData.length)
      setHasMore(safeData.length === PAGE_SIZE)
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingMore(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-black text-white lg:pl-60">
      <div className="lg:max-w-3xl lg:mx-auto">
      <ProfileHeaderSkeleton />
      <ProfileGridSkeleton />
      </div>
      <Sidebar />
    </div>
  )

  if (!profile) return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4 lg:pl-60">
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
      <Sidebar />
    </div>
  )

  return (
    <div className="min-h-screen bg-black text-white lg:pl-60">
      <div className="lg:max-w-3xl lg:mx-auto">
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
        {profile.is_own_profile && (
          <div className="px-4">
            <SellerAccountCard currentUser={currentUser} />
          </div>
        )}
        <Highlights />
        <VideoGrid
          reels={reels}
          onLoadMore={handleLoadMore}
          hasMore={hasMore}
          loadingMore={loadingMore}
        />
      </div>
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
      <Sidebar />
    </div>
  )
}

export default Profilepage