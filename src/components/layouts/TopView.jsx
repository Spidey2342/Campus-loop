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

     
    </div>
  )
}

export default TopView