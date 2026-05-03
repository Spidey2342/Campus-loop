import React from 'react'
import { Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function TopBar({ feedType, onTabChange }) {
  const navigate = useNavigate()

  return (
    <div className="absolute top-0 left-0 w-full z-50 flex items-center justify-between px-4 py-4 text-white">

      <div className="flex gap-4 mx-auto">
        <button
          onClick={() => onTabChange("following")}
          className={`px-4 py-1 rounded-full text-sm transition-all ${
            feedType === "following"
              ? "bg-white/20 font-semibold"
              : "text-gray-300"
          }`}
        >
          Following
        </button>

        <button
          onClick={() => onTabChange("foryou")}
          className={`px-4 py-1 rounded-full text-sm transition-all ${
            feedType === "foryou"
              ? "bg-teal-500 text-black font-semibold"
              : "text-gray-300"
          }`}
        >
          For You
        </button>
      </div>

      <Search
        className="absolute right-4 top-4 cursor-pointer"
        onClick={() => navigate("/discover")}
      />
    </div>
  )
}

export default TopBar