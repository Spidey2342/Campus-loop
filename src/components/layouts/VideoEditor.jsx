import React, { useEffect, useRef, useState } from 'react'
import { Music, Type, Check, X } from 'lucide-react'

function VideoEditor({ file, onEditChange }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [videoURL, setVideoURL] = useState(null)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [trimStart, setTrimStart] = useState(0)
  const [trimEnd, setTrimEnd] = useState(0)
  const [activeTab, setActiveTab] = useState("trim") // "trim" | "text"

  // Text overlay state
  const [textOverlays, setTextOverlays] = useState([])
  const [currentText, setCurrentText] = useState("")
  const [textColor, setTextColor] = useState("#ffffff")
  const [textSize, setTextSize] = useState(24)
  const [editingText, setEditingText] = useState(false)

  // Load video when file changes
  useEffect(() => {
    if (!file) return
    const url = URL.createObjectURL(file)
    setVideoURL(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  // When video loads, set duration and default trim end
  const handleLoadedMetadata = () => {
    const dur = videoRef.current?.duration || 0
    setDuration(dur)
    setTrimEnd(Math.min(dur, 60)) // max 60 seconds
    // Notify parent of initial edit settings
    onEditChange({ trimStart: 0, trimEnd: Math.min(dur, 60), textOverlays: [] })
  }

  // Update current time as video plays
  const handleTimeUpdate = () => {
    const time = videoRef.current?.currentTime || 0
    setCurrentTime(time)
    // Stop at trim end point
    if (time >= trimEnd) {
      videoRef.current.currentTime = trimStart
    }
  }

  // When trim handles change — notify parent
  const handleTrimChange = (start, end) => {
    setTrimStart(start)
    setTrimEnd(end)
    if (videoRef.current) {
      videoRef.current.currentTime = start
    }
    onEditChange({ trimStart: start, trimEnd: end, textOverlays })
  }

  const handleAddText = () => {
    if (!currentText.trim()) return
    const newOverlay = {
      id: Date.now(),
      text: currentText,
      color: textColor,
      size: textSize,
      // Position as percentage of video dimensions
      // so it works on any screen size
      x: 50, // center horizontally
      y: 50, // center vertically
    }
    const updated = [...textOverlays, newOverlay]
    setTextOverlays(updated)
    setCurrentText("")
    setEditingText(false)
    onEditChange({ trimStart, trimEnd, textOverlays: updated })
  }

  const handleRemoveText = (id) => {
    const updated = textOverlays.filter(t => t.id !== id)
    setTextOverlays(updated)
    onEditChange({ trimStart, trimEnd, textOverlays: updated })
  }

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60)
    const s = Math.floor(secs % 60)
    return `${m}:${String(s).padStart(2, "0")}`
  }

  const colors = ["#ffffff", "#000000", "#14b8a6", "#ef4444", "#f59e0b", "#8b5cf6"]

  return (
    <div className="mb-4">

      {/* Video preview */}
      <div className="relative rounded-2xl overflow-hidden bg-black mb-3">
        <video
          ref={videoRef}
          src={videoURL}
          className="w-full max-h-[55vh] object-cover"
          onLoadedMetadata={handleLoadedMetadata}
          onTimeUpdate={handleTimeUpdate}
          autoPlay
          loop
          playsInline
        />

        {/* Text overlays rendered on top of video */}
        {textOverlays.map((overlay) => (
          <div
            key={overlay.id}
            className="absolute cursor-move select-none"
            style={{
              left: `${overlay.x}%`,
              top: `${overlay.y}%`,
              transform: "translate(-50%, -50%)",
              color: overlay.color,
              fontSize: `${overlay.size}px`,
              fontWeight: "bold",
              textShadow: "0 2px 4px rgba(0,0,0,0.8)",
              zIndex: 10,
            }}
          >
            {overlay.text}
            {/* Remove button */}
            <button
              onClick={() => handleRemoveText(overlay.id)}
              className="absolute -top-3 -right-3 bg-red-500 rounded-full w-5 h-5 flex items-center justify-center text-white text-xs"
            >
              ✕
            </button>
          </div>
        ))}

        {/* Current time indicator */}
        <div className="absolute top-3 right-3 bg-black/60 px-2 py-1 rounded text-white text-xs">
          {formatTime(currentTime)} / {formatTime(trimEnd - trimStart)}s
        </div>
      </div>

      {/* Editor tabs */}
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => setActiveTab("trim")}
          className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === "trim"
              ? "bg-teal-500 text-black"
              : "bg-white/10 text-white"
          }`}
        >
          ✂ Trim
        </button>
        <button
          onClick={() => setActiveTab("text")}
          className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === "text"
              ? "bg-teal-500 text-black"
              : "bg-white/10 text-white"
          }`}
        >
          T Text
        </button>
      </div>

      {/* TRIM TAB */}
      {activeTab === "trim" && (
        <div className="bg-white/10 rounded-xl p-4 space-y-4">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Start: {formatTime(trimStart)}</span>
            <span>End: {formatTime(trimEnd)}</span>
            <span>Duration: {formatTime(trimEnd - trimStart)}</span>
          </div>

          {/* Trim timeline */}
          <div className="relative h-12 bg-black/40 rounded-lg overflow-hidden">

            {/* Selected range highlight */}
            <div
              className="absolute top-0 bottom-0 bg-teal-500/30 border-x-2 border-teal-500"
              style={{
                left: `${(trimStart / duration) * 100}%`,
                width: `${((trimEnd - trimStart) / duration) * 100}%`,
              }}
            />

            {/* Current time indicator */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-white z-10"
              style={{ left: `${(currentTime / duration) * 100}%` }}
            />

            {/* Video thumbnail frames — visual representation */}
            <div className="absolute inset-0 flex items-center justify-center text-gray-600 text-xs">
              {duration > 0 ? "drag handles to trim" : "loading..."}
            </div>
          </div>

          {/* Start trim slider */}
          <div>
            <label className="text-xs text-gray-400 mb-1 block">
              Start point — {formatTime(trimStart)}
            </label>
            <input
              type="range"
              min={0}
              max={duration}
              step={0.1}
              value={trimStart}
              onChange={(e) => {
                const val = parseFloat(e.target.value)
                // Start can't go past end minus 1 second
                if (val < trimEnd - 1) handleTrimChange(val, trimEnd)
              }}
              className="w-full accent-teal-500"
            />
          </div>

          {/* End trim slider */}
          <div>
            <label className="text-xs text-gray-400 mb-1 block">
              End point — {formatTime(trimEnd)}
            </label>
            <input
              type="range"
              min={0}
              max={duration}
              step={0.1}
              value={trimEnd}
              onChange={(e) => {
                const val = parseFloat(e.target.value)
                // End can't go before start plus 1 second
                if (val > trimStart + 1) handleTrimChange(trimStart, val)
              }}
              className="w-full accent-teal-500"
            />
          </div>

          {/* Max duration warning */}
          {trimEnd - trimStart > 60 && (
            <p className="text-yellow-400 text-xs">
              ⚠ Maximum reel length is 60 seconds
            </p>
          )}
        </div>
      )}

      {/* TEXT TAB */}
      {activeTab === "text" && (
        <div className="bg-white/10 rounded-xl p-4 space-y-3">

          {/* Existing overlays */}
          {textOverlays.length > 0 && (
            <div className="space-y-2 mb-3">
              {textOverlays.map((overlay) => (
                <div
                  key={overlay.id}
                  className="flex items-center justify-between bg-black/30 px-3 py-2 rounded-lg"
                >
                  <span style={{ color: overlay.color }} className="text-sm font-medium">
                    {overlay.text}
                  </span>
                  <button
                    onClick={() => handleRemoveText(overlay.id)}
                    className="text-red-400 text-xs"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add new text */}
          {editingText ? (
            <div className="space-y-3">
              <input
                type="text"
                value={currentText}
                onChange={(e) => setCurrentText(e.target.value)}
                placeholder="Type your text..."
                autoFocus
                className="w-full bg-black/30 rounded-xl px-4 py-3 text-white text-sm outline-none"
                onKeyDown={(e) => e.key === "Enter" && handleAddText()}
              />

              {/* Color picker */}
              <div>
                <p className="text-xs text-gray-400 mb-2">Color</p>
                <div className="flex gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setTextColor(color)}
                      className="w-8 h-8 rounded-full border-2 transition-all"
                      style={{
                        background: color,
                        borderColor: textColor === color ? "#14b8a6" : "transparent"
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Size slider */}
              <div>
                <p className="text-xs text-gray-400 mb-1">
                  Size — {textSize}px
                </p>
                <input
                  type="range"
                  min={14}
                  max={48}
                  value={textSize}
                  onChange={(e) => setTextSize(parseInt(e.target.value))}
                  className="w-full accent-teal-500"
                />
              </div>

              {/* Preview */}
              <div
                className="bg-black/40 rounded-xl p-4 text-center"
                style={{ color: textColor, fontSize: textSize, fontWeight: "bold" }}
              >
                {currentText || "Preview"}
              </div>

              {/* Confirm / Cancel */}
              <div className="flex gap-2">
                <button
                  onClick={() => { setEditingText(false); setCurrentText("") }}
                  className="flex-1 border border-white/20 py-2 rounded-xl text-sm text-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddText}
                  disabled={!currentText.trim()}
                  className="flex-1 bg-teal-500 py-2 rounded-xl text-sm text-black font-semibold disabled:opacity-40"
                >
                  Add to video
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setEditingText(true)}
              className="w-full border border-dashed border-white/30 py-3 rounded-xl text-sm text-gray-400 flex items-center justify-center gap-2"
            >
              <Type size={16} />
              Add text overlay
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default VideoEditor