import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ImagePlus, Eye, MessageCircle, TrendingUp, ExternalLink } from 'lucide-react'
import { getStorefront, updateStorefront, getStoreAnalytics } from '../services/marketplaceApi'

function WhatsAppMini({ size = 15 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className="text-gray-400 mx-auto mb-1" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.149-.15.298-.347.446-.52.149-.174.198-.298.297-.497.099-.198.05-.371-.05-.52-.099-.149-.895-2.157-1.227-2.876-.297-.646-.596-.556-.818-.567-.213-.01-.457-.012-.702-.012-.245 0-.643.099-.878.373-.235.273-.895.874-.895 2.14 0 1.265.919 2.489 1.048 2.66.13.174 1.783 2.723 4.36 3.708 2.577.984 2.577.656 3.042.615.465-.041 1.507-.615 1.719-1.213.213-.596.213-1.107.15-1.213-.065-.106-.24-.174-.537-.322z"/>
      <path d="M12.026 2c-5.514 0-9.98 4.467-9.98 9.98 0 1.85.51 3.578 1.395 5.062L2 22l5.13-1.346a9.925 9.925 0 0 0 4.896 1.325h.004c5.512 0 9.978-4.467 9.978-9.98 0-2.665-1.037-5.169-2.921-7.052A9.941 9.941 0 0 0 12.026 2zm5.81 15.78a8.286 8.286 0 0 1-5.81 2.408 8.29 8.29 0 0 1-4.222-1.157l-.303-.18-3.045.8.813-2.968-.198-.313a8.275 8.275 0 0 1-1.27-4.39c0-4.575 3.723-8.298 8.302-8.298 2.219 0 4.303.865 5.87 2.437a8.235 8.235 0 0 1 2.43 5.867c0 4.577-3.723 8.3-8.29 8.3z"/>
    </svg>
  )
}

