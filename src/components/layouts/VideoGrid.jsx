import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

function VideoGrid({ reels, onLoadMore, hasMore, loadingMore }) {
  const navigate = useNavigate()
  const sentinelRef = useRef(null)

  // Observe the sentinel — when it scrolls into view, load the next page
  useEffect(() => {
    if (!onLoadMore || !hasMore) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore) {
          onLoadMore()
        }
      },
      { rootMargin: '300px' } // trigger a bit before it's actually visible
    )
    if (sentinelRef.current) observer.observe(sentinelRef.current)
    return () => observer.disconnect()
  }, [onLoadMore, hasMore, loadingMore])

  if (reels.length === 0) return (
    <div className="text-center py-16 text-gray-500">
      <p className="text-4xl mb-3">🎬</p>
      <p>No reels yet</p>
    </div>
  )

  return (
    <>
      <div className="grid grid-cols-3 gap-1 mt-2">
        {reels.map((reel) => (
          <div
            key={reel.id}
            className="relative cursor-pointer"
            onClick={() => navigate(`/reel/${reel.id}`)}
          >
            {reel.thumbnail_url ? (
              // Show Cloudinary thumbnail
              <img
                src={reel.thumbnail_url}
                className="w-full h-36 object-cover bg-gray-800"
                alt="reel"
                loading="lazy"
                onError={(e) => {
                  // If thumbnail fails to load, show a dark placeholder
                  e.target.style.display = 'none'
                  e.target.nextSibling.style.display = 'flex'
                }}
              />
            ) : null}

            {/* Fallback placeholder if no thumbnail */}
            <div
              className="w-full h-36 bg-gray-800 items-center justify-center text-gray-500 text-xs"
              style={{ display: reel.thumbnail_url ? 'none' : 'flex' }}
            >
              🎬
            </div>

            {/* Play icon overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black/30 rounded-full p-2">
                <div className="w-0 h-0 border-t-4 border-b-4 border-l-8 border-transparent border-l-white ml-0.5" />
              </div>
            </div>

            {/* View count */}
            <div className="absolute bottom-1 left-1 text-white text-xs bg-black/50 px-1.5 py-0.5 rounded">
              ▶ {reel.views_count?.toLocaleString() || 0}
            </div>
          </div>
        ))}
      </div>

      {/* Sentinel for infinite scroll + loading indicator */}
      {hasMore && (
        <div ref={sentinelRef} className="flex justify-center py-6">
          {loadingMore && (
            <div className="w-5 h-5 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
          )}
        </div>
      )}
    </>
  )
}

export default VideoGrid