import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import VideoCard from '../components/video/VideoCard'
import { ReelSkeleton } from '../components/layouts/Skeleton'

const BASE_URL = 'https://campus-backend-moz5.onrender.com'

function ReelPage() {
  const { reelId } = useParams()
  const navigate   = useNavigate()
  const [reel, setReel]       = useState(null)
  const [loading, setLoading] = useState(true)
  const token = localStorage.getItem('token')

  useEffect(() => {
    const loadReel = async () => {
      try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {}
        const response = await fetch(`${BASE_URL}/reels/${reelId}`, { headers })

        if (!response.ok) throw new Error('Reel not found')
        const data = await response.json()
        setReel(data)
      } catch (err) {
        console.error(err)
        // If not logged in, redirect to login with the reel URL saved
        if (!token) {
          localStorage.setItem('redirect_after_login', `/reel/${reelId}`)
          navigate('/login')
        } else {
          navigate('/feed')
        }
      } finally {
        setLoading(false)
      }
    }
    loadReel()
  }, [reelId])

  if (loading) return (
    <div className="h-screen bg-black">
      <ReelSkeleton />
    </div>
  )

  if (!reel) return null

  return (
    <div className="h-screen bg-black">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 z-50 text-white bg-black/40 rounded-full p-2"
      >
        ←
      </button>
      <VideoCard reel={reel} isActive={true} />
    </div>
  )
}

export default ReelPage