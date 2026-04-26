import React, { useEffect, useRef, useState } from 'react'
import VideoInfo from '../layouts/VideoInfo';
import ActionBar from '../layouts/ActionBar';
import { Heart } from 'lucide-react';


function VideoCard({video}) {

    const [showHeart, setShowHeart] = useState(false);
    let lastTap = 0;

const handleTap = () => {
  const now = Date.now();

  if (now - lastTap < 300) {
    // DOUBLE TAP DETECTED
    setShowHeart(true);

    setTimeout(() => {
      setShowHeart(false);
    }, 600);
  }

  lastTap = now;
};
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
     <div className="relative h-full w-full bg-black"
     onClick={handleTap}
     >
        {showHeart && (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
    <Heart
      className="text-white animate-heart"
      size={100}
      fill="white"
    />
  </div>
)}
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