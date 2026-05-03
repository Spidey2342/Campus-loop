import React from 'react'
import { useNavigate } from 'react-router-dom'

function TopSchools({ schools }) {
  const navigate = useNavigate()

  // Generate a color for each school based on name
  const colors = [
    "bg-teal-700", "bg-blue-700", "bg-purple-700",
    "bg-red-700", "bg-orange-700", "bg-green-700"
  ]

  const getInitials = (name) => {
    return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
  }

  const formatCount = (num) => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num
  }

  if (schools.length === 0) return null

  return (
    <div className="mb-6">
      <div className="flex justify-between mb-3">
        <h2 className="font-semibold">Top Schools</h2>
        <span className="text-teal-400 text-sm cursor-pointer">See All</span>
      </div>

      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
        {schools.map((school, i) => (
          <div
            key={school.school_name}
            onClick={() => navigate(`/school/${encodeURIComponent(school.school_name)}`)}
            className="min-w-[110px] bg-white/10 rounded-xl p-3 text-center cursor-pointer hover:bg-white/20 transition-all"
          >
            {/* School avatar with initials */}
            <div className={`w-12 h-12 ${colors[i % colors.length]} mx-auto rounded-xl mb-2 flex items-center justify-center`}>
              <span className="text-white text-sm font-bold">
                {getInitials(school.school_name)}
              </span>
            </div>

            <p className="text-sm font-medium truncate">{school.school_name}</p>
            <p className="text-xs text-gray-400">{school.members} students</p>
            <p className="text-xs text-teal-400">{formatCount(school.total_views)} views</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TopSchools