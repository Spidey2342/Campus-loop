import React, { useEffect, useRef, useState } from 'react'
import VideoInfo from '../layouts/VideoInfo'
import ActionBar from '../layouts/ActionBar'
import { Heart } from 'lucide-react'
import { likeReel, viewReel } from '../../services/api'

function VideoCard({ reel, onDelete }) {
  const [showHeart, setShowHeart] = useState(false)
  const [isLiked, setIsLiked] = useState(reel.is_liked)
  const [likesCount, setLikesCount] = useState(reel.likes_count)
  const [viewCounted, setViewCounted] = useState(false)
  const videoRef = useRef(null)
  const token = localStorage.getItem("token")
  let lastTap = 0

  const handleLike = async () => {
    try {
      const data = await likeReel(reel.id, token)
      setIsLiked(data.liked)
      setLikesCount(data.likes_count)
    } catch (err) {
      console.error(err)
    }
  }

  const handleTap = () => {
    const now = Date.now()
    if (now - lastTap < 300) {
      // Double tap — like the reel
      setShowHeart(true)
      setTimeout(() => setShowHeart(false), 800)
      if (!isLiked) handleLike() // only like if not already liked
    }
    lastTap = now
  }

  useEffect(() => {
    const videoEl = videoRef.current
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoEl.play().catch(() => {})
          // Count view once per reel per session
          if (!viewCounted) {
            viewReel(reel.id, token)
            setViewCounted(true)
          }
        } else {
          videoEl.pause()
        }
      },
      { threshold: 0.8 }
    )
    if (videoEl) observer.observe(videoEl)
    return () => { if (videoEl) observer.unobserve(videoEl) }
  }, [])

  return (
    <div className="relative h-full w-full bg-black" onClick={handleTap}>

      {/* Double tap heart animation */}
      {showHeart && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
          <Heart className="text-white animate-ping" size={100} fill="white" />
        </div>
      )}

      <video
        ref={videoRef}
        src={reel.video_url}
        loop
        playsInline
        
        className="h-full w-full object-cover"
      />

      {/* Pass real reel data down to children */}
      <VideoInfo reel={reel} />
     <ActionBar
        reel={reel}
        isLiked={isLiked}
        likesCount={likesCount}
        onLike={handleLike}
        onDelete={onDelete}  // 👈 pass it down
      />
    </div>
  )
}

export default VideoCard