import React, { useEffect, useState, useCallback, useRef } from 'react'
import VideoCard from './VideoCard'
import { getFeed } from '../../services/api'
import { useNavigate } from 'react-router-dom'

function VideoFeed({ feedType }) {
  const [reels, setReels] = useState([])
  const [loading, setLoading] = useState(true)
  const [skip, setSkip] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const token = localStorage.getItem("token")
  const navigate = useNavigate()
  const containerRef = useRef(null)

  const loadReels = useCallback(async (reset = false) => {
    try {
      setLoading(true)
      const currentSkip = reset ? 0 : skip
      const data = await getFeed(token, feedType, currentSkip)
      const safeData = Array.isArray(data) ? data : []

      if (safeData.length < 10) setHasMore(false)
      setReels(prev => reset ? safeData : [...prev, ...safeData])
      setSkip(currentSkip + safeData.length)

    } catch (err) {
      console.error("Feed error:", err)
      if (reset) setReels([])
    } finally {
      setLoading(false)
    }
  }, [feedType, token])

  useEffect(() => {
    setSkip(0)
    setHasMore(true)
    setCurrentIndex(0)
    loadReels(true)
  }, [feedType])

  // Load more when user is 3 reels from the end
  useEffect(() => {
    if (currentIndex >= reels.length - 3 && hasMore && !loading) {
      loadReels()
    }
  }, [currentIndex])

  // Track which reel is currently visible
  const handleScroll = () => {
    if (!containerRef.current) return
    const scrollTop = containerRef.current.scrollTop
    const screenHeight = window.innerHeight
    const index = Math.round(scrollTop / screenHeight)
    setCurrentIndex(index)
  }

  if (loading && reels.length === 0) return (
    <div className="h-full flex flex-col items-center justify-center text-white gap-4">
      <div className="w-8 h-8 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
      <p className="text-gray-400 text-sm">Loading reels...</p>
    </div>
  )

  if (reels.length === 0) return (
    <div className="h-full flex flex-col items-center justify-center text-white gap-3">
      <p className="text-4xl">🎬</p>
      <p className="text-gray-400 text-center px-8">
        {feedType === "following"
          ? "Follow someone to see their reels here"
          : "No reels yet — be the first to post!"}
      </p>
    </div>
  )

  return (
    <div
      ref={containerRef}
      className="h-full overflow-y-scroll snap-y snap-mandatory"
      onScroll={handleScroll}
    >
      {reels.map((reel, index) => (
        <div key={reel.id} className="h-screen snap-start relative">
          <VideoCard
            reel={reel}
            // Preload current + next 2 videos
            // Videos more than 2 away get unloaded to save memory
            isActive={index === currentIndex}
            shouldPreload={index >= currentIndex && index <= currentIndex + 2}
            onDelete={(deletedId) => {
              setReels(prev => prev.filter(r => r.id !== deletedId))
            }}
          />
        </div>
      ))}

      {/* Auto load more indicator */}
      {loading && reels.length > 0 && (
        <div className="h-20 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  )
}

export default VideoFeed