import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { CheckCircle2, XCircle } from 'lucide-react'
import { verifyFeaturePayment } from '../services/marketplaceApi'

function PaymentCallbackPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = localStorage.getItem("token")

  const [state, setState] = useState("verifying") // "verifying" | "success" | "failed"
  const [listing, setListing] = useState(null)
  const [error, setError] = useState("")

  useEffect(() => {
    const reference = searchParams.get("reference") || searchParams.get("trxref")
    if (!reference) {
      setState("failed")
      setError("Missing payment reference")
      return
    }

    verifyFeaturePayment(reference, token)
      .then((result) => {
        if (result.status === "success") {
          setListing(result.listing)
          setState("success")
        } else {
          setState("failed")
        }
      })
      .catch((err) => {
        setState("failed")
        setError(err.message || "Something went wrong verifying your payment")
      })
  }, [])

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 text-center">
      {state === "verifying" && (
        <>
          <div className="w-8 h-8 border-2 border-teal-400 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-gray-300">Confirming your payment...</p>
        </>
      )}

      {state === "success" && (
        <>
          <CheckCircle2 size={48} className="text-teal-400 mb-4" />
          <h1 className="text-lg font-semibold mb-1">Listing Featured!</h1>
          <p className="text-sm text-gray-400 mb-6">
            {listing?.title ? `"${listing.title}" is now pinned to the top of the marketplace.` : "Your listing is now pinned to the top of the marketplace."}
          </p>
          <button
            onClick={() => navigate(listing ? `/marketplace/${listing.id}` : "/marketplace/mine", { replace: true })}
            className="bg-teal-500 text-black px-6 py-3 rounded-xl font-semibold"
          >
            View Listing
          </button>
        </>
      )}

      {state === "failed" && (
        <>
          <XCircle size={48} className="text-red-400 mb-4" />
          <h1 className="text-lg font-semibold mb-1">Payment Didn't Go Through</h1>
          {error && <p className="text-sm text-gray-400 mb-6">{error}</p>}
          <button
            onClick={() => navigate("/marketplace/mine", { replace: true })}
            className="bg-white/10 px-6 py-3 rounded-xl font-semibold"
          >
            Back to My Listings
          </button>
        </>
      )}
    </div>
  )
}

export default PaymentCallbackPage