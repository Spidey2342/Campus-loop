import React, { useEffect, useState, useRef } from 'react'
import { X, Send } from 'lucide-react'
import { commentOnReel } from '../../services/api'

// ✅ uses environment variable instead of hardcoded localhost
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"

function CommentDrawer({ reel, token, onClose, onCommentAdded }) {
  const [comments, setComments] = useState([])
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(true)
  const [posting, setPosting] = useState(false)
  const inputRef = useRef(null)
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}")

  useEffect(() => {
    const loadComments = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/reels/${reel.id}/comments`,
          { headers: { Authorization: `Bearer ${token}` } }
        )

        // Safety check — make sure response is ok before parsing
        if (!response.ok) {
          setComments([])
          return
        }

        const data = await response.json()
        // Safety check — make sure data is an array
        setComments(Array.isArray(data) ? data : [])

      } catch (err) {
        console.error(err)
        setComments([])
      } finally {
        setLoading(false)
      }
    }

    loadComments()
    setTimeout(() => inputRef.current?.focus(), 300)
  }, [reel.id])

  const handlePostComment = async () => {
    if (!text.trim()) return
    setPosting(true)

    try {
      const newComment = await commentOnReel(reel.id, text, token)
      setComments(prev => [{
        ...newComment,
        username: currentUser.username,
        avatar_url: currentUser.avatar_url,
      }, ...prev])
      setText("")
      onCommentAdded()
    } catch (err) {
      console.error(err)
    } finally {
      setPosting(false)
    }
  }

  const formatTime = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return "just now"
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    return `${Math.floor(hrs / 24)}d ago`
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end" onClick={onClose}>
      <div
        className="w-full bg-gray-900 rounded-t-2xl max-h-[75vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <h3 className="font-semibold text-white">
            {comments.length} Comments
          </h3>
          <button onClick={onClose}>
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
          {loading ? (
            <p className="text-gray-500 text-sm text-center py-8">
              Loading comments...
            </p>
          ) : comments.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-8">
              No comments yet — be the first!
            </p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <img
                  src={comment.avatar_url || "https://i.pravatar.cc/40"}
                  className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-white text-sm font-semibold">
                      @{comment.username}
                    </span>
                    <span className="text-gray-500 text-xs">
                      {formatTime(comment.created_at)}
                    </span>
                  </div>
                  <p className="text-gray-200 text-sm mt-0.5 leading-snug">
                    {comment.text}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="px-4 py-3 border-t border-white/10 flex items-center gap-3">
          <img
            src={currentUser.avatar_url || "https://i.pravatar.cc/40"}
            className="w-9 h-9 rounded-full object-cover flex-shrink-0"
          />
          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a comment..."
            onKeyDown={(e) => e.key === "Enter" && handlePostComment()}
            className="flex-1 bg-white/10 rounded-full px-4 py-2 text-sm text-white outline-none placeholder-gray-500"
          />
          <button
            onClick={handlePostComment}
            disabled={!text.trim() || posting}
            className="text-teal-400 disabled:opacity-30"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default CommentDrawer