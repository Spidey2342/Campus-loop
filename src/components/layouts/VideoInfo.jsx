import React from 'react'
import { useNavigate } from 'react-router-dom'

function VideoInfo({ reel }) {
  const navigate = useNavigate()

  return (
    <div className="absolute bottom-24 left-4 text-white max-w-[70%]">

      {/* Username + verified */}
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => navigate(`/profile/${reel.owner_username}`)}
      >
        <p className="font-bold">@{reel.owner_username}</p>
        {/* <span className="text-xs text-teal-400"></span> */}
      </div>

      {/* School tag */}
      {reel.owner_school && (
        <div className="mt-1 bg-teal-900/50 px-3 py-1 rounded-full text-xs inline-block">
          {reel.owner_school} {reel.school_tag && `· ${reel.school_tag}`}
        </div>
      )}

      {/* Caption */}
      {reel.caption && (
        <p className="mt-2 text-sm leading-snug">{reel.caption}</p>
      )}

    </div>
  )
}

export default VideoInfo