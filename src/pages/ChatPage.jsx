import React, { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Send, Plus, MoreVertical, Hand, ShoppingBag, CheckCheck } from 'lucide-react'
import { getMessages } from '../services/api'
import { getListingContext, getListingMessages, sendListingMessage } from '../services/marketplaceApi'

const BASE_URL = "https://campus-backend-moz5.onrender.com"

function ChatPage() {
  const { conversationId } = useParams()
  const navigate = useNavigate()

  // Listing chats are mocked locally until the backend supports them —
  // see the comment block above getListingMessages in marketplaceApi.js.
  // Swapping to a real backend-tagged conversation later just means
  // deleting this flag and the branches that check it below.
  const isMockThread = conversationId?.startsWith("listing-")
  const listingContext = isMockThread ? getListingContext(conversationId) : null

  // ✅ All state at the top — nothing inside other functions
  const [messages, setMessages] = useState([])
  const [convInfo, setConvInfo] = useState(null)
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)

  const bottomRef = useRef(null)
  const inputRef = useRef(null)
  const lastMessageIdRef = useRef(null)

  const token = localStorage.getItem("token")
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}")

  // ✅ loadMessages is a clean standalone function
  const loadMessages = async (initial = false) => {
    try {
      const data = isMockThread
        ? await getListingMessages(conversationId)
        : await getMessages(conversationId, token)
      const safeData = Array.isArray(data) ? data : []

      if (initial) {
        setMessages(safeData)
        setLoading(false)
        return
      }

      if (safeData.length > 0) {
        const lastId = safeData[safeData.length - 1].id
        if (lastId !== lastMessageIdRef.current) {
          lastMessageIdRef.current = lastId
          setMessages(safeData)
        }
      }
    } catch (err) {
      console.error(err)
      if (initial) setLoading(false)
    }
  }

  // ✅ Load conversation info + messages on mount
  useEffect(() => {
    const load = async () => {
      try {
        if (isMockThread) {
          // Seller name/avatar comes from the listing snapshot, not the
          // real conversations endpoint (this thread doesn't exist there).
          setConvInfo({
            name: listingContext?.seller_username ? `@${listingContext.seller_username}` : "Seller",
            avatar_url: null,
            username: listingContext?.seller_username,
          })
        } else {
          // Get conversation info to show name in header
          const convResponse = await fetch(
            `${BASE_URL}/messages/conversations`,
            { headers: { Authorization: `Bearer ${token}` } }
          )
          const convData = await convResponse.json()
          const thisConv = Array.isArray(convData)
            ? convData.find(c => c.id === conversationId)
            : null
          setConvInfo(thisConv)
        }

        // Load messages
        await loadMessages(true)
      } catch (err) {
        console.error(err)
        setLoading(false)
      }
    }
    load()
  }, [conversationId])

  // ✅ Poll every 3 seconds for new messages (skip polling for mock threads —
  // nothing external can write to them, so there's nothing new to catch)
  useEffect(() => {
    if (isMockThread) return
    const interval = setInterval(() => {
      loadMessages(false)
    }, 3000)
    return () => clearInterval(interval)
  }, [conversationId])

  // ✅ Scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = async () => {
    if (!text.trim() || sending) return

    const messageText = text.trim()
    setText("")
    setSending(true)

    // Optimistic update
    const optimistic = {
      id: `temp-${Date.now()}`,
      text: messageText,
      message_type: "text",
      sender_id: currentUser.id,
      sender_username: currentUser.username,
      sender_avatar: currentUser.avatar_url,
      is_mine: true,
      created_at: new Date().toISOString(),
    }
    setMessages(prev => [...prev, optimistic])

    try {
      if (isMockThread) {
        await sendListingMessage(conversationId, messageText)
        await loadMessages(false)
      } else {
        const response = await fetch(
          `${BASE_URL}/messages/conversations/${conversationId}/send`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ text: messageText }),
          }
        )
        if (response.ok) {
          await loadMessages(false)
        }
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSending(false)
    }
  }

  const formatTime = (dateStr) => {
    if (!dateStr) return ""
    return new Date(dateStr).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  const getInitials = (name) => {
    if (!name) return "?"
    return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
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
        <button onClick={() => navigate("/messages")}>
          <ArrowLeft size={20} />
        </button>

        {convInfo?.avatar_url ? (
          <img
            src={convInfo.avatar_url}
            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-teal-800 flex items-center justify-center text-sm font-bold flex-shrink-0">
            {getInitials(convInfo?.name || "?")}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-sm truncate">
              {convInfo?.name || "Loading..."}
            </p>
            {convInfo?.school_name && (
              <span className="text-xs bg-teal-900/50 text-teal-400 px-2 py-0.5 rounded-full flex-shrink-0">
                {convInfo.school_name.split(" ")[0]}
              </span>
            )}
            {convInfo?.type === "group" && (
              <span className="text-xs bg-purple-900/50 text-purple-400 px-2 py-0.5 rounded-full flex-shrink-0">
                GROUP
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500">
            {convInfo?.type === "group"
              ? `${convInfo.members_count} members`
              : "● Active"}
          </p>
        </div>

        <button
          onClick={() => {
            if (convInfo?.username) navigate(`/profile/${convInfo.username}`)
          }}
          className="text-gray-400"
        >
          <MoreVertical size={20} />
        </button>
      </div>

      {/* Pinned listing card — keeps buyer/seller anchored to what they're discussing */}
      {listingContext && (
        <button
          onClick={() => navigate(`/marketplace/${listingContext.listing_id}`)}
          className="flex items-center gap-3 px-4 py-2.5 border-b border-white/10 bg-white/5 text-left flex-shrink-0"
        >
          <div className="w-9 h-9 rounded-lg bg-teal-900 flex items-center justify-center flex-shrink-0">
            {listingContext.thumbnail ? (
              <img src={listingContext.thumbnail} className="w-full h-full object-cover rounded-lg" />
            ) : (
              <ShoppingBag size={16} className="text-teal-400" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{listingContext.title}</p>
            <p className="text-xs text-teal-400">{listingContext.currency} {listingContext.price}</p>
          </div>
        </button>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <div className="w-6 h-6 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Hand size={28} className="text-gray-500" />
            <p className="text-gray-400 text-sm">Say hello!</p>
          </div>
        ) : (
          Object.entries(groupedMessages).map(([date, msgs]) => (
            <div key={date}>
              <div className="flex items-center justify-center my-4">
                <div className="bg-white/10 px-3 py-1 rounded-full">
                  <p className="text-xs text-gray-400">
                    {new Date(date).toDateString() === new Date().toDateString()
                      ? "Today" : date}
                  </p>
                </div>
              </div>

              {msgs.map((msg, i) => {
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
                const showAvatar = !isMine &&
                  (i === 0 || msgs[i - 1]?.sender_id !== msg.sender_id)

                return (
                  <div
                    key={msg.id}
                    className={`flex items-end gap-2 ${isMine ? "flex-row-reverse" : "flex-row"}`}
                  >
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

                    <div className={`max-w-[75%] flex flex-col ${isMine ? "items-end" : "items-start"}`}>
                      {!isMine && showAvatar && (
                        <p className="text-xs text-teal-400 mb-1 px-1">
                          {msg.sender_username}
                        </p>
                      )}
                      <div className={`px-4 py-2.5 rounded-2xl ${
                        isMine
                          ? "bg-teal-500 text-black rounded-br-sm"
                          : "bg-gray-800 text-white rounded-bl-sm"
                      }`}>
                        <p className="text-sm leading-relaxed">{msg.text}</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 px-1">
                        {formatTime(msg.created_at)}
                        {isMine && (
                          <CheckCheck size={12} className="inline ml-1 text-teal-400" />
                        )}
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
      <div
        className="px-4 py-3 border-t border-white/10 flex items-center gap-3 flex-shrink-0"
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