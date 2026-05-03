import React from 'react'

function Highlights() {
    const items = [ "New", "Campus", "Dorm", "Study", "Game Day"];
  return (
      <div className="flex gap-3 overflow-x-auto px-4 py-3">
      {items.map((item, i) => (
        <div key={i} className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-gray-700" />
          <p className="text-xs mt-1">{item}</p>
        </div>
      ))}
    </div>
  )
}

export default Highlights