import React from 'react'
import { useState } from 'react'

function VideoCard({ reel, onDelete, isActive, shouldPreload }) {
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
      setShowHeart(true)
      setTimeout(() => setShowHeart(false), 800)
      if (!isLiked) handleLike()
    }
    lastTap = now
  }

  // Play/pause based on whether this card is active
  useEffect(() => {
    const videoEl = videoRef.current
    if (!videoEl) return

    if (isActive) {
      videoEl.play().catch(() => {})
      // Count view when active
      if (!viewCounted) {
        viewReel(reel.id, token)
        setViewCounted(true)
      }
    } else {
      videoEl.pause()
      videoEl.currentTime = 0  // reset to start when not active
    }
  }, [isActive])

  return (
    <div className="relative h-full w-full bg-black" onClick={handleTap}>

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
        muted
        // preload="auto" on active and next 2, "none" for far away videos
        preload={shouldPreload ? "auto" : "none"}
        className="h-full w-full object-cover"
      />

      <VideoInfo reel={reel} />
      <ActionBar
        reel={reel}
        isLiked={isLiked}
        likesCount={likesCount}
        onLike={handleLike}
        onDelete={onDelete}
      />
    </div>
  )
}

export default VideoCard