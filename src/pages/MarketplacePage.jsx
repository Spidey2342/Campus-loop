import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Plus, X, ShoppingBag, ChevronRight } from 'lucide-react'
import BottomNav from '../components/layouts/BottomNav'
import ListingCard from '../components/layouts/ListingCard'
import { getListings, CATEGORIES, getSellerStatus } from '../services/marketplaceApi'

function ListingSkeleton() {
  return (
    <div className="bg-white/10 rounded-xl overflow-hidden animate-pulse">
      <div className="aspect-square bg-white/10" />
      <div className="p-2.5 space-y-2">
        <div className="h-3 bg-white/10 rounded w-3/4" />
        <div className="h-2.5 bg-white/10 rounded w-1/2" />
      </div>
    </div>
  )
}

function MarketplacePage() {
  const navigate = useNavigate()
  const token = localStorage.getItem("token")
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}")

  const [category, setCategory] = useState("All")
  const [myCampusOnly, setMyCampusOnly] = useState(false)
  const [query, setQuery] = useState("")
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)

  const sellerStatus = getSellerStatus(currentUser)

  const handlePostClick = () => {
    navigate(sellerStatus.isSeller ? "/marketplace/new" : "/marketplace/become-seller")
  }

  useEffect(() => {
    let active = true
    setLoading(true)
    const load = async () => {
      try {
        const data = await getListings(token, {
          category,
          school: myCampusOnly ? currentUser.school_name : undefined,
          query,
        })
        if (active) setListings(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error(err)
      } finally {
        if (active) setLoading(false)
      }
    }
    const timer = setTimeout(load, query ? 300 : 0)
    return () => { active = false; clearTimeout(timer) }
  }, [category, myCampusOnly, query])

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-black/80 backdrop-blur-md px-4 pt-5 pb-3 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold">Marketplace</h1>
            <p className="text-xs text-gray-400">Buy and sell with your campus</p>
          </div>
          <button
            onClick={handlePostClick}
            className="bg-teal-500 text-black rounded-full p-2.5 flex-shrink-0"
          >
            <Plus size={18} />
          </button>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3.5 py-2.5 mb-3">
          <Search size={16} className="text-gray-400 flex-shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search listings..."
            className="flex-1 bg-transparent outline-none text-sm placeholder-gray-500"
          />
          {query && (
            <button onClick={() => setQuery("")}>
              <X size={14} className="text-gray-400" />
            </button>
          )}
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
                category === cat
                  ? "bg-teal-500 text-black font-semibold"
                  : "bg-white/10 text-gray-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* My campus toggle */}
        <button
          onClick={() => setMyCampusOnly((v) => !v)}
          className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border transition-all ${
            myCampusOnly
              ? "bg-teal-500/15 border-teal-500/40 text-teal-300"
              : "border-white/10 text-gray-400"
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${myCampusOnly ? "bg-teal-400" : "bg-gray-600"}`} />
          {currentUser.school_name ? `${currentUser.school_name} only` : "My campus only"}
        </button>
      </div>

      {/* Become-a-seller nudge — only for users who aren't sellers yet */}
      {!sellerStatus.isSeller && (
        <div className="px-4 pt-4">
          <button
            onClick={() => navigate("/marketplace/become-seller")}
            className="w-full flex items-center gap-3 bg-teal-500/10 border border-teal-500/25 rounded-xl px-4 py-3.5 text-left"
          >
            <div className="w-9 h-9 rounded-lg bg-teal-500/20 flex items-center justify-center flex-shrink-0">
              <ShoppingBag size={16} className="text-teal-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">Got something to sell?</p>
              <p className="text-xs text-gray-400">Start selling free for 7 days</p>
            </div>
            <ChevronRight size={16} className="text-gray-500 flex-shrink-0" />
          </button>
        </div>
      )}

      {/* Grid */}
      <div className="px-4 py-4">
        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 6 }).map((_, i) => <ListingSkeleton key={i} />)}
          </div>
        ) : listings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-center px-6">
            <p className="text-gray-400 text-sm">
              {query ? `No listings match "${query}"` : "No listings here yet"}
            </p>
            <button
              onClick={handlePostClick}
              className="text-teal-400 text-sm font-medium"
            >
              Be the first to sell something →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {listings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                onClick={() => navigate(`/marketplace/${listing.id}`)}
              />
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}

export default MarketplacePage