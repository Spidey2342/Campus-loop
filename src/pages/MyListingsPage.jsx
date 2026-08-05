import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Pencil, Trash2, CheckCircle2, RotateCcw, Plus, Star, Check } from 'lucide-react'
import { getMyListings, updateListingStatus, deleteListing, getFeaturePricing, initializeFeaturePayment, getMyWhatsapp, setMyWhatsapp } from '../services/marketplaceApi'

function WhatsAppIcon({ size = 16, className = "" }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.149-.15.298-.347.446-.52.149-.174.198-.298.297-.497.099-.198.05-.371-.05-.52-.099-.149-.895-2.157-1.227-2.876-.297-.646-.596-.556-.818-.567-.213-.01-.457-.012-.702-.012-.245 0-.643.099-.878.373-.235.273-.895.874-.895 2.14 0 1.265.919 2.489 1.048 2.66.13.174 1.783 2.723 4.36 3.708 2.577.984 2.577.656 3.042.615.465-.041 1.507-.615 1.719-1.213.213-.596.213-1.107.15-1.213-.065-.106-.24-.174-.537-.322z"/>
      <path d="M12.026 2c-5.514 0-9.98 4.467-9.98 9.98 0 1.85.51 3.578 1.395 5.062L2 22l5.13-1.346a9.925 9.925 0 0 0 4.896 1.325h.004c5.512 0 9.978-4.467 9.978-9.98 0-2.665-1.037-5.169-2.921-7.052A9.941 9.941 0 0 0 12.026 2zm5.81 15.78a8.286 8.286 0 0 1-5.81 2.408 8.29 8.29 0 0 1-4.222-1.157l-.303-.18-3.045.8.813-2.968-.198-.313a8.275 8.275 0 0 1-1.27-4.39c0-4.575 3.723-8.298 8.302-8.298 2.219 0 4.303.865 5.87 2.437a8.235 8.235 0 0 1 2.43 5.867c0 4.577-3.723 8.3-8.29 8.3z"/>
    </svg>
  )
}

