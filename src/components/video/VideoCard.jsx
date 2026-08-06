import React, { useState, useEffect, useRef } from 'react'
import VideoInfo from '../layouts/VideoInfo'
import ActionBar from '../layouts/ActionBar'
import { Heart, RotateCcw, ChevronDown } from 'lucide-react'
import { likeReel, viewReel, followUser } from '../../services/api'
import { useNavigate } from 'react-router-dom'

function VideoCard({ reel, onDelete, isActive, shouldPreload, onNext }) {
  const [showHeart, setShowHeart]     = useState(false)
  const [isLiked, setIsLiked]         = useState(reel.is_liked)
  const [likesCount, setLikesCount]   = useState(reel.likes_count)
  const [isFollowingOwner, setIsFollowingOwner] = useState(reel.is_following_owner)
  const [viewCounted, setViewCounted] = useState(false)
  const [ended, setEnded]             = useState(false)
  const [progress, setProgress]       = useState(0)
  const videoRef = useRef(null)
  const token    = localStorage.getItem('token')
  const navigate = useNavigate()
  let lastTap = 0

  const handleLike = async () => {
    try {
      const data = await likeReel(reel.id, token)
      setIsLiked(data.liked)
      setLikesCount(data.likes_count)
    } catch (err) {
      console.error(err)
    }
  }

  const handleFollow = async () => {
    if (isFollowingOwner) return // already following — "+" is hidden anyway, this is just a safety net
    setIsFollowingOwner(true) // optimistic — the badge disappears immediately on tap
    try {
      await followUser(reel.owner_username, token)
    } catch (err) {
      console.error(err)
      setIsFollowingOwner(false) // roll back if the request actually failed
    }
  }

  const handleTap = () => {
    const now = Date.now()
    if (now - lastTap < 300) {
      setShowHeart(true)
      setTimeout(() => setShowHeart(false), 800)
      if (!isLiked) handleLike()
    }
    lastTap = now
  }

  const handleReplay = (e) => {
    e.stopPropagation()
    setEnded(false)
    if (videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play().catch(() => {})
    }
  }

  const handleTimeUpdate = () => {
    const v = videoRef.current
    if (!v || !v.duration) return
    setProgress((v.currentTime / v.duration) * 100)
  }

  const handleEnded = () => {
    setEnded(true)
  }

  useEffect(() => {
    const videoEl = videoRef.current
    if (!videoEl) return
    setEnded(false)
    setProgress(0)

    if (isActive) {
      videoEl.play().catch(() => {})
      if (!viewCounted) {
        viewReel(reel.id, token)
        setViewCounted(true)
      }
    } else {
      videoEl.pause()
      videoEl.currentTime = 0
    }
  }, [isActive])

  const getBrandedDownloadUrl = () => {
    const url = reel.video_url
    if (!url || !url.includes('cloudinary.com')) return url

    // Extract everything after /upload/
    // e.g. https://res.cloudinary.com/mycloud/video/upload/campusvibe/reels/abc.mp4
    const uploadIndex = url.indexOf('/upload/')
    if (uploadIndex === -1) return url

    const base      = url.substring(0, uploadIndex + 8) // up to and including /upload/
    const assetPath = url.substring(uploadIndex + 8)    // campusvibe/reels/abc.mp4

    // Cloudinary transformation string — applied at delivery time, no re-encoding
    const transforms = [
      // CampusVibe text watermark — bottom right, semi-transparent white
      'l_text:Arial_36_bold:CampusVibe,co_white,o_70,g_south_east,x_16,y_16',
      // Subtle dark scrim behind text so it's readable on any background
      'l_text:Arial_36_bold:CampusVibe,co_black,o_30,g_south_east,x_18,y_18',
      // campus-loop.vercel.app in smaller text just above
      'l_text:Arial_22:campus-loop-peach.vercel.app,co_white,o_50,g_south_east,x_16,y_58',
      // Force download with fl_attachment
      'fl_attachment:campusvibe',
    ].join('/')

    return `${base}${transforms}/${assetPath}`
  }

  const handleDownload = async (e) => {
    e.stopPropagation()
    const brandedUrl = getBrandedDownloadUrl()
    try {
      // Use fetch for same-origin or CORS-friendly URLs
      const response = await fetch(brandedUrl)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `campusvibe-${reel.owner_username || 'reel'}.mp4`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch {
      // Fallback — let Cloudinary serve it directly with fl_attachment
      window.open(brandedUrl, '_blank')
    }
  }

  return (
    <div className="relative h-full w-full bg-black" onClick={handleTap}>

      {/* Double tap heart */}
      {showHeart && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
          <Heart className="text-white animate-ping" size={100} fill="white" />
        </div>
      )}

      {/* Video — no loop so we catch onEnded */}
      {reel.is_photo ? (
        <img
          src={reel.video_url}
          alt={reel.caption}
          className="h-full w-full object-cover"
        />
      ) : (
        <video
          ref={videoRef}
          src={reel.video_url}
          playsInline
          preload={shouldPreload ? 'metadata' : 'none'}
          className="h-full w-full object-cover"
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
        />
      )}

      {/* Progress bar — thin line at bottom */}
      {!reel.is_photo && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/20 z-20">
          <div
            className="h-full bg-teal-400 transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <VideoInfo reel={reel} />
      <ActionBar
        reel={reel}
        isLiked={isLiked}
        likesCount={likesCount}
        onLike={handleLike}
        isFollowingOwner={isFollowingOwner}
        onFollow={handleFollow}
        onDelete={onDelete}
        onDownload={handleDownload}
      />

      {/* ── End screen — TikTok style ── */}
      {ended && (
        <div
          className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={e => e.stopPropagation()}
        >
          {/* Creator avatar */}
          <div
            className="mb-4 cursor-pointer"
            onClick={() => navigate(`/profile/${reel.owner_username}`)}
          >
            {reel.owner_avatar ? (
              <img
                src={reel.owner_avatar}
                className="w-20 h-20 rounded-full object-cover border-2 border-teal-500"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-teal-800 flex items-center justify-center border-2 border-teal-500">
                <span className="text-white text-2xl font-bold">
                  {reel.owner_username?.[0]?.toUpperCase()}
                </span>
              </div>
            )}
          </div>

          <p
            className="text-white font-semibold text-lg mb-1 cursor-pointer"
            onClick={() => navigate(`/profile/${reel.owner_username}`)}
          >
            @{reel.owner_username}
          </p>

          {reel.owner_school && (
            <p className="text-gray-400 text-sm mb-6">{reel.owner_school}</p>
          )}

          {/* Action buttons */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={handleReplay}
              className="flex flex-col items-center gap-1.5 bg-white/10 px-6 py-3 rounded-2xl"
            >
              <RotateCcw size={22} className="text-white" />
              <span className="text-white text-xs">Replay</span>
            </button>

            {onNext && (
              <button
                onClick={(e) => { e.stopPropagation(); onNext() }}
                className="flex flex-col items-center gap-1.5 bg-teal-500 px-6 py-3 rounded-2xl"
              >
                <ChevronDown size={22} className="text-black" />
                <span className="text-black text-xs font-semibold">Next</span>
              </button>
            )}
          </div>

          {/* Caption */}
          {reel.caption && (
            <p className="text-gray-300 text-sm text-center px-8 max-w-xs line-clamp-2">
              {reel.caption}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default VideoCard