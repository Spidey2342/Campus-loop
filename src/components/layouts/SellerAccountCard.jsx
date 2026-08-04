import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingBag, Clock, Crown, List, ChevronRight } from 'lucide-react'
import { getSellerStatus } from '../../services/marketplaceApi'

function SellerAccountCard() {
  const navigate = useNavigate()
  const token = localStorage.getItem("token")
  const [status, setStatus] = useState(null)

  useEffect(() => {
    let active = true
    getSellerStatus(token).then((s) => { if (active) setStatus(s) })
    return () => { active = false }
  }, [])

  if (!status) return null // keep loading unobtrusive — this is a secondary card, not the main content

  if (!status.isSeller) {
    return (
      <button
        onClick={() => navigate("/marketplace/become-seller")}
        className="w-full flex items-center gap-3 bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3.5 mt-3 text-left"
      >
        <div className="w-9 h-9 rounded-lg bg-teal-500/15 flex items-center justify-center flex-shrink-0">
          <ShoppingBag size={16} className="text-teal-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">Become a Seller</p>
          <p className="text-xs text-gray-400">Sell on the Marketplace, free for 7 days</p>
        </div>
        <ChevronRight size={16} className="text-gray-500 flex-shrink-0" />
      </button>
    )
  }

  const sourceLabel = {
    trial: "Free Trial",
    admin_free: "Vendor",
    paid: "Vendor",
  }[status.source]

  const sourceBadgeClass = {
    trial: "bg-amber-500/10 text-amber-400 border-amber-500/25",
    admin_free: "bg-teal-500/10 text-teal-300 border-teal-500/25",
    paid: "bg-teal-500/10 text-teal-300 border-teal-500/25",
  }[status.source]

  return (
    <div className="bg-white/[0.06] border border-white/10 rounded-xl px-4 py-4 mt-3">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Crown size={15} className="text-teal-300" />
          <p className="text-sm font-semibold">Seller Account</p>
        </div>
        <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border ${sourceBadgeClass}`}>
          {sourceLabel}
        </span>
      </div>

      {status.source === "trial" && (
        <div className="flex items-center gap-1.5 text-xs text-amber-400 mb-3">
          <Clock size={12} />
          {status.daysLeft > 0
            ? `${status.daysLeft} ${status.daysLeft === 1 ? "day" : "days"} left in your free trial`
            : "Your trial ends today"}
        </div>
      )}

      <button
        onClick={() => navigate("/marketplace/mine")}
        className="w-full flex items-center gap-2.5 bg-teal-500/10 border border-teal-500/25 rounded-lg px-3.5 py-2.5 text-left"
      >
        <List size={15} className="text-teal-300 flex-shrink-0" />
        <span className="flex-1 text-sm text-teal-300 font-medium">Manage My Listings</span>
        <ChevronRight size={14} className="text-teal-400/60 flex-shrink-0" />
      </button>

      {status.source === "trial" && (
        <p className="text-[11px] text-gray-500 mt-3 leading-relaxed">
          When your trial ends, your account switches back to a regular member —
          you can still browse, buy, and post reels, but you won't be able to
          post new listings until you subscribe.
        </p>
      )}
    </div>
  )
}

export default SellerAccountCard