function StatusBadge({ status }) {
  const styles = {
    active: "bg-teal-500/15 text-teal-300 border-teal-500/35",
    sold: "bg-gray-500/15 text-gray-400 border-gray-500/30",
  }
  return (
    <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border ${styles[status] || styles.active}`}>
      {status}
    </span>
  )
}

function MyListingsPage() {
  const navigate = useNavigate()
  const token = localStorage.getItem("token")

  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)

  // Feature-listing modal state
  const [featureListing, setFeatureListing] = useState(null) // the listing object, or null when closed
  const [pricingOptions, setPricingOptions] = useState([])
  const [pricingLoading, setPricingLoading] = useState(false)
  const [selectedDuration, setSelectedDuration] = useState(null)
  const [featureSubmitting, setFeatureSubmitting] = useState(false)
  const [featureError, setFeatureError] = useState("")

  // WhatsApp contact settings
  const [whatsapp, setWhatsapp] = useState(null) // null while loading, "" if unset, else the number
  const [editingWhatsapp, setEditingWhatsapp] = useState(false)
  const [whatsappInput, setWhatsappInput] = useState("")
  const [whatsappSaving, setWhatsappSaving] = useState(false)
  const [whatsappError, setWhatsappError] = useState("")

  useEffect(() => {
    getMyWhatsapp(token).then((data) => {
      setWhatsapp(data.whatsapp_number || "")
      setWhatsappInput(data.whatsapp_number || "")
    })
  }, [])

  const handleSaveWhatsapp = async () => {
    if (whatsappSaving) return
    setWhatsappSaving(true)
    setWhatsappError("")
    try {
      const result = await setMyWhatsapp(whatsappInput.trim(), token)
      setWhatsapp(result.whatsapp_number || "")
      setEditingWhatsapp(false)
    } catch (err) {
      setWhatsappError(err.message || "Couldn't save that number")
    } finally {
      setWhatsappSaving(false)
    }
  }

  const load = async () => {
    try {
      const data = await getMyListings(token)
      setListings(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleToggleSold = async (listing) => {
    setBusyId(listing.id)
    try {
      const nextStatus = listing.status === "sold" ? "active" : "sold"
      await updateListingStatus(listing.id, nextStatus, token)
      setListings((prev) => prev.map((l) => l.id === listing.id ? { ...l, status: nextStatus } : l))
    } catch (err) {
      console.error(err)
    } finally {
      setBusyId(null)
    }
  }

  const handleDelete = async (listingId) => {
    setBusyId(listingId)
    try {
      await deleteListing(listingId, token)
      setListings((prev) => prev.filter((l) => l.id !== listingId))
      setConfirmDeleteId(null)
    } catch (err) {
      console.error(err)
    } finally {
      setBusyId(null)
    }
  }

  const openFeatureModal = async (listing) => {
    setFeatureListing(listing)
    setFeatureError("")
    setSelectedDuration(null)
    setPricingLoading(true)
    try {
      const data = await getFeaturePricing(token)
      setPricingOptions(data.options || [])
      if (data.options?.length) setSelectedDuration(data.options[0].duration_days)
    } catch (err) {
      setFeatureError("Couldn't load pricing — try again")
    } finally {
      setPricingLoading(false)
    }
  }

  const handleStartFeaturePayment = async () => {
    if (!selectedDuration || !featureListing || featureSubmitting) return
    setFeatureSubmitting(true)
    setFeatureError("")
    try {
      const result = await initializeFeaturePayment(featureListing.id, selectedDuration, token)
      // Hand off to Paystack's hosted checkout — it redirects back to
      // /marketplace/payment/callback when done.
      window.location.href = result.authorization_url
    } catch (err) {
      setFeatureError(err.message || "Couldn't start payment")
      setFeatureSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white pb-10">
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
          </button>
          <h1 className="font-semibold text-lg">My Listings</h1>
        </div>
        <button
          onClick={() => navigate("/marketplace/new")}
          className="bg-teal-500 text-black rounded-full p-2"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* WhatsApp contact settings */}
      {whatsapp !== null && (
        <div className="px-4 pt-4">
          <div className="bg-white/[0.06] border border-white/10 rounded-xl p-3.5">
            {!editingWhatsapp ? (
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#25D366]/15 flex items-center justify-center flex-shrink-0">
                  <WhatsAppIcon size={16} className="text-[#25D366]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">WhatsApp Contact</p>
                  <p className="text-xs text-gray-400 truncate">
                    {whatsapp ? whatsapp : "Not set — buyers can only use in-app chat"}
                  </p>
                </div>
                <button
                  onClick={() => { setWhatsappInput(whatsapp); setEditingWhatsapp(true) }}
                  className="text-xs text-teal-400 font-medium flex-shrink-0"
                >
                  {whatsapp ? "Edit" : "Add"}
                </button>
              </div>
            ) : (
              <div>
                <p className="text-xs text-gray-400 mb-2">
                  Buyers will see a WhatsApp button on your listings to message you directly.
                </p>
                <div className="flex gap-2">
                  <input
                    value={whatsappInput}
                    onChange={(e) => setWhatsappInput(e.target.value)}
                    placeholder="e.g. 0244123456"
                    className="flex-1 bg-white/10 rounded-lg px-3 py-2.5 text-sm outline-none placeholder-gray-500"
                  />
                  <button
                    onClick={handleSaveWhatsapp}
                    disabled={whatsappSaving}
                    className="bg-teal-500 text-black px-3.5 rounded-lg disabled:opacity-50"
                  >
                    <Check size={16} />
                  </button>
                  <button
                    onClick={() => { setEditingWhatsapp(false); setWhatsappError("") }}
                    disabled={whatsappSaving}
                    className="bg-white/10 text-white px-3.5 rounded-lg text-sm"
                  >
                    Cancel
                  </button>
                </div>
                {whatsappError && <p className="text-red-400 text-xs mt-2">{whatsappError}</p>}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="px-4 py-4">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-24 bg-white/10 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-center px-6">
            <p className="text-gray-400 text-sm">You haven't posted anything yet.</p>
            <button
              onClick={() => navigate("/marketplace/new")}
              className="text-teal-400 text-sm font-medium"
            >
              Post your first listing →
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {listings.map((listing) => (
              <div key={listing.id} className="bg-white/10 rounded-xl p-3 flex gap-3">
                <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-teal-800 to-teal-950 flex-shrink-0 flex items-center justify-center overflow-hidden">
                  {listing.photos?.[0] ? (
                    <img src={listing.photos[0]} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white/30 text-[10px] text-center px-1">{listing.category}</span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium truncate">{listing.title}</p>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {listing.is_featured && (
                        <span className="flex items-center gap-0.5 text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-1.5 py-0.5 rounded-full">
                          <Star size={9} fill="currentColor" /> Featured
                        </span>
                      )}
                      <StatusBadge status={listing.status} />
                    </div>
                  </div>
                  <p className="text-sm text-teal-300 font-semibold mt-0.5">
                    {listing.currency} {listing.price}
                  </p>

                  <div className="flex items-center gap-3.5 mt-2 flex-wrap">
                    <button
                      onClick={() => navigate(`/marketplace/${listing.id}/edit`)}
                      className="flex items-center gap-1 text-xs text-gray-300"
                    >
                      <Pencil size={12} /> Edit
                    </button>
                    <button
                      onClick={() => handleToggleSold(listing)}
                      disabled={busyId === listing.id}
                      className="flex items-center gap-1 text-xs text-gray-300 disabled:opacity-50"
                    >
                      {listing.status === "sold" ? (
                        <><RotateCcw size={12} /> Relist</>
                      ) : (
                        <><CheckCircle2 size={12} /> Mark sold</>
                      )}
                    </button>
                    {listing.status === "active" && !listing.is_featured && (
                      <button
                        onClick={() => openFeatureModal(listing)}
                        className="flex items-center gap-1 text-xs text-amber-400 font-medium"
                      >
                        <Star size={12} /> Feature
                      </button>
                    )}
                    <button
                      onClick={() => setConfirmDeleteId(listing.id)}
                      disabled={busyId === listing.id}
                      className="flex items-center gap-1 text-xs text-red-400 disabled:opacity-50"
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete confirmation */}
      {confirmDeleteId && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-6"
          onClick={() => setConfirmDeleteId(null)}
        >
          <div
            className="bg-gray-900 w-full max-w-sm rounded-2xl p-6 border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-white text-lg font-semibold mb-2">Delete this listing?</h2>
            <p className="text-gray-400 text-sm mb-6">
              Buyers won't be able to find it anymore. This can't be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="flex-1 bg-white/10 py-3 rounded-xl text-white text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDeleteId)}
                disabled={busyId === confirmDeleteId}
                className="flex-1 bg-red-500 py-3 rounded-xl text-white text-sm font-semibold disabled:opacity-60"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feature listing modal */}
      {featureListing && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center"
          onClick={() => !featureSubmitting && setFeatureListing(null)}
        >
          <div
            className="bg-gray-900 w-full sm:max-w-sm rounded-t-2xl sm:rounded-2xl p-6 border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 mb-1">
              <Star size={16} className="text-amber-400" fill="currentColor" />
              <h2 className="text-white text-lg font-semibold">Feature This Listing</h2>
            </div>
            <p className="text-gray-400 text-sm mb-5">
              Pin "{featureListing.title}" to the top of the marketplace feed.
            </p>

            {pricingLoading ? (
              <div className="flex justify-center py-6">
                <div className="w-5 h-5 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="space-y-2 mb-5">
                {pricingOptions.map((opt) => (
                  <button
                    key={opt.duration_days}
                    onClick={() => setSelectedDuration(opt.duration_days)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-left transition-all ${
                      selectedDuration === opt.duration_days
                        ? "border-teal-400 bg-teal-500/10"
                        : "border-white/10 bg-white/5"
                    }`}
                  >
                    <span className="text-sm text-white">{opt.duration_days} days</span>
                    <span className="text-sm font-semibold text-teal-300">GHS {opt.amount}</span>
                  </button>
                ))}
              </div>
            )}

            {featureError && <p className="text-red-400 text-xs mb-3">{featureError}</p>}

            <div className="flex gap-3">
              <button
                onClick={() => setFeatureListing(null)}
                disabled={featureSubmitting}
                className="flex-1 bg-white/10 py-3 rounded-xl text-white text-sm disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleStartFeaturePayment}
                disabled={!selectedDuration || featureSubmitting || pricingLoading}
                className="flex-1 bg-amber-500 py-3 rounded-xl text-black text-sm font-semibold disabled:opacity-50"
              >
                {featureSubmitting ? "Redirecting..." : "Pay & Feature"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyListingsPage