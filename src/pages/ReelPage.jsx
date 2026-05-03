import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import VideoCard from '../components/video/VideoCard'

const BASE_URL = "http://localhost:8000"

function ReelPage() {
  const { reelId } = useParams()
  const navigate = useNavigate()
  const [reel, setReel] = useState(null)
  const [loading, setLoading] = useState(true)
  const token = localStorage.getItem("token")

  useEffect(() => {
    const loadReel = async () => {
      try {
        const response = await fetch(`${BASE_URL}/reels/${reelId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (!response.ok) throw new Error("Reel not found")
        const data = await response.json()
        setReel(data)
      } catch (err) {
        console.error(err)
        navigate("/feed")
      } finally {
        setLoading(false)
      }
    }
    loadReel()
  }, [reelId])

  if (loading) return (
    <div className="h-screen bg-black flex items-center justify-center text-white">
      <p className="text-gray-400">Loading...</p>
    </div>
  )

  if (!reel) return null

  return (
    <div className="h-screen bg-black">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 z-50 text-white bg-black/40 rounded-full p-2"
      >
        ←
      </button>
      <VideoCard reel={reel} />
    </div>
  )
}

export default ReelPage