import React, { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Play } from 'lucide-react'
import VideoCard from '../components/video/VideoCard'

const BASE_URL = 'https://backend.nurora.co.uk'

function HashtagPage() {
  const { tag } = useParams()
  const navigate = useNavigate()

  const [reels, setReels]         = useState([])
  const [loading, setLoading]     = useState(true)
  const [activeIndex, setActiveIndex] = useState(null) // null = grid view
  const containerRef = useRef(null)
  const token = localStorage.getItem('token')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const res = await fetch(
          `${BASE_URL}/discover/hashtag/${encodeURIComponent(tag)}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        const data = await res.json()
        setReels(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
    setActiveIndex(null)
  }, [tag])

  // Track active reel by scroll when in feed mode
  const handleScroll = () => {
    if (!containerRef.current || activeIndex === null) return
    const index = Math.round(containerRef.current.scrollTop / window.innerHeight)
    setActiveIndex(index)
  }

  const openReel = (index) => {
    setActiveIndex(index)
    // Scroll to correct position after state update
    setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.scrollTop = index * window.innerHeight
      }
    }, 50)
  }

  const totalViews = reels.reduce((sum, r) => sum + (r.views_count || 0), 0)
  const formatCount = (n) => n >= 1000000 ? `${(n/1000000).toFixed(1)}M` : n >= 1000 ? `${(n/1000).toFixed(1)}K` : n

  return (
    <div className="min-h-screen bg-black text-white">

      {/* ── Grid view ── */}
      {activeIndex === null ? (
        <>
          {/* Header */}
          <div className="px-4 pt-12 pb-4 border-b border-white/10">
            <button onClick={() => navigate(-1)} className="mb-4">
              <ArrowLeft size={20} />
            </button>

            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-teal-500/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                <span className="text-3xl font-black text-teal-400">#</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">#{tag}</h1>
                <p className="text-gray-400 text-sm mt-0.5">
                  {formatCount(totalViews)} views · {reels.length} {reels.length === 1 ? 'reel' : 'reels'}
                </p>
              </div>
            </div>

            {/* Use hashtag CTA */}
            <button
              onClick={() => navigate('/upload')}
              className="w-full bg-teal-500 text-black font-semibold py-2.5 rounded-xl text-sm"
            >
              + Post with #{tag}
            </button>
          </div>

          {/* Reel grid */}
          {loading ? (
            <div className="grid grid-cols-3 gap-0.5 mt-0.5">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="aspect-[9/16] animate-pulse bg-white/10" />
              ))}
            </div>
          ) : reels.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <p className="text-4xl">🎬</p>
              <p className="text-white font-semibold">No reels yet</p>
              <p className="text-gray-400 text-sm text-center px-8">
                Be the first to post with #{tag}
              </p>
              <button
                onClick={() => navigate('/upload')}
                className="mt-2 bg-teal-500 text-black font-semibold px-6 py-2.5 rounded-full text-sm"
              >
                Post now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-0.5 mt-0.5">
              {reels.map((reel, i) => (
                <button
                  key={reel.id}
                  onClick={() => openReel(i)}
                  className="aspect-[9/16] relative overflow-hidden bg-zinc-900"
                >
                  {reel.thumbnail_url ? (
                    <img
                      src={reel.thumbnail_url}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                      <Play size={24} className="text-gray-500" />
                    </div>
                  )}
                  {/* View count overlay */}
                  <div className="absolute bottom-1 left-1 flex items-center gap-0.5">
                    <Play size={10} fill="white" className="text-white" />
                    <span className="text-white text-xs font-medium">
                      {formatCount(reel.views_count || 0)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </>
      ) : (
        // ── Feed view — full screen reel player ──
        <>
          {/* Back to grid */}
          <button
            onClick={() => setActiveIndex(null)}
            className="absolute top-4 left-4 z-50 bg-black/50 rounded-full p-2"
          >
            <ArrowLeft size={18} />
          </button>

          {/* Hashtag pill */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-black/50 px-3 py-1 rounded-full">
            <span className="text-teal-400 text-sm font-semibold">#{tag}</span>
          </div>

          <div
            ref={containerRef}
            className="h-screen overflow-y-scroll snap-y snap-mandatory"
            onScroll={handleScroll}
          >
            {reels.map((reel, index) => (
              <div key={reel.id} className="h-screen snap-start">
                <VideoCard
                  reel={reel}
                  isActive={index === activeIndex}
                  shouldPreload={index >= activeIndex && index <= activeIndex + 1}
                  onNext={index < reels.length - 1 ? () => {
                    if (containerRef.current) {
                      containerRef.current.scrollTop = (index + 1) * window.innerHeight
                    }
                  } : null}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default HashtagPage