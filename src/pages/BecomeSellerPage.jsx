import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ShoppingBag, Clock, Users, CheckCircle2 } from 'lucide-react'
import { startSellerTrial } from '../services/marketplaceApi'

function BecomeSellerPage() {
  const navigate = useNavigate()
  const token = localStorage.getItem("token")
  const [starting, setStarting] = useState(false)

  const handleStart = async () => {
    if (starting) return
    setStarting(true)
    try {
      await startSellerTrial(token)
      navigate("/marketplace/new")
    } catch (err) {
      console.error(err)
    } finally {
      setStarting(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white pb-10">
      <div className="flex items-center gap-3 px-4 py-4 border-b border-white/10">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-semibold text-lg">Become a Seller</h1>
      </div>

      <div className="px-6 py-8">
        <div className="w-16 h-16 rounded-2xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center mb-6">
          <ShoppingBag size={28} className="text-teal-400" />
        </div>

        <h2 className="text-2xl font-bold leading-snug">
          Sell to your campus, free for your first week.
        </h2>
        <p className="text-gray-400 text-sm mt-3 leading-relaxed">
          Post products or services in the Marketplace, and chat with buyers right
          here in the app. Your first 7 days are free — no card required.
        </p>

        <div className="mt-8 space-y-4">
          <div className="flex gap-3">
            <Clock size={18} className="text-teal-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">7 days, completely free</p>
              <p className="text-xs text-gray-500 mt-0.5">
                List as many products or services as you want during your trial.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Users size={18} className="text-teal-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Buyers stay in the app</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Chat with buyers directly — no handing off to WhatsApp.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <CheckCircle2 size={18} className="text-teal-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">After your trial</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Keep selling with a small subscription. We'll notify you before anything is charged.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleStart}
          disabled={starting}
          className="w-full bg-teal-500 text-black py-4 rounded-xl font-semibold mt-10 disabled:opacity-60"
        >
          {starting ? "Setting up..." : "Start my free week"}
        </button>
      </div>
    </div>
  )
}

export default BecomeSellerPage