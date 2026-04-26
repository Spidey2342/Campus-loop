import React, { useEffect, useRef } from 'react'
import VideoInfo from '../layouts/VideoInfo';
import ActionBar from '../layouts/ActionBar';

function VideoCard({video}) {
    const videoRef = useRef(null )

    useEffect(() => {
  const videoEl = videoRef.current;

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        videoEl.play().catch(() => {});
      } else {
        videoEl.pause();
      }
    },
    { threshold: 1 }
  );

  if (videoEl) observer.observe(videoEl);

  return () => {
    if (videoEl) observer.unobserve(videoEl);
  };
}, []);

  return (
     <div className="relative h-full w-full bg-black">
      <video
        ref={videoRef}
        src={video.src}
        muted
        loop
        // controls
        autoPlay
        playsInline
        className="h-full w-full object-cover"
      />

      {/* LEFT CONTENT */}
      <VideoInfo/>

      {/* RIGHT ACTIONS */}
     <ActionBar/>
    </div>
  )
}

export default VideoCard