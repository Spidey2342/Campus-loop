import React, { useState } from 'react'
import VideoEditor from '../components/layouts/VideoEditor'
import TopView from '../components/layouts/TopView'
import { Send } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { uploadReel } from '../services/api'

function UploadPage() {
  const navigate = useNavigate()
  const [videoFile, setVideoFile] = useState(null)
  const [caption, setCaption] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [progress, setProgress] = useState("")

  // Edit settings from VideoEditor
  const [editSettings, setEditSettings] = useState({
    trimStart: 0,
    trimEnd: 60,
    textOverlays: []
  })

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}")
  const token = localStorage.getItem("token")

  const handleFile = (e) => {
    const file = e.target.files[0]
    if (file) setVideoFile(file)
  }

  const handleUpload = async () => {
    if (!videoFile) {
      setError("Please choose a video first")
      return
    }

    if (editSettings.trimEnd - editSettings.trimStart > 60) {
      setError("Please trim your video to 60 seconds or less")
      return
    }

    setError("")
    setLoading(true)
    setProgress("Uploading your reel...")

    try {
      const formData = new FormData()
      formData.append("video", videoFile)
      formData.append("caption", caption)
      formData.append("school_tag", currentUser.school_name || "")

      // Send trim times to backend — Cloudinary will trim server-side
      formData.append("trim_start", editSettings.trimStart.toString())
      formData.append("trim_end", editSettings.trimEnd.toString())

      // Send text overlays as JSON string
      formData.append("text_overlays", JSON.stringify(editSettings.textOverlays))

      const data = await uploadReel(formData, token)
      setProgress("Posted! 🎉")
      setTimeout(() => navigate("/feed"), 1000)

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-teal-900 text-white px-4 py-4">
      <TopView />

      {/* File picker */}
      <label className="flex items-center gap-2 mb-4 cursor-pointer bg-white/10 px-4 py-2 rounded-full w-fit text-sm text-gray-200 hover:bg-white/20">
        📎 Choose video
        <input type="file" accept="video/*" onChange={handleFile} className="hidden" />
      </label>

      {/* Video editor — only shows when file is selected */}
      {videoFile ? (
        <VideoEditor
          file={videoFile}
          onEditChange={setEditSettings}
        />
      ) : (
        <div className="w-full h-48 bg-white/5 rounded-2xl flex flex-col items-center justify-center mb-4 border border-dashed border-white/20">
          <p className="text-3xl mb-2">🎬</p>
          <p className="text-gray-400 text-sm">Choose a video to get started</p>
        </div>
      )}

      {/* Caption */}
      <div className="bg-white/10 rounded-xl p-4 mb-4">
        <textarea
          placeholder="Write a caption... use #hashtags"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          maxLength={150}
          className="w-full bg-transparent outline-none resize-none text-white placeholder-gray-500"
          rows={3}
        />
        <div className="text-right text-sm text-gray-400">
          {caption.length} / 150
        </div>
      </div>

      {/* School tag */}
      <div className="bg-white/10 rounded-xl p-4 mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400">Posting from</p>
          <p className="font-semibold">
            {currentUser.school_name || "No school set"}
          </p>
        </div>
        <div className="w-3 h-3 bg-teal-400 rounded-full"></div>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-300 text-sm px-4 py-3 rounded-xl mb-4">
          {error}
        </div>
      )}

      {progress && (
        <div className="bg-teal-500/20 border border-teal-500/50 text-teal-300 text-sm px-4 py-3 rounded-xl mb-4">
          {progress}
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={loading || !videoFile}
        className="w-full bg-teal-500 disabled:opacity-50 disabled:cursor-not-allowed py-4 rounded-xl font-semibold flex items-center justify-center gap-2 text-black"
      >
        <Send size={18} />
        {loading ? "Uploading..." : "Post to CampusReel"}
      </button>
    </div>
  )
}

export default UploadPage