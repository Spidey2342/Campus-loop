import React, { useState } from 'react'
import VideoFeed from '../components/video/VideoFeed'
import TopBar from '../components/layouts/TopBar'
import BottomNav from '../components/layouts/BottomNav'

function Feedpage() {
  // feedType lives here so TopBar can change it
  // and VideoFeed can react to it
  
  const [feedType, setFeedType] = useState("foryou")

  

  return (
    <div className='h-screen w-full bg-black overflow-hidden'>
      <TopBar feedType={feedType} onTabChange={setFeedType} />
      <VideoFeed feedType={feedType} />
      <BottomNav />
    </div>
  )
}

export default Feedpage