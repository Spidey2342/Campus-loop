import React from 'react'
import { GraduationCap, BadgeCheck } from 'lucide-react'

function getInitials(name) {
  if (!name) return "?"
  return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
}

const PLACEHOLDER_GRADIENTS = [
  "from-teal-700 to-teal-900",
  "from-purple-700 to-purple-900",
  "from-orange-700 to-orange-900",
  "from-blue-700 to-blue-900",
]

function ListingCard({ listing, onClick }) {
  const gradient = PLACEHOLDER_GRADIENTS[
    listing.id.length % PLACEHOLDER_GRADIENTS.length
  ]

  return (
    <button
      onClick={onClick}
      className="text-left bg-white/10 rounded-xl overflow-hidden hover:bg-white/[0.15] transition-all"
    >
      <div className={`relative aspect-square bg-gradient-to-br ${gradient}`}>
        {listing.photos?.[0] ? (
          <img src={listing.photos[0]} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-white/40 text-xs font-semibold px-3 text-center">
              {listing.category}
            </span>
          </div>
        )}
        <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-full">
          <p className="text-xs font-bold text-teal-300">
            {listing.currency} {listing.price}
          </p>
        </div>
      </div>

      <div className="p-2.5">
        <p className="text-sm font-medium truncate">{listing.title}</p>
        <div className="flex items-center gap-1 mt-1.5">
          {listing.seller.avatar_url ? (
            <img src={listing.seller.avatar_url} className="w-4 h-4 rounded-full object-cover flex-shrink-0" />
          ) : (
            <div className="w-4 h-4 rounded-full bg-teal-800 flex items-center justify-center flex-shrink-0">
              <span className="text-[7px] font-bold">{getInitials(listing.seller.full_name)}</span>
            </div>
          )}
          <p className="text-xs text-gray-400 truncate">@{listing.seller.username}</p>
          {listing.seller.is_verified && (
            <BadgeCheck size={11} className="text-teal-400 flex-shrink-0" />
          )}
        </div>
        <div className="flex items-center gap-1 mt-1">
          <GraduationCap size={11} className="text-gray-500 flex-shrink-0" />
          <p className="text-[11px] text-gray-500 truncate">{listing.school_name}</p>
        </div>
      </div>
    </button>
  )
}

export default ListingCard