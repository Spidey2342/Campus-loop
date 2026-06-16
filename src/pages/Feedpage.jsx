import React, { useState } from 'react'
import VideoFeed from '../components/video/VideoFeed'
import TopBar from '../components/layouts/TopBar'
import BottomNav from '../components/layouts/BottomNav'

function Feedpage() {
  const [feedType, setFeedType] = useState("foryou")

  return (
    <div className='h-screen w-full bg-black overflow-hidden flex flex-col'>
      <TopBar feedType={feedType} onTabChange={setFeedType} />
     
      <div className="flex-1 overflow-hidden">
        <VideoFeed feedType={feedType} />
      </div>
      <BottomNav />
    </div>
  )
}

export default Feedpage