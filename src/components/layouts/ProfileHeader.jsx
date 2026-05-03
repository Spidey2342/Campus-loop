import React from 'react'
import { useNavigate } from 'react-router-dom'

function ProfileHeader() {
    const navigate = useNavigate()
  return (
      <div className="flex items-center justify-between px-4 py-3">
      <button 
      onClick={() => navigate("/feed")}
      
      >←</button>
      <h2 className="font-semibold">@alex_j</h2>
      <button>⋮</button>
    </div>
  )
}

export default ProfileHeader