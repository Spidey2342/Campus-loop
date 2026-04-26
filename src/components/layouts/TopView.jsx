import React from 'react'
import { Send } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function TopView() {
    const navigate = useNavigate()
  return (
     <div className="flex items-center justify-between mb-4">
      
      <button className="text-gray-300"
      onClick={() => navigate("/feed")}
      >Cancel</button>

      <h2 className="font-semibold text-lg">New Post</h2>

      <button className="bg-teal-500 px-4 py-2 rounded-full flex items-center gap-2 text-black">
        Post <Send size={16} />
      </button>
    </div>
  )
}

export default TopView