// --- SELLER STATUS / GATING ---
// Not everyone can post listings. There are three ways to become a seller:
//   1. "trial"      — self-serve, anyone can start it, free for 7 days, then
//                      needs payment (payment integration isn't built yet —
//                      that's the next piece once this is wired to real auth).
//   2. "admin_free"  — you personally add someone as a seller (e.g. the
//                      ambassadors/sellers you're hand-picking). Free forever,
//                      no trial clock. Real version: an admin-only endpoint
//                      gated by is_admin, same pattern as your existing
//                      AdminPage. For now the mock ADMIN_GRANTED_USERNAMES
//                      list below stands in for "people I added by hand."
//   3. none          — can browse the marketplace and chat as a buyer, but
//                      the "+" (post a listing) flow redirects to the
//                      become-a-seller screen instead of the listing form.
//
// Suggested real backend fields (on the User model):
//   is_seller            BOOLEAN
//   seller_source         ENUM('trial', 'admin_free', 'paid')
//   seller_trial_ends_at  TIMESTAMP, nullable
// A create-listing endpoint would check is_seller + (seller_source != 'trial'
// OR seller_trial_ends_at > now()) before accepting a new listing.

const SELLER_KEY = "campusloop_mock_sellers" // username -> seller record
const TRIAL_DAYS = 7

// Stand-in for "people I've personally added as free sellers." Add usernames
// here to simulate admin-granted seller status until the real admin flow
// exists on the backend.
const ADMIN_GRANTED_USERNAMES = []

const readSellerRecord = (username) => {
  try {
    const all = JSON.parse(localStorage.getItem(SELLER_KEY) || "{}")
    return all[username] || null
  } catch {
    return null
  }
}

const writeSellerRecord = (username, record) => {
  const all = JSON.parse(localStorage.getItem(SELLER_KEY) || "{}")
  all[username] = record
  localStorage.setItem(SELLER_KEY, JSON.stringify(all))
}

// Returns { isSeller, source, trialEndsAt, daysLeft }
export const getSellerStatus = (currentUser) => {
  const username = currentUser?.username
  if (!username) return { isSeller: false, source: null, trialEndsAt: null, daysLeft: 0 }

  if (ADMIN_GRANTED_USERNAMES.includes(username)) {
    return { isSeller: true, source: "admin_free", trialEndsAt: null, daysLeft: null }
  }

  const record = readSellerRecord(username)
  if (!record) return { isSeller: false, source: null, trialEndsAt: null, daysLeft: 0 }

  if (record.source === "admin_free" || record.source === "paid") {
    return { isSeller: true, source: record.source, trialEndsAt: null, daysLeft: null }
  }

  // Trial — check expiry
  const trialEndsAt = new Date(record.trialEndsAt)
  const msLeft = trialEndsAt - new Date()
  const daysLeft = Math.max(0, Math.ceil(msLeft / (1000 * 60 * 60 * 24)))

  return {
    isSeller: msLeft > 0,
    source: "trial",
    trialEndsAt: record.trialEndsAt,
    daysLeft,
    expired: msLeft <= 0,
  }
}

export const startSellerTrial = async (currentUser) => {
  await delay(300)
  const trialEndsAt = new Date(Date.now() + TRIAL_DAYS * 24 * 60 * 60 * 1000).toISOString()
  writeSellerRecord(currentUser.username, { source: "trial", trialEndsAt })
  return getSellerStatus(currentUser)
}