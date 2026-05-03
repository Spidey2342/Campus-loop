import React from 'react'
import { useNavigate } from 'react-router-dom'

function VideoGrid({ reels }) {
  const navigate = useNavigate()

  if (reels.length === 0) return (
    <div className="text-center py-16 text-gray-500">
      <p className="text-4xl mb-3">🎬</p>
      <p>No reels yet</p>
    </div>
  )

  return (
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
  )
}

export default VideoGrid