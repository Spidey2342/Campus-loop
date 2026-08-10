import React, { useEffect, useState, useCallback, useRef } from 'react'
import VideoCard from './VideoCard'
import { getFeed } from '../../services/api'

function VideoFeed({ feedType }) {
  const [reels, setReels]               = useState([])
  const [loading, setLoading]           = useState(true)
  const [loadingMore, setLoadingMore]   = useState(false)
  const [skip, setSkip]                 = useState(0)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loopCount, setLoopCount]       = useState(0) // how many times feed has looped
  const token = localStorage.getItem('token')
  const containerRef = useRef(null)
  const loadingRef   = useRef(false)   // prevent double-fetches
  // One random seed per page load — sent on every /reels/feed call during
  // this visit so pagination stays stable while scrolling, but an actual
  // browser refresh remounts this component and gets a fresh seed, giving
  // a genuinely different shuffle each time (like TikTok), instead of the
  // old behavior of the same order all day.
  const sessionSeedRef = useRef(`${Date.now()}-${Math.random().toString(36).slice(2)}`)

  const loadReels = useCallback(async (reset = false) => {
    if (loadingRef.current) return
    loadingRef.current = true

    try {
      if (reset) {
        setLoading(true)
      } else {
        setLoadingMore(true)
      }

      const currentSkip = reset ? 0 : skip
      const data = await getFeed(token, feedType, currentSkip, 0, sessionSeedRef.current)
      const safeData = Array.isArray(data) ? data : []

      if (reset) {
        setReels(safeData)
        setSkip(safeData.length)
        setLoopCount(0)
      } else if (safeData.length === 0) {
        // Feed exhausted — loop back with an incremented loop counter so the
        // backend actually reshuffles (skip alone resetting to 0 doesn't
        // change anything — same seed, same order, verbatim repeat).
        const nextLoop = loopCount + 1
        setLoopCount(nextLoop)
        const loopData = await getFeed(token, feedType, 0, nextLoop, sessionSeedRef.current)
        const loopSafe = Array.isArray(loopData) ? loopData : []
        setReels(prev => [...prev, ...loopSafe])
        setSkip(loopSafe.length)
      } else {
        setReels(prev => [...prev, ...safeData])
        setSkip(currentSkip + safeData.length)
      }

    } catch (err) {
      console.error('Feed error:', err)
      if (reset) setReels([])
    } finally {
      setLoading(false)
      setLoadingMore(false)
      loadingRef.current = false
    }
  }, [feedType, token, skip])

  // Reset when feed type changes
  useEffect(() => {
    setSkip(0)
    setCurrentIndex(0)
    setReels([])
    setLoopCount(0)
    loadingRef.current = false
    loadReels(true)
  }, [feedType])

  // Load more when 3 reels from end — always, no hasMore gate
  useEffect(() => {
    if (currentIndex >= reels.length - 3 && !loading && !loadingMore) {
      loadReels()
    }
  }, [currentIndex])

  // Poll for new posts every 60s — prepend them to top
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const fresh = await getFeed(token, feedType, 0, 0, sessionSeedRef.current)
        const freshData = Array.isArray(fresh) ? fresh : []
        setReels(prev => {
          if (!prev.length || !freshData.length) return prev
          // Only prepend reels that aren't already in the feed
          const existingIds = new Set(prev.map(r => r.id))
          const newReels = freshData.filter(r => !existingIds.has(r.id))
          return newReels.length > 0 ? [...newReels, ...prev] : prev
        })
      } catch (_) {}
    }, 60000) // check every 60 seconds
    return () => clearInterval(interval)
  }, [feedType, token])

  // Track visible reel by scroll position
  const handleScroll = () => {
    if (!containerRef.current) return
    const scrollTop = containerRef.current.scrollTop
    const index = Math.round(scrollTop / window.innerHeight)
    setCurrentIndex(index)
  }

  if (loading && reels.length === 0) return (
    <div className="h-full flex flex-col items-center justify-center text-white gap-5 bg-black">
      {/* Rotating play button — distinct CampusVibe loading indicator */}
      <div className="relative w-20 h-20">
        {/* Outer rotating ring */}
        <div className="absolute inset-0 rounded-full border-4 border-teal-500/30 border-t-teal-500 animate-spin" />
        {/* Inner play icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center">
            <div className="w-0 h-0 border-t-[7px] border-t-transparent border-b-[7px] border-b-transparent border-l-[12px] border-l-black ml-1" />
          </div>
        </div>
      </div>
      <div className="text-center">
        <p className="text-white font-semibold text-sm">CampusVibe</p>
        <p className="text-gray-500 text-xs mt-1">Loading your feed...</p>
      </div>
    </div>
  )

  if (!loading && reels.length === 0) return (
    <div className="h-full flex flex-col items-center justify-center text-white gap-3">
      <p className="text-4xl">🎬</p>
      <p className="text-gray-400 text-center px-8">
        {feedType === 'following'
          ? 'Follow someone to see their reels here'
          : 'No reels yet — be the first to post!'}
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
        <div key={`${reel.id}-${index}`} className="h-screen snap-start relative">
          <VideoCard
            reel={reel}
            isActive={index === currentIndex}
            shouldPreload={index >= currentIndex && index <= currentIndex + 2}
            onNext={index < reels.length - 1 ? () => {
              const nextEl = containerRef.current
              if (nextEl) nextEl.scrollTop = (index + 1) * window.innerHeight
            } : null}
            onDelete={(deletedId) => {
              setReels(prev => prev.filter(r => r.id !== deletedId))
            }}
          />
        </div>
      ))}

      {/* Subtle loading spinner between reels */}
      {loadingMore && (
        <div className="h-20 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  )
}

export default VideoFeed