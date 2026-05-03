import React from 'react'
import { useNavigate } from 'react-router-dom'
import { TrendingUp } from 'lucide-react'

function TrendingChallenges({ trending }) {
  const navigate = useNavigate()

  if (trending.length === 0) return (
    <div className="mb-6">
      <h2 className="font-semibold mb-3">Trending</h2>
      <p className="text-gray-500 text-sm">
        No trending tags yet — add hashtags to your reels!
      </p>
    </div>
  )

  return (
    <div>
      <div className="flex justify-between mb-3">
        <h2 className="font-semibold">Trending Now</h2>
        <span className="text-teal-400 text-sm">See All</span>
      </div>

      <div className="space-y-3">
        {trending.map((item, i) => (
          <div
            key={item.tag}
            onClick={() => navigate(`/search?q=${encodeURIComponent(item.tag)}`)}
            className="bg-white/10 rounded-xl p-4 flex justify-between items-center cursor-pointer hover:bg-white/20 transition-all"
          >
            <div className="flex items-center gap-3">
              {/* Rank number */}
              <span className="text-gray-500 text-sm font-bold w-5">
                {i + 1}
              </span>
              <div>
                <p className="font-semibold">{item.tag}</p>
                <p className="text-sm text-gray-400">
                  {item.count} {item.count === 1 ? "reel" : "reels"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-teal-400" />
              <button className="bg-white/10 p-2 rounded-full text-xs">▶</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TrendingChallenges