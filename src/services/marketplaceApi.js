// ============================================================================
// MARKETPLACE API — MOCK LAYER
// ----------------------------------------------------------------------------
// The real backend (Python/FastAPI on Render) doesn't have marketplace or
// listing-chat endpoints yet. This file fakes them with localStorage so the
// frontend can be built and demoed now.
//
// HOW TO SWAP TO THE REAL BACKEND LATER:
// Every exported function here matches the same shape/signature it would
// have as a real API call (same params, same return shape, async). When the
// backend is ready, replace each function body with a `fetch` to BASE_URL —
// same pattern as services/api.js — and nothing calling these functions
// needs to change.
//
// Suggested real endpoints (for whoever builds the backend):
//   GET    /marketplace/listings?category=&school=&q=&skip=
//   GET    /marketplace/listings/:id
//   POST   /marketplace/listings              (FormData: title, price, category, description, photos[])
//   PATCH  /marketplace/listings/:id
//   DELETE /marketplace/listings/:id
//   GET    /marketplace/listings/mine
//   POST   /marketplace/listings/:id/chat      -> reuses the messages/conversations model,
//                                                  but tags the conversation with listing_id
//                                                  so ChatPage can show the pinned listing card.
// ============================================================================

const STORAGE_KEY = "campusloop_mock_listings"
const CHAT_LINK_KEY = "campusloop_mock_listing_chats" // conversationId -> listing snapshot

export const CATEGORIES = [
  "All", "Fashion", "Food", "Tech", "Beauty", "Tutoring", "Events", "Other",
]

const seedListings = () => ([
  {
    id: "seed-1",
    title: "Custom Ankara Corset Tops",
    price: 85,
    currency: "GHS",
    category: "Fashion",
    description: "Made-to-order corset tops, any size. Turnaround 3-5 days. DM your measurements.",
    photos: [],
    school_name: "HTU",
    seller: { id: "seller-1", username: "adwoa_stitches", full_name: "Adwoa Mensah", avatar_url: null, is_verified: true },
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    status: "active",
  },
  {
    id: "seed-2",
    title: "Late-Night Waakye Delivery",
    price: 15,
    currency: "GHS",
    category: "Food",
    description: "Hostel delivery only, 9pm-1am. Extra egg +2, extra meat +5.",
    photos: [],
    school_name: "HTU",
    seller: { id: "seller-2", username: "waakye_plug", full_name: "Kojo Boateng", avatar_url: null, is_verified: false },
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    status: "active",
  },
  {
    id: "seed-3",
    title: "iPhone Screen Repair (Same Day)",
    price: 250,
    currency: "GHS",
    category: "Tech",
    description: "iPhone 8 through 13. Original quality parts. Come to my hostel or I come to you (+20).",
    photos: [],
    school_name: "KNUST",
    seller: { id: "seller-3", username: "fix_am_gh", full_name: "Yaw Owusu", avatar_url: null, is_verified: true },
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    status: "active",
  },
])

const readListings = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      const seeded = seedListings()
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded))
      return seeded
    }
    return JSON.parse(raw)
  } catch {
    return []
  }
}

const writeListings = (listings) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(listings))
}

const delay = (ms = 350) => new Promise((res) => setTimeout(res, ms))

// --- LISTINGS ---

export const getListings = async (token, { category = "All", school, query, skip = 0, limit = 20 } = {}) => {
  await delay()
  let listings = readListings().filter((l) => l.status === "active")

  if (category && category !== "All") {
    listings = listings.filter((l) => l.category === category)
  }
  if (school) {
    listings = listings.filter((l) => l.school_name === school)
  }
  if (query?.trim()) {
    const q = query.trim().toLowerCase()
    listings = listings.filter(
      (l) => l.title.toLowerCase().includes(q) || l.description.toLowerCase().includes(q)
    )
  }

  listings = listings.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  return listings.slice(skip, skip + limit)
}

export const getListing = async (listingId, _token) => {
  await delay(200)
  const listing = readListings().find((l) => l.id === listingId)
  if (!listing) throw new Error("Listing not found")
  return listing
}

