import React, { useEffect, useRef, useState, useCallback } from 'react'
import { Type } from 'lucide-react'

function VideoEditor({ file, onEditChange }) {
  const videoRef   = useRef(null)
  const mediaRef   = useRef(null)    // drag bounds container
  const dragging   = useRef(null)    // { id, startX, startY, origX, origY }

  const [mediaURL, setMediaURL]         = useState(null)
  const [isPhoto, setIsPhoto]           = useState(false)
  const [duration, setDuration]         = useState(0)
  const [currentTime, setCurrentTime]   = useState(0)
  const [trimStart, setTrimStart]       = useState(0)
  const [trimEnd, setTrimEnd]           = useState(0)
  const [activeTab, setActiveTab]       = useState('trim')

  const [textOverlays, setTextOverlays] = useState([])
  const [editingText, setEditingText]   = useState(false)
  const [currentText, setCurrentText]   = useState('')
  const [textColor, setTextColor]       = useState('#ffffff')
  const [textSize, setTextSize]         = useState(24)

  const colors = ['#ffffff','#000000','#14b8a6','#ef4444','#f59e0b','#8b5cf6']

  // ── Load file ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!file) return
    const url = URL.createObjectURL(file)
    setMediaURL(url)
    const photo = file.type.startsWith('image/')
    setIsPhoto(photo)
    setTextOverlays([])
    if (photo) {
      setActiveTab('text')
      onEditChange({ trimStart: 0, trimEnd: 5, textOverlays: [] })
    }
    return () => URL.revokeObjectURL(url)
  }, [file])

  const handleLoadedMetadata = () => {
    const dur = videoRef.current?.duration || 0
    setDuration(dur)
    const end = Math.min(dur, 60)
    setTrimEnd(end)
    onEditChange({ trimStart: 0, trimEnd: end, textOverlays: [] })
  }

  const handleTimeUpdate = () => {
    const time = videoRef.current?.currentTime || 0
    setCurrentTime(time)
    if (time >= trimEnd) videoRef.current.currentTime = trimStart
  }

  const handleTrimChange = (start, end) => {
    setTrimStart(start)
    setTrimEnd(end)
    if (videoRef.current) videoRef.current.currentTime = start
    onEditChange({ trimStart: start, trimEnd: end, textOverlays })
  }

  const notify = useCallback((overlays) => {
    onEditChange({ trimStart, trimEnd, textOverlays: overlays })
  }, [trimStart, trimEnd])

  // ── Text add / remove ──────────────────────────────────────────────────────
  const handleAddText = () => {
    if (!currentText.trim()) return
    const overlay = { id: Date.now(), text: currentText, color: textColor, size: textSize, x: 50, y: 50 }
    const updated = [...textOverlays, overlay]
    setTextOverlays(updated)
    setCurrentText('')
    setEditingText(false)
    notify(updated)
  }

  const handleRemoveText = (id) => {
    const updated = textOverlays.filter(t => t.id !== id)
    setTextOverlays(updated)
    notify(updated)
  }

  // ── Drag handlers (pointer events — mouse + touch) ─────────────────────────
  const onPointerDown = (e, id) => {
    e.stopPropagation()
    e.currentTarget.setPointerCapture(e.pointerId)
    const overlay = textOverlays.find(t => t.id === id)
    dragging.current = { id, startX: e.clientX, startY: e.clientY, origX: overlay.x, origY: overlay.y }
  }

  const onPointerMove = (e) => {
    if (!dragging.current) return
    const rect = mediaRef.current?.getBoundingClientRect()
    if (!rect) return
    const dx = ((e.clientX - dragging.current.startX) / rect.width)  * 100
    const dy = ((e.clientY - dragging.current.startY) / rect.height) * 100
    const newX = Math.max(5, Math.min(95, dragging.current.origX + dx))
    const newY = Math.max(5, Math.min(95, dragging.current.origY + dy))
    setTextOverlays(prev => prev.map(t => t.id === dragging.current.id ? { ...t, x: newX, y: newY } : t))
  }

  const onPointerUp = () => {
    if (!dragging.current) return
    setTextOverlays(prev => { notify(prev); return prev })
    dragging.current = null
  }

  const formatTime = (s) => `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`

  return (
    <div className="mb-4">

      {/* ── Media preview ── */}
      <div
        ref={mediaRef}
        className="relative rounded-2xl overflow-hidden bg-black mb-3 select-none"
        style={{ touchAction: 'none' }}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        {isPhoto ? (
          <img
            src={mediaURL}
            alt="preview"
            draggable={false}
            className="w-full max-h-[55vh] object-contain"
          />
        ) : (
          <video
            ref={videoRef}
            src={mediaURL}
            className="w-full max-h-[55vh] object-cover"
            onLoadedMetadata={handleLoadedMetadata}
            onTimeUpdate={handleTimeUpdate}
            autoPlay loop playsInline
          />
        )}

        {/* Draggable text overlays */}
        {textOverlays.map(overlay => (
          <div
            key={overlay.id}
            className="absolute cursor-grab active:cursor-grabbing"
            style={{
              left: `${overlay.x}%`,
              top: `${overlay.y}%`,
              transform: 'translate(-50%, -50%)',
              color: overlay.color,
              fontSize: `${overlay.size}px`,
              fontWeight: 'bold',
              textShadow: '0 2px 6px rgba(0,0,0,0.9)',
              zIndex: 10,
              userSelect: 'none',
              WebkitUserSelect: 'none',
            }}
            onPointerDown={(e) => onPointerDown(e, overlay.id)}
          >
            {overlay.text}
            <button
              onPointerDown={e => e.stopPropagation()}
              onClick={() => handleRemoveText(overlay.id)}
              className="absolute -top-3 -right-3 bg-red-500 rounded-full w-5 h-5 flex items-center justify-center text-white text-xs leading-none"
            >✕</button>
          </div>
        ))}

        {/* Drag hint */}
        {textOverlays.length > 0 && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center pointer-events-none">
            <span className="bg-black/60 text-white text-xs px-3 py-1 rounded-full">
              hold &amp; drag text to reposition
            </span>
          </div>
        )}

        {/* Badges */}
        {isPhoto && (
          <div className="absolute top-3 left-3 bg-teal-500/90 px-2 py-1 rounded-lg text-black text-xs font-semibold">
            📷 Photo
          </div>
        )}
        {!isPhoto && duration > 0 && (
          <div className="absolute top-3 right-3 bg-black/60 px-2 py-1 rounded text-white text-xs">
            {formatTime(currentTime)} / {formatTime(trimEnd - trimStart)}
          </div>
        )}
      </div>

      {/* ── Tabs — no Trim for photos ── */}
      <div className="flex gap-2 mb-3">
        {!isPhoto && (
          <button
            onClick={() => setActiveTab('trim')}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === 'trim' ? 'bg-teal-500 text-black' : 'bg-white/10 text-white'}`}
          >✂ Trim</button>
        )}
        <button
          onClick={() => setActiveTab('text')}
          className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === 'text' ? 'bg-teal-500 text-black' : 'bg-white/10 text-white'}`}
        >T Text</button>
      </div>

      {/* ── Trim tab ── */}
      {activeTab === 'trim' && !isPhoto && (
        <div className="bg-white/10 rounded-xl p-4 space-y-4">
          <div className="flex justify-between text-xs text-gray-400">
            <span>Start: {formatTime(trimStart)}</span>
            <span>End: {formatTime(trimEnd)}</span>
            <span>Duration: {formatTime(trimEnd - trimStart)}</span>
          </div>

          <div className="relative h-12 bg-black/40 rounded-lg overflow-hidden">
            <div
              className="absolute top-0 bottom-0 bg-teal-500/30 border-x-2 border-teal-500"
              style={{ left: `${(trimStart/duration)*100}%`, width: `${((trimEnd-trimStart)/duration)*100}%` }}
            />
            <div className="absolute top-0 bottom-0 w-0.5 bg-white z-10" style={{ left: `${(currentTime/duration)*100}%` }} />
            <div className="absolute inset-0 flex items-center justify-center text-gray-600 text-xs">
              {duration > 0 ? 'drag handles to trim' : 'loading...'}
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-1 block">Start — {formatTime(trimStart)}</label>
            <input type="range" min={0} max={duration} step={0.1} value={trimStart}
              onChange={e => { const v = parseFloat(e.target.value); if (v < trimEnd - 1) handleTrimChange(v, trimEnd) }}
              className="w-full accent-teal-500"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">End — {formatTime(trimEnd)}</label>
            <input type="range" min={0} max={duration} step={0.1} value={trimEnd}
              onChange={e => { const v = parseFloat(e.target.value); if (v > trimStart + 1) handleTrimChange(trimStart, v) }}
              className="w-full accent-teal-500"
            />
          </div>

          {trimEnd - trimStart > 60 && (
            <p className="text-yellow-400 text-xs">⚠ Maximum reel length is 60 seconds</p>
          )}
        </div>
      )}

      {/* ── Text tab ── */}
      {activeTab === 'text' && (
        <div className="bg-white/10 rounded-xl p-4 space-y-3">

          {textOverlays.length > 0 && (
            <div className="space-y-2 mb-2">
              {textOverlays.map(overlay => (
                <div key={overlay.id} className="flex items-center justify-between bg-black/30 px-3 py-2 rounded-lg">
                  <span style={{ color: overlay.color }} className="text-sm font-medium">{overlay.text}</span>
                  <button onClick={() => handleRemoveText(overlay.id)} className="text-red-400 text-xs">Remove</button>
                </div>
              ))}
            </div>
          )}

          {editingText ? (
            <div className="space-y-3">
              <input
                type="text"
                value={currentText}
                onChange={e => setCurrentText(e.target.value)}
                placeholder="Type your text..."
                autoFocus
                className="w-full bg-black/30 rounded-xl px-4 py-3 text-white text-sm outline-none"
                onKeyDown={e => e.key === 'Enter' && handleAddText()}
              />

              <div>
                <p className="text-xs text-gray-400 mb-2">Color</p>
                <div className="flex gap-2">
                  {colors.map(c => (
                    <button key={c} onClick={() => setTextColor(c)}
                      className="w-8 h-8 rounded-full border-2 transition-all flex-shrink-0"
                      style={{ background: c, borderColor: textColor === c ? '#14b8a6' : 'transparent' }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-400 mb-1">Size — {textSize}px</p>
                <input type="range" min={14} max={48} value={textSize}
                  onChange={e => setTextSize(parseInt(e.target.value))}
                  className="w-full accent-teal-500"
                />
              </div>

              <div className="bg-black/40 rounded-xl p-4 text-center" style={{ color: textColor, fontSize: textSize, fontWeight: 'bold' }}>
                {currentText || 'Preview'}
              </div>

              <div className="flex gap-2">
                <button onClick={() => { setEditingText(false); setCurrentText('') }}
                  className="flex-1 border border-white/20 py-2 rounded-xl text-sm text-gray-400">
                  Cancel
                </button>
                <button onClick={handleAddText} disabled={!currentText.trim()}
                  className="flex-1 bg-teal-500 py-2 rounded-xl text-sm text-black font-semibold disabled:opacity-40">
                  Add to {isPhoto ? 'photo' : 'video'}
                </button>
              </div>
            </div>
          ) : (
            <button onClick={() => setEditingText(true)}
              className="w-full border border-dashed border-white/30 py-3 rounded-xl text-sm text-gray-400 flex items-center justify-center gap-2">
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