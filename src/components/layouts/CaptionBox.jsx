import React from 'react'
import { useState } from 'react'

function CaptionBox() {

const [text, setText] = useState("")
  return (
        <div className="bg-white/10 rounded-xl p-4 mb-4">
      
      <textarea
        placeholder="Write a caption..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        maxLength={150}
        className="w-full bg-transparent outline-none resize-none"
      />

      <div className="text-right text-sm text-gray-400">
        {text.length} / 150
      </div>
    </div>
  )
}

export default CaptionBox