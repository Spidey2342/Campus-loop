import React from 'react'
import { Home, Compass, Plus, MessageCircle, User } from "lucide-react";
import { useNavigate } from 'react-router-dom';
function BottomNav() {
    const navigate = useNavigate()
  return (
    <div className="fixed bottom-0 left-0 w-full bg-black/80 backdrop-blur-md py-3 pb-safe flex justify-around items-center text-white z-50"
    style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      
      <div className="flex flex-col items-center text-teal-400">
        <Home />
        <span className="text-xs">Home</span>
      </div>

      <div className="flex flex-col items-center text-gray-400">
        <Compass />
        <span className="text-xs">Discover</span>
      </div>

      {/* CENTER BUTTON */}
      <button className="bg-teal-500 p-3 rounded-full -mt-6 shadow-lg"
      onClick={() => navigate("/upload")}
      >
        <Plus className="text-black" />
      </button>

      <div className="flex flex-col items-center text-gray-400">
        <MessageCircle />
        <span className="text-xs">Messages</span>
      </div>

      <div className="flex flex-col items-center text-gray-400">
        <User />
        <span className="text-xs">Profile</span>
      </div>
    </div>
  )
}

export default BottomNav