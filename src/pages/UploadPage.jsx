import React, { useState } from 'react'
import VideoEditor from '../components/layouts/VideoEditor'
import TopView from '../components/layouts/TopView'
import { Send } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { uploadReel } from '../services/api'

function UploadPage() {
  const navigate = useNavigate()
  const [mediaFile, setMediaFile]       = useState(null)
  const [isPhoto, setIsPhoto]           = useState(false)
  const [caption, setCaption]           = useState('')
  const [loading, setLoading]           = useState(false)
  const [error, setError]               = useState('')
  const [progress, setProgress]         = useState('')
  const [editSettings, setEditSettings] = useState({ trimStart: 0, trimEnd: 60, textOverlays: [] })

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
  const token = localStorage.getItem('token')

  const handleFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setMediaFile(file)
    setIsPhoto(file.type.startsWith('image/'))
    setError('')
  }

  const handleUpload = async () => {
    if (!mediaFile) {
      setError(`Please choose a ${isPhoto ? 'photo' : 'video'} first`)
      return
    }
    // Trim validation only for videos
    if (!isPhoto && editSettings.trimEnd - editSettings.trimStart > 60) {
      setError('Please trim your video to 60 seconds or less')
      return
    }

    setError('')
    setLoading(true)
    setProgress(isPhoto ? 'Uploading your photo...' : 'Uploading your reel...')

    try {
      const formData = new FormData()
      formData.append('video', mediaFile)          // backend field is still "video"
      formData.append('caption', caption)
      formData.append('school_tag', currentUser.school_name || '')
      formData.append('trim_start', editSettings.trimStart.toString())
      formData.append('trim_end', editSettings.trimEnd.toString())
      formData.append('text_overlays', JSON.stringify(editSettings.textOverlays))

      await uploadReel(formData, token)
      setProgress('Posted! 🎉')
      setTimeout(() => navigate('/feed'), 1000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-teal-900 text-white px-4 py-4">
      <TopView />

      {/* File picker or editor */}
      {mediaFile ? (
        <VideoEditor file={mediaFile} onEditChange={setEditSettings} />
      ) : (
        <label className="w-full h-56 bg-white/5 rounded-2xl flex flex-col items-center justify-center mb-4 border border-dashed border-white/20 cursor-pointer hover:bg-white/10 transition-all">
          <p className="text-4xl mb-3">🎬</p>
          <p className="text-white font-semibold text-sm mb-1">Tap to choose a video or photo</p>
          <p className="text-gray-500 text-xs">MP4, MOV up to 100MB · JPG, PNG up to 20MB</p>
          <input
            type="file"
            accept="video/*,image/*"
            onChange={handleFile}
            className="hidden"
          />
        </label>
      )}

      {/* Change file button — shown after a file is picked */}
      {mediaFile && (
        <label className="flex items-center justify-center gap-2 text-xs text-gray-400 mb-4 cursor-pointer">
          <span>Change {isPhoto ? 'photo' : 'video'}</span>
          <input type="file" accept="video/*,image/*" onChange={handleFile} className="hidden" />
        </label>
      )}

      {/* Caption */}
      <div className="bg-white/10 rounded-xl p-4 mb-4">
        <textarea
          placeholder="Write a caption... use #hashtags"
          value={caption}
          onChange={e => setCaption(e.target.value)}
          maxLength={150}
          className="w-full bg-transparent outline-none resize-none text-white placeholder-gray-500"
          rows={3}
        />
        <div className="text-right text-sm text-gray-400">{caption.length} / 150</div>
      </div>

      {/* School tag */}
      <div className="bg-white/10 rounded-xl p-4 mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400">Posting from</p>
          <p className="font-semibold">{currentUser.school_name || 'No school set'}</p>
        </div>
        <div className="w-3 h-3 bg-teal-400 rounded-full" />
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
        disabled={loading || !mediaFile}
        className="w-full bg-teal-500 disabled:opacity-50 disabled:cursor-not-allowed py-4 rounded-xl font-semibold flex items-center justify-center gap-2 text-black"
      >
        <Send size={18} />
        {loading ? 'Uploading...' : `Post ${isPhoto ? 'Photo' : 'Reel'} to CampusVibe`}
      </button>
    </div>
  )
}

export default UploadPage