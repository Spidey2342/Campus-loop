import React from 'react'

function CategoryTabs({ active, onChange }) {
  const tabs = ["All", "Sports", "Dorms", "Study", "Events", "Science", "Arts"]

  return (
    <div className="flex gap-2 overflow-x-auto mb-6 scrollbar-hide">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
            active === tab
              ? "bg-teal-500 text-black font-semibold"
              : "bg-white/10 text-gray-300"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}

export default CategoryTabs