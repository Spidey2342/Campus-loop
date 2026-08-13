import React, { useState } from 'react'
import VideoFeed from '../components/video/VideoFeed'
import TopBar from '../components/layouts/TopBar'
import Navigation from '../components/layouts/Navigation'

function Feedpage() {
  const [feedType, setFeedType] = useState("foryou")

  return (
    <div className='h-screen w-full bg-black overflow-hidden flex flex-col lg:pl-60'>
      <TopBar feedType={feedType} onTabChange={setFeedType} />

      {/* Full-bleed on mobile; a centered TikTok-style vertical column on
          desktop instead of stretching the video full-width. */}
      <div className="flex-1 overflow-hidden lg:flex lg:justify-center lg:bg-[#0a0a0a]">
        <div className="h-full w-full lg:max-w-[420px] lg:border-x lg:border-white/10">
          <VideoFeed feedType={feedType} />
        </div>
      </div>
      <Navigation />
    </div>
  )
}

export default Feedpage