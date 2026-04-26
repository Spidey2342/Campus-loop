import React from 'react'
import { useState } from 'react'
import { Search } from 'lucide-react'

function TopBar() {
      const [active, setActive] = useState("foryou");
  return (
     <div className="absolute top-0 left-0 w-full z-50 flex items-center justify-between px-4 py-4 text-white">
      
      {/* CENTER TABS */}
      <div className="flex gap-4 mx-auto">
        <button
          onClick={() => setActive("following")}
          className={`px-4 py-1 rounded-full text-sm ${
            active === "following"
              ? "bg-white/20"
              : "text-gray-300"
          }`}
        >
          Following
        </button>

        <button
          onClick={() => setActive("foryou")}
          className={`px-4 py-1 rounded-full text-sm ${
            active === "foryou"
              ? "bg-teal-500 text-black font-semibold"
              : "text-gray-300"
          }`}
        >
          For You
        </button>
      </div>

      {/* SEARCH */}
      <Search className="absolute right-4 top-4" />
    </div>
  )
}

export default TopBar