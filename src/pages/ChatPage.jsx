import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Send, Plus, MoreVertical } from 'lucide-react'
import { getMessages } from '../services/api'

const BASE_URL = "https://campus-backend-moz5.onrender.com"
const WS_URL = BASE_URL.replace("https://", "wss://").replace("http://", "ws://")

function ChatPage() {
  const { conversationId } = useParams()
  const navigate = useNavigate()
  const [messages, setMessages] = useState([])
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(true)
  const [convInfo, setConvInfo] = useState(null)
  const [wsConnected, setWsConnected] = useState(false)
  const wsRef = useRef(null)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)
  const token = localStorage.getItem("token")
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}")

  // Load existing messages
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getMessages(conversationId, token)
        setMessages(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [conversationId])

  // Connect WebSocket
  useEffect(() => {
    const ws = new WebSocket(`${WS_URL}/messages/ws/${conversationId}?token=${token}`)

    ws.onopen = () => {
      setWsConnected(true)
    }

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data)
      // Mark as mine if sender is current user
      message.is_mine = message.sender_is === currentUser.id
      setMessages(prev => [...prev, message])
    }

    ws.onclose = () => {
      setWsConnected(false)
    }

    ws.onerror = (err) => {
      console.error("WebSocket error:", err)
    }

    wsRef.current = ws

    return () => {
      ws.close()
    }
  }, [conversationId])

  // Scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = () => {
    if (!text.trim()) return
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return

    // Optimistic update — show message immediately
    const optimisticMsg = {
      id: Date.now().toString(),
      text: text.trim(),
      message_type: "text",
      sender_id: currentUser.id,
      sender_username: currentUser.username,
      sender_avatar: currentUser.avatar_url,
      is_mine: true,
      created_at: new Date().toISOString(),
    }
    setMessages(prev => [...prev, optimisticMsg])
    setText("")

    // Send via WebSocket
    wsRef.current.send(JSON.stringify({ text: text.trim() }))
  }

  const formatTime = (dateStr) => {
    if (!dateStr) return ""
    const date = new Date(dateStr)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const getInitials = (name) => {
    if (!name) return "?"
    return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
  }

  // Group messages by date
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
        <button onClick={() => navigate("/messages")}>
          <ArrowLeft size={20} />
        </button>

        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-teal-800 flex items-center justify-center text-sm font-bold flex-shrink-0">
          {getInitials(convInfo?.name || "?")}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-sm truncate">
              {convInfo?.name || "Chat"}
            </p>
            {convInfo?.school_name && (
              <span className="text-xs bg-teal-900/50 text-teal-400 px-2 py-0.5 rounded-full flex-shrink-0">
                {convInfo.school_name.split(" ")[0]}
              </span>
            )}
          </div>
          <p className="text-xs text-teal-400">
            {wsConnected ? "● Online" : "Connecting..."}
          </p>
        </div>

        <button className="text-gray-400">
          <MoreVertical size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <div className="w-6 h-6 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          Object.entries(groupedMessages).map(([date, msgs]) => (
            <div key={date}>
              {/* Date divider */}
              <div className="flex items-center justify-center my-4">
                <div className="bg-white/10 px-3 py-1 rounded-full">
                  <p className="text-xs text-gray-400">
                    {new Date(date).toDateString() === new Date().toDateString()
                      ? "Today"
                      : date}
                  </p>
                </div>
              </div>

              {msgs.map((msg, i) => {
                // System message
                if (msg.message_type === "system") {
                  return (
                    <div key={msg.id} className="flex justify-center my-2">
                      <p className="text-xs text-gray-500 bg-white/5 px-3 py-1 rounded-full">
                        {msg.text}
                      </p>
                    </div>
                  )
                }

                const isMine = msg.is_mine
                const showAvatar = !isMine && (i === 0 || msgs[i-1]?.sender_id !== msg.sender_id)

                return (
                  <div
                    key={msg.id}
                    className={`flex items-end gap-2 ${isMine ? "flex-row-reverse" : "flex-row"}`}
                  >
                    {/* Avatar — only show for others and first in a group */}
                    {!isMine && (
                      <div className="w-7 h-7 flex-shrink-0">
                        {showAvatar && (
                          msg.sender_avatar ? (
                            <img
                              src={msg.sender_avatar}
                              className="w-7 h-7 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-teal-800 flex items-center justify-center text-xs font-bold">
                              {getInitials(msg.sender_username)}
                            </div>
                          )
                        )}
                      </div>
                    )}

                    <div className={`max-w-[75%] ${isMine ? "items-end" : "items-start"} flex flex-col`}>
                      {/* Sender name for group chats */}
                      {!isMine && showAvatar && (
                        <p className="text-xs text-teal-400 mb-1 px-1">
                          {msg.sender_username}
                        </p>
                      )}

                      {/* Bubble */}
                      <div className={`px-4 py-2.5 rounded-2xl ${
                        isMine
                          ? "bg-teal-500 text-black rounded-br-sm"
                          : "bg-gray-800 text-white rounded-bl-sm"
                      }`}>
                        <p className="text-sm leading-relaxed">{msg.text}</p>
                      </div>

                      {/* Time */}
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

      {/* Input bar */}
      <div className="px-4 py-3 border-t border-white/10 flex items-center gap-3 flex-shrink-0"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 12px)" }}
      >
        <button className="text-gray-400">
          <Plus size={22} />
        </button>

        <input
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
          placeholder="Type a message..."
          className="flex-1 bg-white/10 rounded-full px-4 py-2.5 text-sm text-white outline-none placeholder-gray-500"
        />

        <button
          onClick={sendMessage}
          disabled={!text.trim()}
          className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center disabled:opacity-40 flex-shrink-0"
        >
          <Send size={16} className="text-black" />
        </button>
      </div>
    </div>
  )
}

export default ChatPage