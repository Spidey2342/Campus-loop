import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ProfileHeader from '../components/layouts/ProfileHeader'
import Highlights from '../components/layouts/Highlights'
import VideoGrid from '../components/layouts/VideoGrid'
import UserInfo from '../components/layouts/UserInfo'
import EditProfileModal from '../components/layouts/EditProfileModal'
import { getProfile, getUserReels } from '../services/api'

function Profilepage() {
  // useParams reads the username from the URL
  // e.g. /profile/esi.owusu → username = "esi.owusu"
  const { username } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);

  // Get the logged in user's token and info from localStorage
  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  // If no username in URL, default to the logged in user's profile
  const profileUsername = username || currentUser.username;

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const [profileData, reelsData] = await Promise.all([
          getProfile(profileUsername, token),
          getUserReels(profileUsername, token),
        ]);
        setProfile(profileData);
        setReels(reelsData);
      } catch (err) {
        console.error(err);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [profileUsername]);

  if (loading) return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <p className="text-gray-400">Loading profile...</p>
    </div>
  );

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-black text-white">
      <ProfileHeader username={profile.username} />

      <div className="pb-20">
        <UserInfo
          profile={profile}
          onEditClick={() => setShowEditModal(true)}
        />
        <Highlights />
        <VideoGrid reels={reels} />
      </div>

      {/* Edit modal — only shows when showEditModal is true */}
      {showEditModal && (
        <EditProfileModal
          profile={profile}
          token={token}
          onClose={() => setShowEditModal(false)}
          onSave={(updatedUser) => {
            setProfile({ ...profile, ...updatedUser });
            setShowEditModal(false);
          }}
        />
      )}
    </div>
  )
}

export default Profilepage