import React, { useState, useEffect } from 'react'
import { X, Search, Send, Share2, Copy, Check } from 'lucide-react'

const BASE_URL = 'https://code-dreams-backend.onrender.com'

function ShareModal({ reel, onClose }) {
  const [conversations, setConversations] = useState([])
  const [search, setSearch]               = useState('')
  const [sending, setSending]             = useState({})   // { convId: true }
  const [sent, setSent]                   = useState({})   // { convId: true }
  const [copied, setCopied]               = useState(false)
  const [loading, setLoading]             = useState(true)

  const token = localStorage.getItem('token')
  const reelUrl = `${window.location.origin}/reel/${reel.id}`

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${BASE_URL}/messages/conversations`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const data = await res.json()
        setConversations(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = conversations.filter(c =>
    (c.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.username || '').toLowerCase().includes(search.toLowerCase())
  )

  const sendToConversation = async (convId) => {
    if (sending[convId] || sent[convId]) return
    setSending(prev => ({ ...prev, [convId]: true }))
    try {
      await fetch(`${BASE_URL}/messages/conversations/${convId}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          text: `🎬 ${reel.caption || 'Check out this reel!'}\n${reelUrl}`
        })
      })
      setSent(prev => ({ ...prev, [convId]: true }))
    } catch (err) {
      console.error(err)
    } finally {
      setSending(prev => ({ ...prev, [convId]: false }))
    }
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'CampusVibe',
          text: reel.caption || 'Check out this reel!',
          url: reelUrl,
        })
      } catch (_) {}
    } else {
      handleCopy()
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(reelUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (_) {}
  }

  const getInitials = (name) => {
    if (!name) return '?'
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end justify-center"
      onClick={onClose}>
      <div className="bg-zinc-900 w-full max-w-lg rounded-t-3xl border border-white/10 pb-8 animate-in slide-in-from-bottom duration-200"
        onClick={e => e.stopPropagation()}>

        {/* Handle */}
        <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mt-4 mb-4" />

        {/* Header */}
        <div className="flex items-center justify-between px-5 mb-4">
          <h2 className="text-white font-semibold text-lg">Share reel</h2>
          <button onClick={onClose}><X size={20} className="text-gray-400" /></button>
        </div>

        {/* Reel preview strip */}
        <div className="flex items-center gap-3 px-5 mb-4 bg-white/5 py-3">
          {reel.thumbnail_url && (
            <img src={reel.thumbnail_url} className="w-12 h-16 rounded-lg object-cover flex-shrink-0" />
          )}
          <div className="min-w-0">
            <p className="text-white text-sm font-medium truncate">@{reel.owner_username}</p>
            <p className="text-gray-400 text-xs truncate">{reel.caption || 'No caption'}</p>
          </div>
        </div>

        {/* External share buttons */}
        <div className="flex gap-3 px-5 mb-5">
          <button onClick={handleNativeShare}
            className="flex-1 flex items-center justify-center gap-2 bg-white/10 py-3 rounded-xl text-sm text-white hover:bg-white/20 transition">
            <Share2 size={16} />
            Share
          </button>
          <button onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-2 bg-white/10 py-3 rounded-xl text-sm text-white hover:bg-white/20 transition">
            {copied ? <Check size={16} className="text-teal-400" /> : <Copy size={16} />}
            {copied ? 'Copied!' : 'Copy link'}
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 px-5 mb-4">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-xs text-gray-500">Send in DM</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Search conversations */}
        <div className="px-5 mb-3">
          <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2">
            <Search size={14} className="text-gray-400 flex-shrink-0" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search conversations..."
              className="flex-1 bg-transparent text-sm text-white outline-none placeholder-gray-500"
            />
          </div>
        </div>

        {/* Conversation list */}
        <div className="max-h-52 overflow-y-auto px-5 space-y-1">
          {loading ? (
            <div className="flex justify-center py-6">
              <div className="w-5 h-5 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-6">
              {conversations.length === 0 ? 'No conversations yet' : 'No results'}
            </p>
          ) : (
            filtered.map(conv => (
              <div key={conv.id} className="flex items-center gap-3 py-2.5 rounded-xl hover:bg-white/5 transition">
                {conv.avatar_url ? (
                  <img src={conv.avatar_url} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-teal-800 flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {getInitials(conv.name)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{conv.name}</p>
                  {conv.username && <p className="text-gray-500 text-xs">@{conv.username}</p>}
                </div>
                <button
                  onClick={() => sendToConversation(conv.id)}
                  disabled={sending[conv.id] || sent[conv.id]}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition flex-shrink-0 ${
                    sent[conv.id]
                      ? 'bg-teal-500/20 text-teal-400'
                      : 'bg-teal-500 text-black hover:bg-teal-400'
                  } disabled:opacity-60`}
                >
                  {sent[conv.id] ? (
                    <><Check size={12} /> Sent</>
                  ) : sending[conv.id] ? (
                    '...'
                  ) : (
                    <><Send size={12} /> Send</>
                  )}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default ShareModal