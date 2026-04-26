import React from 'react'
import VideoCard from './VideoCard'
import video1 from "../../assets/video1(1).mp4"
import video2 from "../../assets/video1(2).mp4"



function VideoFeed() {
    const video = [
        { id:1, src:video1},
        { id:2, src:video2}

    ]
  return (
       <div className="h-full overflow-y-scroll snap-y snap-mandatory">
      {video.map((video) => (
        <div key={video.id} className="h-screen snap-start">
          <VideoCard video={video} />
        </div>
      ))}
    </div>
  )
}

export default VideoFeed