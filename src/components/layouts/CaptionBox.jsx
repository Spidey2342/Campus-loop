import React from 'react'
import { useState } from 'react'

function CaptionBox() {

const [text, setText] = useState("")

const handleSave = () => {
    const posts = JSON.parse(localStorage.getItem("posts")) || [];

    const newPost = {
      id: Date.now(),
      caption: text,
      createdAt: new Date(),
    };

    posts.push(newPost);

    localStorage.setItem("posts", JSON.stringify(posts));

    alert("Saved locally!");
  };
  return (
        <div className="bg-white/10 rounded-xl p-4 mb-4">
      
      <textarea
        placeholder="Write a caption..."
        value={text}
       onChange={(e) => setCaption(e.target.value)}
        maxLength={150}
        className="w-full bg-transparent outline-none resize-none"
      />

      <div className="text-right text-sm text-gray-400">
        {text.length} / 150
      </div>


      <button
        onClick={handleSave}
        className="mt-3 bg-teal-500 px-4 py-2 rounded"
      >
        Save Post
      </button>
    </div>
  )
}

export default CaptionBox