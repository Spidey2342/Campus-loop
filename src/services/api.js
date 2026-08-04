// The base URL of your Python backend
const BASE_URL ="https://campus-backend-moz5.onrender.com"

const authFetch = async (url, options = {}) => {
  const response = await fetch(url, options)

  if (response.status === 401) {
    localStorage.clear()
    window.location.href = "/login"
    return
  }

  // 429 = Too Many Requests
  if (response.status === 429) {
    throw new Error("You're doing that too fast. Please slow down.")
  }

  return response
}

// --- AUTH ---

export const registerUser = async (formData) => {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    // JSON.stringify converts your JS object to a JSON string
    // that Python can read
    body: JSON.stringify(formData),
  });

  // If the server returns an error (400, 422, etc)
  // we extract the error message and throw it
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Registration failed");
  }

  // Returns { access_token, token_type, user }
  return response.json();
};

export const loginUser = async (formData) => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Login failed");
  }

  return response.json();
};

export const getCurrentUser = async (token) => {
  const response = await fetch(`${BASE_URL}/auth/me`, {
    method: "GET",
    headers: {
      // This is how we send the JWT token with every request
      // "Bearer" is the standard prefix for JWT tokens
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Session expired, please log in again");
  }

  return response.json();
};

// --- PROFILE ---

export const getProfile = async (username, token) => {
  const response = await fetch(`${BASE_URL}/users/profile/${username}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to load profile");
  return response.json();
};

export const getUserReels = async (username, token, skip = 0, limit = 21) => {
  const response = await fetch(`${BASE_URL}/users/profile/${username}/reels?skip=${skip}&limit=${limit}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to load reels");
  return response.json();
};

export const editProfile = async (formData, token) => {
  const response = await fetch(`${BASE_URL}/users/profile/edit`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    // Note: no Content-Type header here — browser sets it automatically
    // for FormData (needed for file uploads)
    body: formData,
  });
  if (!response.ok) throw new Error("Failed to update profile");
  return response.json();
};

export const followUser = async (username, token) => {
  const response = await fetch(`${BASE_URL}/users/follow/${username}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to follow user");
  return response.json();
};
// --- REELS ---

export const uploadReel = async (formData, token) => {
  const response = await fetch(`${BASE_URL}/reels/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData, // FormData handles video + text together
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Upload failed");
  }
  return response.json();
};

export const getFeed = async (token, type = "foryou", skip = 0, loop = 0) => {
  const response = await authFetch(
    `${BASE_URL}/reels/feed?type=${type}&skip=${skip}&limit=10&loop=${loop}`,
    { headers: { Authorization: `Bearer ${token}` } }
  )
  if (!response.ok) throw new Error("Failed to load feed")
  return response.json()
}

export const likeReel = async (reelId, token) => {
  const response = await fetch(`${BASE_URL}/reels/${reelId}/like`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to like reel");
  return response.json();
};

export const commentOnReel = async (reelId, text, token) => {
  const response = await fetch(`${BASE_URL}/reels/${reelId}/comment`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  if (!response.ok) throw new Error("Failed to post comment");
  return response.json();
};

export const viewReel = async (reelId, token) => {
  await fetch(`${BASE_URL}/reels/${reelId}/view`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deleteReel = async (reelId, token) => {
  const response = await authFetch(`${BASE_URL}/reels/${reelId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response || !response.ok) throw new Error("Failed to delete reel");
  return response.json();
};

// --- DISCOVER ---

export const searchAll = async (query, token) => {
  const response = await authFetch(
    `${BASE_URL}/discover/search?q=${encodeURIComponent(query)}`,
    { headers: { Authorization: `Bearer ${token}` } }
  )
  if (!response || !response.ok) throw new Error("Search failed")
  return response.json()
}

export const getTopSchools = async (token) => {
  const response = await authFetch(`${BASE_URL}/discover/schools`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!response || !response.ok) throw new Error("Failed to load schools")
  return response.json()
}

export const getTrendingTags = async (token) => {
  const response = await authFetch(`${BASE_URL}/discover/trending`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!response || !response.ok) throw new Error("Failed to load trending")
  return response.json()
}

export const getReelsByCategory = async (category, token) => {
  const response = await authFetch(
    `${BASE_URL}/discover/reels/category/${category}`,
    { headers: { Authorization: `Bearer ${token}` } }
  )
  if (!response || !response.ok) throw new Error("Failed to load category")
  return response.json()
}
export const getSchoolDetail = async (schoolName, token) => {
  const response = await authFetch(
    `${BASE_URL}/discover/school/${encodeURIComponent(schoolName)}`,
    { headers: { Authorization: `Bearer ${token}` } }
  )
  if (!response || !response.ok) throw new Error("Failed to load school")
  return response.json()
}

export const getReelsByHashtag = async (tag, token) => {
  const response = await authFetch(
    `${BASE_URL}/discover/hashtag/${encodeURIComponent(tag)}`,
    { headers: { Authorization: `Bearer ${token}` } }
  )
  if (!response || !response.ok) throw new Error("Failed to load hashtag reels")
  return response.json()
}

// --- NOTIFICATIONS ---

export const getNotifications = async (token) => {
  const response = await authFetch(`${BASE_URL}/notifications/`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!response || !response.ok) throw new Error("Failed to load notifications")
  return response.json()
}


export const markNotificationsRead = async (token) => {
  await authFetch(`${BASE_URL}/notifications/mark-read`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  })
}

export const getUnreadCount = async (token) => {
  try {
    const response = await authFetch(`${BASE_URL}/notifications/unread-count`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!response || !response.ok) return { unread_count: 0 }
    return response.json()
  } catch (err) {
    // Silently return 0 if server is sleeping
    return { unread_count: 0 }
  }
}

// --- MESSAGES ---

export const getConversations = async (token) => {
  const response = await authFetch(`${BASE_URL}/messages/conversations`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!response || !response.ok) throw new Error("Failed to load conversations")
  return response.json()
}

export const startDM = async (username, token) => {
  const response = await authFetch(
    `${BASE_URL}/messages/conversations/dm/${encodeURIComponent(username)}`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }
  )
  if (!response || !response.ok) throw new Error("Failed to start conversation")
  return response.json()
}

export const createGroup = async (name, usernames, token) => {
  const response = await authFetch(
    `${BASE_URL}/messages/conversations/group?name=${encodeURIComponent(name)}&usernames=${encodeURIComponent(usernames)}`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }
  )
  if (!response || !response.ok) throw new Error("Failed to create group")
  return response.json()
}

export const getMessages = async (conversationId, token, skip = 0) => {
  const response = await authFetch(
    `${BASE_URL}/messages/conversations/${conversationId}/messages?skip=${skip}&limit=50`,
    { headers: { Authorization: `Bearer ${token}` } }
  )
  if (!response || !response.ok) throw new Error("Failed to load messages")
  return response.json()
}

export const saveFCMToken = async (fcmToken, token) => {
  await authFetch(`${BASE_URL}/users/fcm-token`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fcm_token: fcmToken }),
  })
}

// --- MODERATION ---

export const reportReel = async ({ reelId, reason, details }, token) => {
  const response = await authFetch(`${BASE_URL}/moderation/report`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ reel_id: reelId, reason, details }),
  })
  if (!response || !response.ok) {
    const err = await response?.json()
    throw new Error(err?.detail || "Report failed")
  }
  return response.json()
}

export const reportUser = async ({ reportedUserId, reason, details }, token) => {
  const response = await authFetch(`${BASE_URL}/moderation/report`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ reported_user_id: reportedUserId, reason, details }),
  })
  if (!response || !response.ok) {
    const err = await response?.json()
    throw new Error(err?.detail || "Report failed")
  }
  return response.json()
}

export const getReports = async (token, status = "pending") => {
  const response = await authFetch(
    `${BASE_URL}/moderation/reports?status=${status}&limit=100`,
    { headers: { Authorization: `Bearer ${token}` } }
  )
  if (!response || !response.ok) throw new Error("Failed to load reports")
  return response.json()
}

export const reviewReport = async (reportId, status, token) => {
  const response = await authFetch(`${BASE_URL}/moderation/reports/${reportId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  })
  if (!response || !response.ok) throw new Error("Review failed")
  return response.json()
}