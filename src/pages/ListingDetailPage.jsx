import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, GraduationCap, BadgeCheck, MessageCircle, Flag } from 'lucide-react'
import { getListing, startListingChat } from '../services/marketplaceApi'

function getInitials(name) {
  if (!name) return "?"
  return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
}

function ListingDetailPage() {
  const { listingId } = useParams()
  const navigate = useNavigate()
  const token = localStorage.getItem("token")
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}")

  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [starting, setStarting] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getListing(listingId, token)
        setListing(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [listingId])

  const isOwnListing = listing?.seller?.username === currentUser.username

  const handleChatWithSeller = async () => {
    if (starting) return
    setStarting(true)
    try {
      const conversation = await startListingChat(listingId, token)
      navigate(`/messages/${conversation.id}`)
    } catch (err) {
      console.error(err)
    } finally {
      setStarting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-3">
        <p className="text-gray-400 text-sm">This listing doesn't exist anymore.</p>
        <button onClick={() => navigate("/marketplace")} className="text-teal-400 text-sm font-medium">
          Back to Marketplace
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white pb-28">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <button className="text-gray-400">
          <Flag size={18} />
        </button>
      </div>

      {/* Image */}
      <div className="aspect-square bg-gradient-to-br from-teal-800 to-teal-950 flex items-center justify-center">
        {listing.photos?.[0] ? (
          <img src={listing.photos[0]} className="w-full h-full object-cover" />
        ) : (
          <span className="text-white/30 text-sm font-medium">{listing.category}</span>
        )}
      </div>

      <div className="px-4 py-5">
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-lg font-bold leading-snug">{listing.title}</h1>
          <p className="text-lg font-bold text-teal-300 flex-shrink-0">
            {listing.currency} {listing.price}
          </p>
        </div>

        <span className="inline-block mt-2 text-xs bg-white/10 text-gray-300 px-2.5 py-1 rounded-full">
          {listing.category}
        </span>

        <p className="text-sm text-gray-300 leading-relaxed mt-4">
          {listing.description}
        </p>

        {/* Seller card */}
        <div
          onClick={() => navigate(`/profile/${listing.seller.username}`)}
          className="flex items-center gap-3 bg-white/10 rounded-xl p-3.5 mt-6 cursor-pointer hover:bg-white/[0.15] transition-all"
        >
          {listing.seller.avatar_url ? (
            <img src={listing.seller.avatar_url} className="w-11 h-11 rounded-full object-cover flex-shrink-0" />
          ) : (
            <div className="w-11 h-11 rounded-full bg-teal-800 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold">{getInitials(listing.seller.full_name)}</span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <p className="font-semibold text-sm truncate">{listing.seller.full_name}</p>
              {listing.seller.is_verified && <BadgeCheck size={14} className="text-teal-400 flex-shrink-0" />}
            </div>
            <p className="text-xs text-gray-400">@{listing.seller.username}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <GraduationCap size={11} className="text-gray-500 flex-shrink-0" />
              <p className="text-[11px] text-gray-500 truncate">{listing.school_name}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat CTA — stays in-app instead of handing off to WhatsApp */}
      {!isOwnListing && (
        <div
          className="fixed bottom-0 left-0 w-full bg-black/90 backdrop-blur-md border-t border-white/10 px-4 py-3"
          style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 12px)" }}
        >
          <button
            onClick={handleChatWithSeller}
            disabled={starting}
            className="w-full bg-teal-500 text-black py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <MessageCircle size={18} />
            {starting ? "Starting chat..." : `Chat with ${listing.seller.username}`}
          </button>
        </div>
      )}
    </div>
  )
}

export default ListingDetailPage