import React, { useEffect, useState, useCallback, useRef } from 'react'
import VideoCard from './VideoCard'
import { getFeed } from '../../services/api'

function VideoFeed({ feedType }) {
  const [reels, setReels] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false) // 👈 was missing
  const [skip, setSkip] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const token = localStorage.getItem("token")
  const containerRef = useRef(null)

  const loadReels = useCallback(async (reset = false) => {
    try {
      // Use different loading states for initial vs loading more
      if (reset) {
        setLoading(true)
      } else {
        setLoadingMore(true)
      }

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
      setLoadingMore(false)
    }
  }, [feedType, token, skip])

  useEffect(() => {
    setSkip(0)
    setHasMore(true)
    setCurrentIndex(0)
    setReels([])
    loadReels(true)
  }, [feedType])

  // Auto load more when 3 reels from end
  useEffect(() => {
    if (currentIndex >= reels.length - 3 && hasMore && !loading && !loadingMore) {
      loadReels()
    }
  }, [currentIndex])

  // Track visible reel by scroll position
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

  if (!loading && reels.length === 0) return (
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
            isActive={index === currentIndex}
            shouldPreload={index >= currentIndex && index <= currentIndex + 2}
            onDelete={(deletedId) => {
              setReels(prev => prev.filter(r => r.id !== deletedId))
            }}
          />
        </div>
      ))}

      {/* Small spinner while loading more — doesn't interrupt feed */}
      {loadingMore && (
        <div className="h-20 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* End of feed */}
      {!hasMore && reels.length > 0 && (
        <div className="h-32 flex flex-col items-center justify-center gap-2">
          <p className="text-gray-500 text-sm">You've seen everything!</p>
          <button
            onClick={() => {
              setSkip(0)
              setHasMore(true)
              loadReels(true)
            }}
            className="text-teal-400 text-sm underline"
          >
            Refresh feed
          </button>
        </div>
      )}
    </div>
  )
}

export default VideoFeed