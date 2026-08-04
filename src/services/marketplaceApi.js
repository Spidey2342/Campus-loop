// ============================================================================
// MARKETPLACE API — connects to the real backend
// ----------------------------------------------------------------------------
// Mirrors the pattern in services/api.js. All the mock/localStorage logic
// that used to live here has been removed now that the backend actually
// implements these endpoints (see app/routers/marketplace.py).
// ============================================================================

const BASE_URL = "https://campus-backend-moz5.onrender.com"

export const CATEGORIES = [
  "All", "Fashion", "Food", "Tech", "Beauty", "Tutoring", "Events", "Other",
]

const authFetch = async (url, options = {}) => {
  const response = await fetch(url, options)
  if (response.status === 401) {
    localStorage.clear()
    window.location.href = "/login"
    return
  }
  if (response.status === 429) {
    throw new Error("You're doing that too fast. Please slow down.")
  }
  return response
}

// --- LISTINGS ---

export const getListings = async (token, { category = "All", school, query, skip = 0, limit = 20 } = {}) => {
  const params = new URLSearchParams()
  if (category && category !== "All") params.set("category", category)
  if (school) params.set("school", school)
  if (query?.trim()) params.set("q", query.trim())
  params.set("skip", skip)
  params.set("limit", limit)

  const response = await authFetch(`${BASE_URL}/marketplace/listings?${params.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!response || !response.ok) throw new Error("Failed to load listings")
  return response.json()
}

export const getListing = async (listingId, token) => {
  const response = await authFetch(`${BASE_URL}/marketplace/listings/${listingId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!response || !response.ok) throw new Error("Listing not found")
  return response.json()
}

export const getMyListings = async (token) => {
  const response = await authFetch(`${BASE_URL}/marketplace/listings/mine`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!response || !response.ok) throw new Error("Failed to load your listings")
  return response.json()
}

// photoFiles: array of real File objects (not base64 previews)
export const createListing = async ({ title, price, category, description, photoFiles = [] }, token) => {
  const formData = new FormData()
  formData.append("title", title)
  formData.append("description", description)
  formData.append("price", price)
  formData.append("category", category)
  photoFiles.forEach((file) => formData.append("photos", file))

  const response = await fetch(`${BASE_URL}/marketplace/listings`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    // No Content-Type header — the browser sets the multipart boundary itself
    body: formData,
  })
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.detail || "Failed to create listing")
  }
  return response.json()
}

export const deleteListing = async (listingId, token) => {
  const response = await authFetch(`${BASE_URL}/marketplace/listings/${listingId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!response || !response.ok) throw new Error("Failed to delete listing")
  return response.json()
}

export const updateListingStatus = async (listingId, status, token) => {
  const response = await authFetch(`${BASE_URL}/marketplace/listings/${listingId}/status`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  })
  if (!response || !response.ok) throw new Error("Failed to update listing")
  return response.json()
}

// keepPhotoUrls: existing Cloudinary URLs the seller kept (strings)
// newPhotoFiles: newly added real File objects
export const updateListing = async (listingId, { title, price, category, description, keepPhotoUrls = [], newPhotoFiles = [] }, token) => {
  const formData = new FormData()
  formData.append("title", title)
  formData.append("description", description)
  formData.append("price", price)
  formData.append("category", category)
  keepPhotoUrls.forEach((url) => formData.append("keep_photo_urls", url))
  newPhotoFiles.forEach((file) => formData.append("new_photos", file))

  const response = await fetch(`${BASE_URL}/marketplace/listings/${listingId}`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  })
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.detail || "Failed to save changes")
  }
  return response.json()
}

// --- LISTING CHAT ---
// Reuses the real conversations/messages system (see services/api.js
// getMessages / send). This just creates (or reuses) a conversation tagged
// with the listing — the returned conversation already includes a
// `.listing` snapshot for the pinned card in ChatPage.

export const startListingChat = async (listingId, token) => {
  const response = await authFetch(`${BASE_URL}/marketplace/listings/${listingId}/chat`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!response || !response.ok) {
    const error = await response?.json().catch(() => ({}))
    throw new Error(error?.detail || "Failed to start chat")
  }
  return response.json()
}

// --- FEATURED LISTINGS (payment) ---

export const getFeaturePricing = async (token) => {
  const response = await authFetch(`${BASE_URL}/marketplace/feature-pricing`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!response || !response.ok) throw new Error("Failed to load pricing")
  return response.json() // { currency, options: [{ duration_days, amount }] }
}

// Returns { authorization_url, reference, amount, duration_days }.
// Caller should redirect the browser to authorization_url:
//   window.location.href = data.authorization_url
export const initializeFeaturePayment = async (listingId, durationDays, token) => {
  const response = await authFetch(`${BASE_URL}/marketplace/listings/${listingId}/feature/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ duration_days: durationDays }),
  })
  if (!response || !response.ok) {
    const error = await response?.json().catch(() => ({}))
    throw new Error(error?.detail || "Failed to start payment")
  }
  return response.json()
}

// Called on the payment callback page after Paystack redirects back with
// ?reference=... in the URL.
export const verifyFeaturePayment = async (reference, token) => {
  const response = await authFetch(`${BASE_URL}/marketplace/payments/verify/${reference}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!response || !response.ok) {
    const error = await response?.json().catch(() => ({}))
    throw new Error(error?.detail || "Failed to verify payment")
  }
  return response.json() // { status: "success" | "failed" | "pending", listing? }
}

// --- SELLER STATUS ---
// Real network calls now — components using this need to handle it as
// async (see the loading-state changes in MarketplacePage, CreateListingPage,
// BecomeSellerPage, SellerAccountCard).

const mapSellerStatus = (data) => ({
  isSeller: data.is_seller,
  source: data.source,
  trialEndsAt: data.trial_ends_at,
  daysLeft: data.days_left,
})

export const getSellerStatus = async (token) => {
  const response = await authFetch(`${BASE_URL}/marketplace/seller-status`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!response || !response.ok) {
    return { isSeller: false, source: null, trialEndsAt: null, daysLeft: 0 }
  }
  return mapSellerStatus(await response.json())
}

export const startSellerTrial = async (token) => {
  const response = await authFetch(`${BASE_URL}/marketplace/become-seller`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!response || !response.ok) {
    const error = await response?.json().catch(() => ({}))
    throw new Error(error?.detail || "Failed to start seller trial")
  }
  return mapSellerStatus(await response.json())
}