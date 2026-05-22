import React, { useState } from 'react'
import { Heart, MessageCircle, Share2, Plus, Trash2, MoreVertical, Flag, Download } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import CommentDrawer from './CommentDrawer'
import ReportModal from './ReportModal'
import ShareModal from './ShareModal'
import { deleteReel } from '../../services/api'

function ActionBar({ reel, isLiked, likesCount, onLike, onDelete, onDownload }) {
  const [showComments, setShowComments] = useState(false)
  const [showOptions, setShowOptions] = useState(false)
  const [commentsCount, setCommentsCount] = useState(reel.comments_count)
  const navigate = useNavigate()
  const token = localStorage.getItem("token")
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}")
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showReport, setShowReport] = useState(false)
  const [showShare, setShowShare] = useState(false)

  // Check if this reel belongs to the logged in user
  const isOwner = currentUser.id === reel.owner_id

  const handleShare = async () => {
    const shareData = {
      title: `${reel.owner_username} on CampusVibe`,
      text: reel.caption || "Check out this reel on CampusVibe!",
      url: `${window.location.origin}/reel/${reel.id}`,
    }

    // Web Share API — this opens the native share sheet on mobile
    // On Android it shows WhatsApp, Twitter, etc
    // On desktop it falls back to copying the link
    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        // User cancelled share — not an error
        if (err.name !== "AbortError") console.error(err)
      }
    } else {
      // Desktop fallback — copy link to clipboard
      await navigator.clipboard.writeText(shareData.url)
      alert("Link copied to clipboard!")
    }
  }

  const handleDelete = async () => {
  setIsDeleting(true)

  try {
    await deleteReel(reel.id, token)

    if (onDelete) onDelete(reel.id)

    setShowDeleteModal(false)
  } catch (err) {
    console.error(err)
  } finally {
    setIsDeleting(false)
  }
}
  return (
    <>
      <div className="absolute bottom-24 right-3 flex flex-col items-center gap-5 text-white z-20">

        {/* Profile avatar */}
        <div
          className="relative cursor-pointer"
          onClick={() => navigate(`/profile/${reel.owner_username}`)}
        >
          <img
            src={reel.owner_avatar}
            className="w-12 h-12 rounded-full border-2 border-white object-cover"
          />
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-teal-500 rounded-full p-1">
            <Plus size={14} />
          </div>
        </div>

        {/* Like */}
        <button
          onClick={(e) => { e.stopPropagation(); onLike() }}
          className="flex flex-col items-center"
        >
          <Heart
            className={`transition-all duration-300 ${
              isLiked ? "text-red-500 scale-125" : "scale-100"
            }`}
            fill={isLiked ? "red" : "none"}
            size={28}
          />
          <span className="text-xs mt-1">
            {likesCount >= 1000
              ? `${(likesCount / 1000).toFixed(1)}K`
              : likesCount}
          </span>
        </button>

        {/* Comment */}
        <button
          onClick={(e) => { e.stopPropagation(); setShowComments(true) }}
          className="flex flex-col items-center"
        >
          <MessageCircle size={28} />
          <span className="text-xs mt-1">
            {commentsCount >= 1000
              ? `${(commentsCount / 1000).toFixed(1)}K`
              : commentsCount}
          </span>
        </button>

        {/* Share */}
        <button
          onClick={(e) => { e.stopPropagation(); setShowShare(true) }}
          className="flex flex-col items-center"
        >
          <Share2 size={28} />
          <span className="text-xs mt-1">Share</span>
        </button>

        {/* Download */}
        {onDownload && (
          <button
            onClick={onDownload}
            className="flex flex-col items-center"
          >
            <Download size={28} />
            <span className="text-xs mt-1">Save</span>
          </button>
        )}

        {/* More options — owner sees delete, others see report */}
        <button
          onClick={(e) => { e.stopPropagation(); setShowOptions(!showOptions) }}
          className="flex flex-col items-center"
        >
          <MoreVertical size={28} />
        </button>

      </div>

      {/* Options menu */}
      {showOptions && (
        <div
          className="absolute bottom-24 right-16 bg-gray-900 rounded-xl overflow-hidden z-30 border border-white/10"
          onClick={(e) => e.stopPropagation()}
        >
          {isOwner ? (
            <button
              onClick={() => { setShowOptions(false); setShowDeleteModal(true) }}
              className="flex items-center gap-3 px-5 py-3 text-red-400 hover:bg-white/10 w-full text-sm"
            >
              <Trash2 size={16} />
              Delete reel
            </button>
          ) : (
            <button
              onClick={() => { setShowOptions(false); setShowReport(true) }}
              className="flex items-center gap-3 px-5 py-3 text-orange-400 hover:bg-white/10 w-full text-sm"
            >
              <Flag size={16} />
              Report
            </button>
          )}
        </div>
      )}
{showDeleteModal && (
  <div
    className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
    onClick={() => setShowDeleteModal(false)}
  >
    <div
      className="bg-zinc-900 w-full max-w-sm rounded-2xl p-6 border border-white/10 animate-in fade-in zoom-in duration-200"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Title */}
      <h2 className="text-white text-lg font-semibold">
        Delete Reel?
      </h2>

      {/* Message */}
      <p className="text-gray-400 text-sm mt-2 leading-relaxed">
        This action cannot be undone. The reel and all interactions will be permanently removed.
      </p>

      {/* Buttons */}
      <div className="flex gap-3 mt-6">
        
        {/* Cancel */}
        <button
          onClick={() => setShowDeleteModal(false)}
          className="flex-1 bg-white/10 hover:bg-white/20 transition rounded-xl py-3 text-sm text-white"
        >
          Cancel
        </button>

        {/* Delete */}
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="flex-1 bg-red-500 hover:bg-red-600 transition rounded-xl py-3 text-sm font-medium text-white"
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>

      </div>
    </div>
  </div>
)}
      {/* Comment drawer */}
      {showComments && (
        <CommentDrawer
          reel={reel}
          token={token}
          onClose={() => setShowComments(false)}
          onCommentAdded={() => setCommentsCount(prev => prev + 1)}
        />
      )}

      {/* Report modal */}
      {showReport && (
        <ReportModal reelId={reel.id} onClose={() => setShowReport(false)} />
      )}

      {showShare && (
        <ShareModal reel={reel} onClose={() => setShowShare(false)} />
      )}
    </>
  )
}

export default ActionBar