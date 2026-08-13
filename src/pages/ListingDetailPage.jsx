import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, GraduationCap, BadgeCheck, MessageCircle, Flag, Pencil, Crown } from 'lucide-react'
import { getListing, startListingChat, buildWhatsappLink, trackListingClick } from '../services/marketplaceApi'
import Sidebar from '../components/layouts/Sidebar'

function WhatsAppIcon({ size = 18, className = "" }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.149-.15.298-.347.446-.52.149-.174.198-.298.297-.497.099-.198.05-.371-.05-.52-.099-.149-.895-2.157-1.227-2.876-.297-.646-.596-.556-.818-.567-.213-.01-.457-.012-.702-.012-.245 0-.643.099-.878.373-.235.273-.895.874-.895 2.14 0 1.265.919 2.489 1.048 2.66.13.174 1.783 2.723 4.36 3.708 2.577.984 2.577.656 3.042.615.465-.041 1.507-.615 1.719-1.213.213-.596.213-1.107.15-1.213-.065-.106-.24-.174-.537-.322z"/>
      <path d="M12.026 2c-5.514 0-9.98 4.467-9.98 9.98 0 1.85.51 3.578 1.395 5.062L2 22l5.13-1.346a9.925 9.925 0 0 0 4.896 1.325h.004c5.512 0 9.978-4.467 9.978-9.98 0-2.665-1.037-5.169-2.921-7.052A9.941 9.941 0 0 0 12.026 2zm5.81 15.78a8.286 8.286 0 0 1-5.81 2.408 8.29 8.29 0 0 1-4.222-1.157l-.303-.18-3.045.8.813-2.968-.198-.313a8.275 8.275 0 0 1-1.27-4.39c0-4.575 3.723-8.298 8.302-8.298 2.219 0 4.303.865 5.87 2.437a8.235 8.235 0 0 1 2.43 5.867c0 4.577-3.723 8.3-8.29 8.3z"/>
    </svg>
  )
}

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
  const [activePhotoIndex, setActivePhotoIndex] = useState(0)

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
      <div className="min-h-screen bg-black text-white flex items-center justify-center lg:pl-60">
        <Sidebar />
        <div className="w-6 h-6 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-3 lg:pl-60">
        <Sidebar />
        <p className="text-gray-400 text-sm">This listing doesn't exist anymore.</p>
        <button onClick={() => navigate("/marketplace")} className="text-teal-400 text-sm font-medium">
          Back to Marketplace
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white pb-28 lg:pl-60">
      <Sidebar />
      <div className="lg:max-w-2xl lg:mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <button className="text-gray-400">
          <Flag size={18} />
        </button>
      </div>

      {/* Photo gallery — swipeable when there's more than one */}
      <div className="relative aspect-square bg-gradient-to-br from-teal-800 to-teal-950">
        {listing.photos?.length > 0 ? (
          <>
            <div
              onScroll={(e) => {
                const container = e.currentTarget
                const index = Math.round(container.scrollLeft / container.clientWidth)
                setActivePhotoIndex(index)
              }}
              className="flex w-full h-full overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden"
              style={{ scrollbarWidth: "none" }}
            >
              {listing.photos.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  className="w-full h-full object-cover flex-shrink-0 snap-center"
                />
              ))}
            </div>

            {listing.photos.length > 1 && (
              <>
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-full">
                  <p className="text-xs font-medium">{activePhotoIndex + 1}/{listing.photos.length}</p>
                </div>
                <div className="absolute bottom-3 left-0 w-full flex items-center justify-center gap-1.5">
                  {listing.photos.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 rounded-full transition-all ${
                        i === activePhotoIndex ? "w-5 bg-white" : "w-1.5 bg-white/40"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-white/30 text-sm font-medium">{listing.category}</span>
          </div>
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
          onClick={() => navigate(
            listing.seller.is_pro_seller
              ? `/store/${listing.seller.username}`
              : `/profile/${listing.seller.username}`
          )}
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
              {listing.seller.is_pro_seller && (
                <span
                  className="flex items-center gap-0.5 bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
                  title="Verified Vendor — Campus Market Pro"
                >
                  <Crown size={9} /> Vendor
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400">@{listing.seller.username}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <GraduationCap size={11} className="text-gray-500 flex-shrink-0" />
              <p className="text-[11px] text-gray-500 truncate">{listing.school_name}</p>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Buyers get in-app chat, plus a WhatsApp shortcut if the seller has
          set a number. Owners see an Edit CTA instead. */}
      {!isOwnListing ? (
        <div
          className="fixed bottom-0 left-0 w-full lg:left-60 lg:w-[calc(100%-15rem)] bg-black/90 backdrop-blur-md border-t border-white/10 px-4 py-3 flex gap-2.5 lg:justify-center"
          style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 12px)" }}
        >
          <div className="flex gap-2.5 w-full lg:max-w-2xl">
          <button
            onClick={handleChatWithSeller}
            disabled={starting}
            className="flex-1 bg-teal-500 text-black py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <MessageCircle size={18} />
            {starting ? "Starting chat..." : "Chat"}
          </button>
          {listing.seller.whatsapp_number && (
            <a
              href={buildWhatsappLink(
                listing.seller.whatsapp_number,
                `Hi! I saw "${listing.title}" on Chale — is it still available?`
              )}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackListingClick(listing.id, "whatsapp", token)}
              className="w-14 flex-shrink-0 bg-[#25D366] text-black rounded-xl flex items-center justify-center"
              aria-label="Chat on WhatsApp"
            >
              <WhatsAppIcon size={22} />
            </a>
          )}
          </div>
        </div>
      ) : (
        <div
          className="fixed bottom-0 left-0 w-full lg:left-60 lg:w-[calc(100%-15rem)] bg-black/90 backdrop-blur-md border-t border-white/10 px-4 py-3 lg:flex lg:justify-center"
          style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 12px)" }}
        >
          <div className="w-full lg:max-w-2xl">
          <button
            onClick={() => navigate(`/marketplace/${listing.id}/edit`)}
            className="w-full bg-white/10 text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2"
          >
            <Pencil size={18} />
            Edit Listing
          </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ListingDetailPage