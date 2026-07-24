import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Pencil, Trash2, CheckCircle2, RotateCcw, Plus } from 'lucide-react'
import { getMyListings, updateListingStatus, deleteListing } from '../services/marketplaceApi'

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
                    <StatusBadge status={listing.status} />
                  </div>
                  <p className="text-sm text-teal-300 font-semibold mt-0.5">
                    {listing.currency} {listing.price}
                  </p>

                  <div className="flex items-center gap-4 mt-2">
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
    </div>
  )
}

export default MyListingsPage