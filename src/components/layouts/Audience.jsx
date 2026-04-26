import React from 'react'

function Audience() {
  return (
      <div className="bg-white/10 rounded-xl p-4 mb-4 flex items-center justify-between">
      
      <div>
        <p className="text-sm text-gray-400">Posting to</p>
        <p className="font-semibold">Stanford University</p>
      </div>

      <div className="w-3 h-3 bg-teal-400 rounded-full"></div>
    </div>
  )
}

export default Audience