import React from 'react'

function VideoInfo() {
  return (
       <div className="absolute bottom-24 left-4 text-white max-w-[70%]">
      
      <div className="flex items-center gap-2">
        <p className="font-bold">@alex_j</p>
        <span className="text-xs text-teal-400">✔ verified</span>
      </div>

      <div className="mt-1 bg-teal-900/50 px-3 py-1 rounded-full text-xs inline-block">
        Stanford University · CS '25
      </div>

      <p className="mt-2 text-sm leading-snug">
        Campus life hits different when it's finals week ☕🍜 which dorm are you in?
      </p>

      <p className="text-xs mt-2 text-gray-300">
        🎵 Blinding Lights - Weeknd
      </p>
    </div>
  )
}

export default VideoInfo