import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, GraduationCap, Crown, Clock } from 'lucide-react'
import { getStorefront, buildWhatsappLink } from '../services/marketplaceApi'
import ListingCard from '../components/layouts/ListingCard'

function WhatsAppIcon({ size = 16, className = "" }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.149-.15.298-.347.446-.52.149-.174.198-.298.297-.497.099-.198.05-.371-.05-.52-.099-.149-.895-2.157-1.227-2.876-.297-.646-.596-.556-.818-.567-.213-.01-.457-.012-.702-.012-.245 0-.643.099-.878.373-.235.273-.895.874-.895 2.14 0 1.265.919 2.489 1.048 2.66.13.174 1.783 2.723 4.36 3.708 2.577.984 2.577.656 3.042.615.465-.041 1.507-.615 1.719-1.213.213-.596.213-1.107.15-1.213-.065-.106-.24-.174-.537-.322z"/>
      <path d="M12.026 2c-5.514 0-9.98 4.467-9.98 9.98 0 1.85.51 3.578 1.395 5.062L2 22l5.13-1.346a9.925 9.925 0 0 0 4.896 1.325h.004c5.512 0 9.978-4.467 9.978-9.98 0-2.665-1.037-5.169-2.921-7.052A9.941 9.941 0 0 0 12.026 2zm5.81 15.78a8.286 8.286 0 0 1-5.81 2.408 8.29 8.29 0 0 1-4.222-1.157l-.303-.18-3.045.8.813-2.968-.198-.313a8.275 8.275 0 0 1-1.27-4.39c0-4.575 3.723-8.298 8.302-8.298 2.219 0 4.303.865 5.87 2.437a8.235 8.235 0 0 1 2.43 5.867c0 4.577-3.723 8.3-8.29 8.3z"/>
    </svg>
  )
}

function getInitials(name) {
  if (!name) return "?"
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
}

function StorefrontPage() {
  const { username } = useParams()
  const navigate = useNavigate()
  const token = localStorage.getItem("token")

  const [store, setStore] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    getStorefront(username, token)
      .then(setStore)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [username])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (notFound || !store) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 text-center gap-3">
        <p className="text-gray-400">This storefront doesn't exist (or isn't active right now).</p>
        <button onClick={() => navigate(-1)} className="text-teal-400 text-sm font-medium">
          Go back
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white pb-10">
      {/* Banner */}
      <div className="relative h-40 bg-gradient-to-br from-teal-800 to-teal-950">
        {store.store_banner_url && (
          <img src={store.store_banner_url} className="w-full h-full object-cover" />
        )}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-full p-2"
        >
          <ArrowLeft size={18} />
        </button>
      </div>

      {/* Avatar + identity, overlapping the banner */}
      <div className="px-4 -mt-10 relative">
        {store.avatar_url ? (
          <img src={store.avatar_url} className="w-20 h-20 rounded-full object-cover border-4 border-black" />
        ) : (
          <div className="w-20 h-20 rounded-full bg-teal-800 border-4 border-black flex items-center justify-center">
            <span className="text-xl font-bold">{getInitials(store.store_name)}</span>
          </div>
        )}

        <div className="mt-3">
          <div className="flex items-center gap-1.5">
            <h1 className="text-xl font-bold">{store.store_name}</h1>
            {store.is_pro_seller && (
              <span className="flex items-center gap-0.5 bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                <Crown size={10} /> Vendor
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500">@{store.username}</p>

          {store.school_name && (
            <div className="flex items-center gap-1.5 mt-2 text-sm text-gray-400">
              <GraduationCap size={14} />
              {store.school_name}
            </div>
          )}
          {store.store_hours && (
            <div className="flex items-center gap-1.5 mt-1.5 text-sm text-gray-400">
              <Clock size={14} />
              {store.store_hours}
            </div>
          )}

          {store.store_bio && (
            <p className="text-sm text-gray-300 mt-3 leading-relaxed">{store.store_bio}</p>
          )}

          {store.whatsapp_number && (
            <a
              href={buildWhatsappLink(store.whatsapp_number, `Hi! I found your shop "${store.store_name}" on Chale.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-center justify-center gap-2 bg-[#25D366] text-black py-3 rounded-xl font-semibold text-sm"
            >
              <WhatsAppIcon size={18} />
              Message on WhatsApp
            </a>
          )}
        </div>
      </div>

      {/* Listings */}
      <div className="px-4 mt-7">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
          {store.listings.length} {store.listings.length === 1 ? "Listing" : "Listings"}
        </h2>
        {store.listings.length === 0 ? (
          <p className="text-gray-500 text-sm py-10 text-center">No active listings right now.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {store.listings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                onClick={() => navigate(`/marketplace/${listing.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default StorefrontPage