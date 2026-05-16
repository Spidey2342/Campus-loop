import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Send, Plus, MoreVertical } from 'lucide-react'
import { getMessages } from '../services/api'

const BASE_URL = 'https://campus-backend-moz5.onrender.com'
const WS_URL   = 'wss://campus-backend-moz5.onrender.com'

function ChatPage() {
  const { conversationId } = useParams()
  const navigate = useNavigate()

  const [messages, setMessages]   = useState([])
  const [convInfo, setConvInfo]   = useState(null)
  const [text, setText]           = useState('')
  const [loading, setLoading]     = useState(true)
  const [sending, setSending]     = useState(false)
  const [connected, setConnected] = useState(false)

  const bottomRef      = useRef(null)
  const inputRef       = useRef(null)
  const wsRef          = useRef(null)
  const reconnectTimer = useRef(null)

  const token       = localStorage.getItem('token')
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}')

  // Load initial messages + conversation info
  useEffect(() => {
    const load = async () => {
      try {
        const [convRes, msgData] = await Promise.all([
          fetch(`${BASE_URL}/messages/conversations`, {
            headers: { Authorization: `Bearer ${token}` }
          }).then(r => r.json()),
          getMessages(conversationId, token)
        ])
        const thisConv = Array.isArray(convRes)
          ? convRes.find(c => c.id === conversationId)
          : null
        setConvInfo(thisConv)
        setMessages(Array.isArray(msgData) ? msgData : [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [conversationId])

  // WebSocket connection with auto-reconnect
  const connectWS = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return

    const ws = new WebSocket(`${WS_URL}/messages/ws/${conversationId}?token=${token}`)
    wsRef.current = ws

    ws.onopen = () => {
      setConnected(true)
      if (reconnectTimer.current) { clearTimeout(reconnectTimer.current); reconnectTimer.current = null }
    }

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data)
        setMessages(prev => {
          if (prev.some(m => m.id === msg.id)) return prev
          return [...prev, { ...msg, is_mine: msg.sender_id === currentUser.id }]
        })
      } catch (e) { console.error('WS parse error', e) }
    }

    ws.onclose = () => {
      setConnected(false)
      reconnectTimer.current = setTimeout(() => connectWS(), 3000)
    }

    ws.onerror = () => ws.close()
  }, [conversationId, token])

  useEffect(() => {
    connectWS()
    return () => {
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current)
      wsRef.current?.close()
    }
  }, [connectWS])

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!text.trim() || sending) return
    const messageText = text.trim()
    setText('')
    setSending(true)

    // Optimistic message
    const optimistic = {
      id: `temp-${Date.now()}`,
      text: messageText,
      message_type: 'text',
      sender_id: currentUser.id,
      sender_username: currentUser.username,
      sender_avatar: currentUser.avatar_url,
      is_mine: true,
      created_at: new Date().toISOString(),
    }
    setMessages(prev => [...prev, optimistic])

    try {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ text: messageText }))
      } else {
        // HTTP fallback if WS is down
        await fetch(`${BASE_URL}/messages/conversations/${conversationId}/send`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ text: messageText }),
        })
        const fresh = await getMessages(conversationId, token)
        setMessages(Array.isArray(fresh) ? fresh : [])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSending(false)
    }
  }

  const formatTime = (dateStr) => {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const getInitials = (name) => {
    if (!name) return '?'
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
  }

  const groupedMessages = messages.reduce((groups, msg) => {
    const date = new Date(msg.created_at).toLocaleDateString()
    if (!groups[date]) groups[date] = []
    groups[date].push(msg)
    return groups
  }, {})

  return (
    <div className="h-screen bg-black text-white flex flex-col">

      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10 flex-shrink-0">
        <button onClick={() => navigate('/messages')}><ArrowLeft size={20} /></button>

        {convInfo?.avatar_url ? (
          <img src={convInfo.avatar_url} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-teal-800 flex items-center justify-center text-sm font-bold flex-shrink-0">
            {getInitials(convInfo?.name || '?')}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-sm truncate">{convInfo?.name || 'Loading...'}</p>
            {convInfo?.school_name && (
              <span className="text-xs bg-teal-900/50 text-teal-400 px-2 py-0.5 rounded-full flex-shrink-0">
                {convInfo.school_name.split(' ')[0]}
              </span>
            )}
            {convInfo?.type === 'group' && (
              <span className="text-xs bg-purple-900/50 text-purple-400 px-2 py-0.5 rounded-full flex-shrink-0">GROUP</span>
            )}
          </div>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <span className={`w-1.5 h-1.5 rounded-full inline-block ${connected ? 'bg-teal-400' : 'bg-gray-500'}`} />
            {connected ? 'Online' : 'Reconnecting...'}
          </p>
        </div>

        <button onClick={() => { if (convInfo?.username) navigate(`/profile/${convInfo.username}`) }} className="text-gray-400">
          <MoreVertical size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <div className="w-6 h-6 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <p className="text-3xl">👋</p>
            <p className="text-gray-400 text-sm">Say hello!</p>
          </div>
        ) : (
          Object.entries(groupedMessages).map(([date, msgs]) => (
            <div key={date}>
              <div className="flex items-center justify-center my-4">
                <div className="bg-white/10 px-3 py-1 rounded-full">
                  <p className="text-xs text-gray-400">
                    {new Date(date).toDateString() === new Date().toDateString() ? 'Today' : date}
                  </p>
                </div>
              </div>

              {msgs.map((msg, i) => {
                if (msg.message_type === 'system') return (
                  <div key={msg.id} className="flex justify-center my-2">
                    <p className="text-xs text-gray-500 bg-white/5 px-3 py-1 rounded-full">{msg.text}</p>
                  </div>
                )

                const isMine = msg.is_mine
                const showAvatar = !isMine && (i === 0 || msgs[i-1]?.sender_id !== msg.sender_id)

                return (
                  <div key={msg.id} className={`flex items-end gap-2 ${isMine ? 'flex-row-reverse' : 'flex-row'}`}>
                    {!isMine && (
                      <div className="w-7 h-7 flex-shrink-0">
                        {showAvatar && (
                          msg.sender_avatar
                            ? <img src={msg.sender_avatar} className="w-7 h-7 rounded-full object-cover" />
                            : <div className="w-7 h-7 rounded-full bg-teal-800 flex items-center justify-center text-xs font-bold">{getInitials(msg.sender_username)}</div>
                        )}
                      </div>
                    )}

                    <div className={`max-w-[75%] flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                      {!isMine && showAvatar && (
                        <p className="text-xs text-teal-400 mb-1 px-1">{msg.sender_username}</p>
                      )}
                      <div className={`px-4 py-2.5 rounded-2xl ${isMine ? 'bg-teal-500 text-black rounded-br-sm' : 'bg-gray-800 text-white rounded-bl-sm'}`}>
                        <p className="text-sm leading-relaxed">{msg.text}</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 px-1">
                        {formatTime(msg.created_at)}
                        {isMine && <span className="ml-1 text-teal-400">✓✓</span>}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-white/10 flex items-center gap-3 flex-shrink-0"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 12px)' }}>
        <button className="text-gray-400"><Plus size={22} /></button>
        <input
          ref={inputRef}
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
          placeholder="Type a message..."
          className="flex-1 bg-white/10 rounded-full px-4 py-2.5 text-sm text-white outline-none placeholder-gray-500"
        />
        <button
          onClick={sendMessage}
          disabled={!text.trim() || sending}
          className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center disabled:opacity-40 flex-shrink-0"
        >
          <Send size={16} className="text-black" />
        </button>
      </div>
    </div>
  )
}

export default ChatPage