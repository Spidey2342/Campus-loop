import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, ImagePlus, X } from 'lucide-react'
import { getListing, updateListing, CATEGORIES } from '../services/marketplaceApi'
import Sidebar from '../components/layouts/Sidebar'

const SELLABLE_CATEGORIES = CATEGORIES.filter((c) => c !== "All")

function EditListingPage() {
  const { listingId } = useParams()
  const navigate = useNavigate()
  const token = localStorage.getItem("token")

  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState(SELLABLE_CATEGORIES[0])
  const [description, setDescription] = useState("")
  // existingPhotos: real Cloudinary URLs (strings) already on the listing
  const [existingPhotos, setExistingPhotos] = useState([])
  // newPhotos: real File objects picked just now, with a preview URL each
  const [newPhotos, setNewPhotos] = useState([]) // [{ file, preview }]
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const load = async () => {
      try {
        const listing = await getListing(listingId, token)
        setTitle(listing.title)
        setPrice(String(listing.price))
        setCategory(listing.category)
        setDescription(listing.description)
        setExistingPhotos(listing.photos || [])
      } catch (err) {
        setError("Couldn't load this listing")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [listingId])

  const totalPhotoCount = existingPhotos.length + newPhotos.length

  const handlePhotoSelect = (e) => {
    const files = Array.from(e.target.files || []).slice(0, 4 - totalPhotoCount)
    const added = files.map((file) => ({ file, preview: URL.createObjectURL(file) }))
    setNewPhotos((prev) => [...prev, ...added])
  }

  const removeExistingPhoto = (index) => {
    setExistingPhotos((prev) => prev.filter((_, i) => i !== index))
  }

  const removeNewPhoto = (index) => {
    setNewPhotos((prev) => {
      URL.revokeObjectURL(prev[index]?.preview)
      return prev.filter((_, i) => i !== index)
    })
  }

  const isValid = title.trim() && price && Number(price) > 0 && description.trim()

  const handleSubmit = async () => {
    if (!isValid || submitting) return
    setSubmitting(true)
    setError("")
    try {
      await updateListing(
        listingId,
        {
          title: title.trim(),
          price,
          category,
          description: description.trim(),
          keepPhotoUrls: existingPhotos,
          newPhotoFiles: newPhotos.map((p) => p.file),
        },
        token
      )
      navigate(`/marketplace/${listingId}`, { replace: true })
    } catch (err) {
      setError(err.message || "Failed to save changes")
    } finally {
      setSubmitting(false)
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

  return (
    <div className="min-h-screen bg-black text-white pb-10 lg:pl-60">
      <Sidebar />
      <div className="lg:max-w-2xl lg:mx-auto">
      <div className="flex items-center gap-3 px-4 py-4 border-b border-white/10">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-semibold text-lg">Edit Listing</h1>
      </div>

      <div className="px-4 py-5 space-y-6">
        {/* Photos */}
        <div>
          <label className="text-xs text-gray-400 uppercase tracking-wide mb-2 block">
            Photos ({totalPhotoCount}/4)
          </label>
          <div className="flex gap-2 overflow-x-auto">
            {existingPhotos.map((src, i) => (
              <div key={`existing-${i}`} className="relative w-20 h-20 flex-shrink-0">
                <img src={src} className="w-full h-full object-cover rounded-xl" />
                <button
                  onClick={() => removeExistingPhoto(i)}
                  className="absolute -top-1.5 -right-1.5 bg-black rounded-full p-0.5 border border-white/20"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
            {newPhotos.map((p, i) => (
              <div key={`new-${i}`} className="relative w-20 h-20 flex-shrink-0">
                <img src={p.preview} className="w-full h-full object-cover rounded-xl" />
                <button
                  onClick={() => removeNewPhoto(i)}
                  className="absolute -top-1.5 -right-1.5 bg-black rounded-full p-0.5 border border-white/20"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
            {totalPhotoCount < 4 && (
              <label className="w-20 h-20 flex-shrink-0 rounded-xl border border-dashed border-white/20 flex flex-col items-center justify-center cursor-pointer text-gray-400 gap-1">
                <ImagePlus size={18} />
                <span className="text-[10px]">Add</span>
                <input type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoSelect} />
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
                  category === cat ? "bg-teal-500 text-black font-semibold" : "bg-white/10 text-gray-300"
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
          {submitting ? "Saving..." : "Save Changes"}
        </button>
      </div>
      </div>
    </div>
  )
}

export default EditListingPage