export const getMyListings = async (_token) => {
  await delay(200)
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}")
  return readListings().filter((l) => l.seller.id === currentUser.id || l.seller.username === currentUser.username)
}

export const createListing = async (formData, _token) => {
  await delay(500)
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}")

  const newListing = {
    id: `local-${Date.now()}`,
    title: formData.title,
    price: Number(formData.price) || 0,
    currency: "GHS",
    category: formData.category,
    description: formData.description,
    photos: formData.photoPreviews || [],
    school_name: currentUser.school_name || "Your School",
    seller: {
      id: currentUser.id || "me",
      username: currentUser.username || "you",
      full_name: currentUser.full_name || "You",
      avatar_url: currentUser.avatar_url || null,
      is_verified: !!currentUser.is_verified,
    },
    created_at: new Date().toISOString(),
    status: "active",
  }

  const listings = readListings()
  listings.unshift(newListing)
  writeListings(listings)
  return newListing
}

export const deleteListing = async (listingId, _token) => {
  await delay(200)
  const listings = readListings().filter((l) => l.id !== listingId)
  writeListings(listings)
  return { success: true }
}

// --- LISTING CHAT ---
// Reuses the same conversation/message system as DMs (see services/api.js
// startDM / getConversations / getMessages). We just tag the conversation
// with the listing it came from so ChatPage can render a pinned listing card.

export const startListingChat = async (listingId, token) => {
  await delay(300)
  const listing = await getListing(listingId, token)

  // Fake conversation id derived from listing + a marker so ChatPage can
  // detect it's a marketplace thread without extra backend support.
  const conversationId = `listing-${listing.id}`

  const links = JSON.parse(localStorage.getItem(CHAT_LINK_KEY) || "{}")
  links[conversationId] = {
    listing_id: listing.id,
    title: listing.title,
    price: listing.price,
    currency: listing.currency,
    thumbnail: listing.photos?.[0] || null,
    seller_username: listing.seller.username,
  }
  localStorage.setItem(CHAT_LINK_KEY, JSON.stringify(links))

  return {
    id: conversationId,
    name: listing.seller.full_name,
    username: listing.seller.username,
    avatar_url: listing.seller.avatar_url,
    type: "listing",
  }
}

// Called from ChatPage to check if a conversation has a listing pinned to it.
export const getListingContext = (conversationId) => {
  try {
    const links = JSON.parse(localStorage.getItem(CHAT_LINK_KEY) || "{}")
    return links[conversationId] || null
  } catch {
    return null
  }
}

// --- MOCK MESSAGES FOR LISTING CHATS ---
// Real DMs use services/api.js (getMessages/send, backed by the Python API).
// Listing chats don't exist on that backend yet, so we fake the same message
// shape here. Once the backend supports "conversations tagged with a
// listing_id", delete this block and route listing chats through the normal
// getMessages/send functions in api.js instead — ChatPage.jsx is already
// written to make that swap a one-line change (see isMockThread there).

const MOCK_MESSAGES_KEY = "campusloop_mock_listing_messages" // conversationId -> message[]

const readMockMessages = (conversationId) => {
  try {
    const all = JSON.parse(localStorage.getItem(MOCK_MESSAGES_KEY) || "{}")
    return all[conversationId] || []
  } catch {
    return []
  }
}

const writeMockMessages = (conversationId, messages) => {
  const all = JSON.parse(localStorage.getItem(MOCK_MESSAGES_KEY) || "{}")
  all[conversationId] = messages
  localStorage.setItem(MOCK_MESSAGES_KEY, JSON.stringify(all))
}

export const getListingMessages = async (conversationId) => {
  await delay(150)
  return readMockMessages(conversationId)
}

export const sendListingMessage = async (conversationId, text) => {
  await delay(150)
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}")
  const messages = readMockMessages(conversationId)
  const message = {
    id: `mock-${Date.now()}`,
    text,
    message_type: "text",
    sender_id: currentUser.id || "me",
    sender_username: currentUser.username || "you",
    sender_avatar: currentUser.avatar_url || null,
    is_mine: true,
    created_at: new Date().toISOString(),
  }
  messages.push(message)
  writeMockMessages(conversationId, messages)
  return message
}