function StorefrontSettingsPage() {
  const navigate = useNavigate()
  const token = localStorage.getItem("token")
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}")

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const [storeName, setStoreName] = useState("")
  const [storeBio, setStoreBio] = useState("")
  const [storeHours, setStoreHours] = useState("")
  const [bannerPreview, setBannerPreview] = useState(null)
  const [bannerFile, setBannerFile] = useState(null)

  const [analytics, setAnalytics] = useState(null)
  const [analyticsLoading, setAnalyticsLoading] = useState(true)

  useEffect(() => {
    getStorefront(currentUser.username, token)
      .then((store) => {
        setStoreName(store.store_name || "")
        setStoreBio(store.store_bio || "")
        setStoreHours(store.store_hours || "")
        setBannerPreview(store.store_banner_url || null)
      })
      .catch(() => setError("Couldn't load your storefront"))
      .finally(() => setLoading(false))

    getStoreAnalytics(token)
      .then(setAnalytics)
      .catch(() => {})
      .finally(() => setAnalyticsLoading(false))
  }, [])

  const handleBannerSelect = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setBannerFile(file)
    setBannerPreview(URL.createObjectURL(file))
  }

  const handleSave = async () => {
    if (saving) return
    setSaving(true)
    setError("")
    try {
      await updateStorefront(
        { storeName, storeBio, storeHours, bannerFile },
        token
      )
    } catch (err) {
      setError(err.message || "Failed to save")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white pb-10">
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
          </button>
          <h1 className="font-semibold text-lg">My Storefront</h1>
        </div>
        <button
          onClick={() => navigate(`/store/${currentUser.username}`)}
          className="flex items-center gap-1 text-xs text-teal-400 font-medium"
        >
          View public page <ExternalLink size={12} />
        </button>
      </div>

      <div className="px-4 py-5 space-y-6">
        {/* Banner */}
        <div>
          <label className="text-xs text-gray-400 uppercase tracking-wide mb-2 block">Banner</label>
          <label className="relative block h-28 rounded-xl overflow-hidden bg-gradient-to-br from-teal-800 to-teal-950 cursor-pointer">
            {bannerPreview && (
              <img src={bannerPreview} className="w-full h-full object-cover" />
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <div className="flex items-center gap-1.5 bg-black/60 px-3 py-1.5 rounded-full text-xs">
                <ImagePlus size={13} /> {bannerPreview ? "Change" : "Add"} banner
              </div>
            </div>
            <input type="file" accept="image/*" className="hidden" onChange={handleBannerSelect} />
          </label>
        </div>

        {/* Store name */}
        <div>
          <label className="text-xs text-gray-400 uppercase tracking-wide mb-2 block">Shop Name</label>
          <input
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            placeholder={currentUser.full_name || "Your shop name"}
            maxLength={100}
            className="w-full bg-white/10 rounded-xl px-4 py-3.5 text-sm outline-none placeholder-gray-500"
          />
        </div>

        {/* Bio */}
        <div>
          <label className="text-xs text-gray-400 uppercase tracking-wide mb-2 block">About Your Shop</label>
          <textarea
            value={storeBio}
            onChange={(e) => setStoreBio(e.target.value)}
            placeholder="What do you sell? What makes your shop worth checking out?"
            rows={3}
            maxLength={300}
            className="w-full bg-white/10 rounded-xl px-4 py-3.5 text-sm outline-none placeholder-gray-500 resize-none"
          />
        </div>

        {/* Hours */}
        <div>
          <label className="text-xs text-gray-400 uppercase tracking-wide mb-2 block">Hours</label>
          <input
            value={storeHours}
            onChange={(e) => setStoreHours(e.target.value)}
            placeholder="e.g. Mon-Fri 9am-6pm"
            maxLength={200}
            className="w-full bg-white/10 rounded-xl px-4 py-3.5 text-sm outline-none placeholder-gray-500"
          />
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-teal-500 text-black py-4 rounded-xl font-semibold disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Storefront"}
        </button>

        {/* Analytics */}
        <div className="pt-2">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={16} className="text-teal-400" />
            <h2 className="text-sm font-semibold">Analytics</h2>
          </div>

          {analyticsLoading ? (
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map((i) => <div key={i} className="h-20 bg-white/5 rounded-xl animate-pulse" />)}
            </div>
          ) : analytics ? (
            <>
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="bg-white/[0.06] rounded-xl p-3 text-center">
                  <Eye size={15} className="text-gray-400 mx-auto mb-1" />
                  <p className="text-lg font-bold">{analytics.total_views}</p>
                  <p className="text-[10px] text-gray-500">Views</p>
                </div>
                <div className="bg-white/[0.06] rounded-xl p-3 text-center">
                  <WhatsAppMini />
                  <p className="text-lg font-bold">{analytics.total_whatsapp_clicks}</p>
                  <p className="text-[10px] text-gray-500">WhatsApp Taps</p>
                </div>
                <div className="bg-white/[0.06] rounded-xl p-3 text-center">
                  <MessageCircle size={15} className="text-gray-400 mx-auto mb-1" />
                  <p className="text-lg font-bold">{analytics.total_chats_started}</p>
                  <p className="text-[10px] text-gray-500">Chats</p>
                </div>
              </div>

              {analytics.per_listing?.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-xs text-gray-500 mb-1.5">By listing</p>
                  {analytics.per_listing.map((l) => (
                    <div key={l.id} className="flex items-center justify-between bg-white/[0.04] rounded-lg px-3 py-2">
                      <p className="text-xs text-gray-300 truncate flex-1 mr-2">{l.title}</p>
                      <div className="flex items-center gap-3 flex-shrink-0 text-[11px] text-gray-500">
                        <span className="flex items-center gap-1"><Eye size={10} /> {l.views_count}</span>
                        <span className="flex items-center gap-1">{l.whatsapp_clicks}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <p className="text-gray-500 text-sm">No data yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default StorefrontSettingsPage