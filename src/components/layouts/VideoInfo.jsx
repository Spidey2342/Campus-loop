import React from 'react'
import { useNavigate } from 'react-router-dom'

// Parses caption text and makes #hashtags tappable
function Caption({ text, navigate }) {
  const parts = text.split(/(#\w+)/g)
  return (
    <p className="mt-2 text-sm leading-snug">
      {parts.map((part, i) =>
        part.startsWith('#') ? (
          <span
            key={i}
            onClick={(e) => {
              e.stopPropagation()
              navigate(`/hashtag/${part.slice(1)}`)
            }}
            className="text-teal-400 font-semibold cursor-pointer hover:underline"
          >
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </p>
  )
}

function VideoInfo({ reel }) {
  const navigate = useNavigate()

  return (
    <div className="absolute bottom-24 left-4 text-white max-w-[70%]">

      {/* Username */}
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => navigate(`/profile/${reel.owner_username}`)}
      >
        <p className="font-bold">@{reel.owner_username}</p>
      </div>

      {/* School tag */}
      {reel.owner_school && (
        <div className="mt-1 bg-teal-900/50 px-3 py-1 rounded-full text-xs inline-block">
          {reel.owner_school} {reel.school_tag && `· ${reel.school_tag}`}
        </div>
      )}

      {/* Caption with tappable hashtags */}
      {reel.caption && (
        <Caption text={reel.caption} navigate={navigate} />
      )}

    </div>
  )
}

export default VideoInfo