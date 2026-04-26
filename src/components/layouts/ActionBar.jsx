import React from 'react'
import { Heart, MessageCircle, Share2, Plus } from "lucide-react";
import { useState } from "react";

function ActionBar() {
  const [liked, setLiked] = useState(false);

  return (
    <div className="absolute bottom-24 right-3 flex flex-col items-center gap-5 text-white">
      
      {/* PROFILE */}
      <div className="relative">
        <img
          src="https://i.pravatar.cc/100"
          className="w-12 h-12 rounded-full border-2 border-white"
        />
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-teal-500 rounded-full p-1">
          <Plus size={14} />
        </div>
      </div>

      {/* LIKE */}
      <button
        onClick={() => setLiked(!liked)}
        className="flex flex-col items-center"
      >
        <Heart
          className={`transition-all duration-300 ${
            liked
              ? "text-red-500 scale-125 drop-shadow-lg"
              : "scale-100"
          }`}
          fill={liked ? "red" : "none"}
        />
        <span className="text-xs">84.2K</span>
      </button>

      <MessageCircle />
      <Share2 />
    </div>
  );
}

export default ActionBar;