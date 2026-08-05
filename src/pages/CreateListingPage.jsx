import React, { useState, useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { ArrowLeft, ImagePlus, X, Clock } from 'lucide-react'
import { createListing, CATEGORIES, getSellerStatus } from '../services/marketplaceApi'

const SELLABLE_CATEGORIES = CATEGORIES.filter((c) => c !== "All")

function CreateListingPage() {
  const navigate = useNavigate()
  const token = localStorage.getItem("token")

  const [sellerStatus, setSellerStatus] = useState(null)
  const [statusLoading, setStatusLoading] = useState(true)

  const [title, setTitle] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState(SELLABLE_CATEGORIES[0])
  const [description, setDescription] = useState("")
  // Keep real File objects for upload, and a parallel preview URL per file for display
  const [photos, setPhotos] = useState([]) // [{ file, preview }]
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    let active = true
    getSellerStatus(token).then((status) => {
      if (active) {
        setSellerStatus(status)
        setStatusLoading(false)
      }
    })
    return () => { active = false }
  }, [])

  const handlePhotoSelect = (e) => {
    const files = Array.from(e.target.files || []).slice(0, 4 - photos.length)
    const newPhotos = files.map((file) => ({ file, preview: URL.createObjectURL(file) }))
    setPhotos((prev) => [...prev, ...newPhotos])
  }

  const removePhoto = (index) => {
    setPhotos((prev) => {
      URL.revokeObjectURL(prev[index]?.preview)
      return prev.filter((_, i) => i !== index)
    })
  }

  const isValid = title.trim() && price && Number(price) > 0 && description.trim()

  if (statusLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // Defense in depth — the Marketplace "+" button already routes non-sellers
  // to /marketplace/become-seller, but someone could still hit this URL
  // directly (bookmark, back button, etc).
  if (!sellerStatus.isSeller) {
    return <Navigate to="/marketplace/become-seller" replace />
  }

  const handleSubmit = async () => {
    if (!isValid || submitting) return
    setSubmitting(true)
    setError("")
    try {
      const listing = await createListing(
        {
          title: title.trim(),
          price,
          category,
          description: description.trim(),
          photoFiles: photos.map((p) => p.file),
        },
        token
      )
      navigate(`/marketplace/${listing.id}`, { replace: true })
    } catch (err) {
      setError(err.message || "Failed to create listing")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white pb-10">
      <div className="flex items-center gap-3 px-4 py-4 border-b border-white/10">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-semibold text-lg flex-1">New Listing</h1>
        {sellerStatus.daysLeft !== null && sellerStatus.trialEndsAt && (
          <div className="flex items-center gap-1.5 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/25 px-2.5 py-1 rounded-full">
            <Clock size={12} />
            {sellerStatus.daysLeft} {sellerStatus.daysLeft === 1 ? "day" : "days"} left
          </div>
        )}
      </div>

      <div className="px-4 py-5 space-y-6">
        {/* Photos */}
        <div>
          <label className="text-xs text-gray-400 uppercase tracking-wide mb-2 block">
            Photos ({photos.length}/4)
          </label>
          <div className="flex gap-2 overflow-x-auto">
            {photos.map((p, i) => (
              <div key={i} className="relative w-20 h-20 flex-shrink-0">
                <img src={p.preview} className="w-full h-full object-cover rounded-xl" />
                <button
                  onClick={() => removePhoto(i)}
                  className="absolute -top-1.5 -right-1.5 bg-black rounded-full p-0.5 border border-white/20"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
            {photos.length < 4 && (
              <label className="w-20 h-20 flex-shrink-0 rounded-xl border border-dashed border-white/20 flex flex-col items-center justify-center cursor-pointer text-gray-400 gap-1">
                <ImagePlus size={18} />
                <span className="text-[10px]">Add</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handlePhotoSelect}
                />
              </label>
            )}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="text-xs text-gray-400 uppercase tracking-wide mb-2 block">
            What are you selling?
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Custom Ankara Corset Tops"
            maxLength={80}
            className="w-full bg-white/10 rounded-xl px-4 py-3.5 text-sm outline-none placeholder-gray-500"
          />
        </div>

        {/* Price */}
        <div>
          <label className="text-xs text-gray-400 uppercase tracking-wide mb-2 block">
            Price (GHS)
          </label>
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value.replace(/[^0-9.]/g, ""))}
            placeholder="0.00"
            inputMode="decimal"
            className="w-full bg-white/10 rounded-xl px-4 py-3.5 text-sm outline-none placeholder-gray-500"
          />
        </div>

        {/* Category */}
        <div>
          <label className="text-xs text-gray-400 uppercase tracking-wide mb-2 block">
            Category
          </label>
          <div className="flex gap-2 flex-wrap">
            {SELLABLE_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm transition-all ${
                  category === cat
                    ? "bg-teal-500 text-black font-semibold"
                    : "bg-white/10 text-gray-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="text-xs text-gray-400 uppercase tracking-wide mb-2 block">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Sizes, turnaround time, delivery options, anything a buyer needs to know..."
            rows={4}
            maxLength={500}
            className="w-full bg-white/10 rounded-xl px-4 py-3.5 text-sm outline-none placeholder-gray-500 resize-none"
          />
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={!isValid || submitting}
          className="w-full bg-teal-500 text-black py-4 rounded-xl font-semibold disabled:opacity-40"
        >
          {submitting ? "Posting..." : "Post Listing"}
        </button>
      </div>
    </div>
  )
}

export default CreateListingPage