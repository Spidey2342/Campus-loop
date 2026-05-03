import React, { useEffect, useState, useCallback } from 'react'
import VideoCard from './VideoCard'
import { getFeed } from '../../services/api'

function VideoFeed({ feedType }) {
  const [reels, setReels] = useState([])
  const [loading, setLoading] = useState(true)
  const [skip, setSkip] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const token = localStorage.getItem("token")

  const loadReels = useCallback(async (reset = false) => {
    try {
      setLoading(true)
      const currentSkip = reset ? 0 : skip
      const data = await getFeed(token, feedType, currentSkip)

      // Safety check — ensure data is always an array
      const safeData = Array.isArray(data) ? data : []

      if (safeData.length < 10) setHasMore(false)

      setReels(prev => reset ? safeData : [...prev, ...safeData])
      setSkip(currentSkip + safeData.length)

    } catch (err) {
      console.error("Feed error:", err)
      // Don't crash — just show empty state
      if (reset) setReels([])
    } finally {
      setLoading(false)
    }
  }, [feedType, token])
  
  // Reload when feed type changes (For You ↔ Following)
  useEffect(() => {
    setSkip(0)
    setHasMore(true)
    loadReels(true)
  }, [feedType])

  if (loading && reels.length === 0) return (
    <div className="h-full flex items-center justify-center text-white">
      <p className="text-gray-400">Loading reels...</p>
    </div>
  )

  if (reels.length === 0) return (
    <div className="h-full flex flex-col items-center justify-center text-white gap-3">
      <p className="text-4xl">🎬</p>
      <p className="text-gray-400">
        {feedType === "following"
          ? "Follow someone to see their reels here"
          : "No reels yet — be the first to post!"}
      </p>
    </div>
  )

  return (
    <div className="h-full overflow-y-scroll snap-y snap-mandatory">
      {reels.map((reel) => (
  <div key={reel.id} className="h-screen snap-start">
    <VideoCard
      reel={reel}
      onDelete={(deletedId) => {
        // Remove the deleted reel from the list instantly
        setReels(prev => prev.filter(r => r.id !== deletedId))
      }}
    />
  </div>
))}

      {/* Load more when reaching the end */}
      {hasMore && (
        <div className="h-screen snap-start flex items-center justify-center">
          <button
            onClick={() => loadReels()}
            className="bg-white/10 px-6 py-3 rounded-full text-white text-sm"
          >
            Load more
          </button>
        </div>
      )}
    </div>
  )
}

export default VideoFeed