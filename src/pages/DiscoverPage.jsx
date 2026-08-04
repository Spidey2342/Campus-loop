import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Search, X, ArrowLeft, Users } from "lucide-react"
import BottomNav from "../components/layouts/BottomNav"
import { SchoolCardSkeleton, TrendingSkeleton, UserRowSkeleton } from "../components/layouts/Skeleton"
import {
  getTopSchools, getTrendingTags, searchAll,
  getSchoolDetail, getReelsByHashtag, followUser
} from "../services/api"

const BASE_URL = "https://code-dreams-backend.onrender.com"

function DiscoverPage() {
  const navigate = useNavigate()
  const token = localStorage.getItem("token")
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}")

  // Main state
  const [schools, setSchools] = useState([])
  const [trending, setTrending] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState(null)
  const [searching, setSearching] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  // School detail view
  const [selectedSchool, setSelectedSchool] = useState(null)
  const [schoolDetail, setSchoolDetail] = useState(null)
  const [loadingSchool, setLoadingSchool] = useState(false)

  // Hashtag view
  const [selectedTag, setSelectedTag] = useState(null)
  const [tagReels, setTagReels] = useState([])
  const [loadingTag, setLoadingTag] = useState(false)

  // Follow state
  const [followStates, setFollowStates] = useState({})

  useEffect(() => {
    const load = async () => {
      try {
        const [schoolsData, trendingData] = await Promise.all([
          getTopSchools(token),
          getTrendingTags(token),
        ])
        setSchools(Array.isArray(schoolsData) ? schoolsData : [])
        setTrending(Array.isArray(trendingData) ? trendingData : [])
      } catch (err) {
        console.error(err)
      } finally {
        setInitialLoading(false)
      }
    }
    load()
  }, [])

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults(null)
      return
    }
    const timer = setTimeout(async () => {
      setSearching(true)
      try {
        const results = await searchAll(searchQuery, token)
        setSearchResults(results)
      } catch (err) {
        console.error(err)
      } finally {
        setSearching(false)
      }
    }, 400)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const handleSchoolTap = async (schoolName) => {
    setSelectedSchool(schoolName)
    setLoadingSchool(true)
    try {
      const data = await getSchoolDetail(schoolName, token)
      setSchoolDetail(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingSchool(false)
    }
  }

  const handleHashtagTap = async (tag) => {
    setSelectedTag(tag)
    setLoadingTag(true)
    try {
      const data = await getReelsByHashtag(tag, token)
      setTagReels(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingTag(false)
    }
  }

  const handleFollow = async (e, username) => {
    e.stopPropagation()
    try {
      const data = await followUser(username, token)
      setFollowStates(prev => ({ ...prev, [username]: data.following }))
    } catch (err) {
      console.error(err)
    }
  }

  const getInitials = (name) => {
    if (!name) return "?"
    return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
  }

  const colors = [
    "bg-teal-700", "bg-blue-700", "bg-purple-700",
    "bg-red-700", "bg-orange-700", "bg-green-700"
  ]

  // ── HASHTAG VIEW ──
  if (selectedTag) {
    return (
      <div className="min-h-screen bg-black text-white pb-24">
        <div className="flex items-center gap-3 px-4 py-4 border-b border-white/10">
          <button onClick={() => setSelectedTag(null)}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="font-bold text-lg">{selectedTag}</h2>
            <p className="text-gray-400 text-xs">{tagReels.length} reels</p>
          </div>
        </div>

        {loadingTag ? (
          <div className="divide-y divide-white/5 p-4 space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-white/10 rounded-xl aspect-[9/16]" />
            ))}
          </div>
        ) : tagReels.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <p className="text-3xl">🎬</p>
            <p className="text-gray-400 text-sm">No reels with {selectedTag} yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-1 p-1">
            {tagReels.map((reel) => (
              <div
                key={reel.id}
                onClick={() => navigate(`/reel/${reel.id}`)}
                className="relative cursor-pointer aspect-[9/16]"
              >
                {reel.thumbnail_url ? (
                  <img
                    src={reel.thumbnail_url}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🎬</span>
                  </div>
                )}
                <div className="absolute bottom-1 left-1 text-white text-xs bg-black/50 px-1 rounded">
                  ▶ {reel.views_count?.toLocaleString() || 0}
                </div>
              </div>
            ))}
          </div>
        )}
        <BottomNav />
      </div>
    )
  }

  // ── SCHOOL DETAIL VIEW ──
  if (selectedSchool) {
    return (
      <div className="min-h-screen bg-black text-white pb-24">
        <div className="flex items-center gap-3 px-4 py-4 border-b border-white/10">
          <button onClick={() => { setSelectedSchool(null); setSchoolDetail(null) }}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="font-bold text-lg">{selectedSchool}</h2>
            {schoolDetail && (
              <p className="text-gray-400 text-xs">
                {schoolDetail.members_count} students
              </p>
            )}
          </div>
        </div>

        {loadingSchool ? (
          <div className="px-4 py-4 space-y-4">
            <div className="grid grid-cols-3 gap-1">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse bg-white/10 rounded-xl h-32" />
              ))}
            </div>
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => <UserRowSkeleton key={i} />)}
            </div>
          </div>
        ) : schoolDetail ? (
          <div className="px-4 py-4 space-y-6">

            {/* Reels grid */}
            {schoolDetail.reels.length > 0 && (
              <div>
                <p className="text-sm font-semibold mb-3">
                  Reels from this school
                </p>
                <div className="grid grid-cols-3 gap-1">
                  {schoolDetail.reels.map((reel) => (
                    <div
                      key={reel.id}
                      onClick={() => navigate(`/reel/${reel.id}`)}
                      className="relative cursor-pointer"
                    >
                      {reel.thumbnail_url ? (
                        <img
                          src={reel.thumbnail_url}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-32 bg-gray-800 rounded-lg flex items-center justify-center">
                          <span className="text-xl">🎬</span>
                        </div>
                      )}
                      <div className="absolute bottom-1 left-1 text-white text-xs bg-black/50 px-1 rounded">
                        ▶ {reel.views_count?.toLocaleString() || 0}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Members list */}
            <div>
              <p className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Users size={14} /> Students
              </p>
              <div className="space-y-3">
                {schoolDetail.members.map((member) => {
                  const isOwnAccount = member.id === currentUser.id
                  const isFollowing = followStates[member.username] ?? false

                  return (
                    <div
                      key={member.id}
                      onClick={() => navigate(`/profile/${member.username}`)}
                      className="flex items-center gap-3 p-3 bg-white/10 rounded-xl cursor-pointer hover:bg-white/20 transition-all"
                    >
                      {member.avatar_url ? (
                        <img
                          src={member.avatar_url}
                          className="w-11 h-11 rounded-full object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-teal-900 flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-sm">
                            {getInitials(member.full_name)}
                          </span>
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm">
                          {member.full_name}
                          {member.is_verified && (
                            <span className="ml-1 text-teal-400 text-xs">✓</span>
                          )}
                        </p>
                        <p className="text-gray-400 text-xs">@{member.username}</p>
                      </div>

                      {!isOwnAccount && (
                        <button
                          onClick={(e) => handleFollow(e, member.username)}
                          className={`text-xs px-3 py-1.5 rounded-full font-medium flex-shrink-0 transition-all ${
                            isFollowing
                              ? "border border-white/30 text-white"
                              : "bg-teal-500 text-black"
                          }`}
                        >
                          {isFollowing ? "Following" : "Follow"}
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        ) : null}
        <BottomNav />
      </div>
    )
  }

  // ── MAIN DISCOVER VIEW ──
  return (
    <div className="min-h-screen bg-black text-white px-4 py-4 pb-24">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Discover</h1>
          <p className="text-gray-400 text-sm">Explore campus life everywhere</p>
        </div>
        {currentUser.avatar_url ? (
          <img
            src={currentUser.avatar_url}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-teal-900 flex items-center justify-center">
            <span className="text-white text-sm font-bold">
              {getInitials(currentUser.full_name)}
            </span>
          </div>
        )}
      </div>

      {/* Search bar */}
      <div className="flex items-center bg-white/10 rounded-xl px-4 py-3 mb-4 gap-3">
        <Search size={16} className="text-gray-400 flex-shrink-0" />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search schools, students, videos..."
          className="flex-1 bg-transparent outline-none text-sm text-white placeholder-gray-500"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery("")}>
            <X size={16} className="text-gray-400" />
          </button>
        )}
      </div>

      {/* Search results */}
      {searchQuery ? (
        <div className="space-y-6">
          {searching ? (
            <p className="text-gray-400 text-sm text-center py-8">Searching...</p>
          ) : !searchResults ? null : (
            <>
              {/* Schools from search */}
              {searchResults.schools?.length > 0 && (
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">Schools</p>
                  <div className="space-y-2">
                    {searchResults.schools.map((school, i) => (
                      <div
                        key={school.school_name}
                        onClick={() => handleSchoolTap(school.school_name)}
                        className="flex items-center gap-3 p-3 bg-white/10 rounded-xl cursor-pointer hover:bg-white/20"
                      >
                        <div className={`w-10 h-10 ${colors[i % colors.length]} rounded-xl flex items-center justify-center flex-shrink-0`}>
                          <span className="text-white text-xs font-bold">
                            {getInitials(school.school_name)}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{school.school_name}</p>
                          <p className="text-gray-400 text-xs">{school.members} students</p>
                        </div>
                        <span className="ml-auto text-gray-400 text-xs">View →</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Users from search */}
              {searchResults.users?.length > 0 && (
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">Students</p>
                  <div className="space-y-3">
                    {searchResults.users.map((user) => {
                      const isOwnAccount = user.id === currentUser.id
                      const isFollowing = followStates[user.username] ?? false
                      return (
                        <div
                          key={user.id}
                          onClick={() => navigate(`/profile/${user.username}`)}
                          className="flex items-center gap-3 p-3 bg-white/10 rounded-xl cursor-pointer hover:bg-white/20"
                        >
                          {user.avatar_url ? (
                            <img src={user.avatar_url} className="w-11 h-11 rounded-full object-cover flex-shrink-0" />
                          ) : (
                            <div className="w-11 h-11 rounded-full bg-teal-900 flex items-center justify-center flex-shrink-0">
                              <span className="text-white font-bold text-sm">{getInitials(user.full_name)}</span>
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm">
                              {user.full_name}
                              {user.is_verified && <span className="ml-1 text-teal-400 text-xs">✓</span>}
                            </p>
                            <p className="text-gray-400 text-xs">@{user.username}</p>
                            {user.school_name && <p className="text-gray-500 text-xs truncate">{user.school_name}</p>}
                          </div>
                          {!isOwnAccount && (
                            <button
                              onClick={(e) => handleFollow(e, user.username)}
                              className={`text-xs px-3 py-1.5 rounded-full font-medium flex-shrink-0 transition-all ${
                                isFollowing ? "border border-white/30 text-white" : "bg-teal-500 text-black"
                              }`}
                            >
                              {isFollowing ? "Following" : "Follow"}
                            </button>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Reels from search */}
              {searchResults.reels?.length > 0 && (
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">Reels</p>
                  <div className="grid grid-cols-3 gap-1">
                    {searchResults.reels.map((reel) => (
                      <div
                        key={reel.id}
                        onClick={() => navigate(`/reel/${reel.id}`)}
                        className="relative cursor-pointer"
                      >
                        {reel.thumbnail_url ? (
                          <img src={reel.thumbnail_url} className="w-full h-36 object-cover rounded-lg" />
                        ) : (
                          <div className="w-full h-36 bg-gray-800 rounded-lg flex items-center justify-center">
                            <span className="text-2xl">🎬</span>
                          </div>
                        )}
                        <div className="absolute bottom-1 left-1 text-white text-xs bg-black/50 px-1 rounded">
                          ▶ {reel.views_count?.toLocaleString() || 0}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* No results */}
              {!searchResults.users?.length && !searchResults.reels?.length && !searchResults.schools?.length && (
                <div className="flex flex-col items-center py-16 gap-3">
                  <p className="text-3xl">🔍</p>
                  <p className="text-gray-400 text-sm">No results for "{searchQuery}"</p>
                  <p className="text-gray-500 text-xs">Try a different spelling or school name</p>
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        <>
          {/* Top Schools */}
          {initialLoading ? (
            <div className="mb-6">
              <div className="flex justify-between mb-3">
                <div className="animate-pulse bg-white/10 rounded w-24 h-5" />
              </div>
              <div className="flex gap-3 overflow-x-auto pb-1">
                {Array.from({ length: 5 }).map((_, i) => <SchoolCardSkeleton key={i} />)}
              </div>
            </div>
          ) : schools.length > 0 && (
            <div className="mb-6">
              <div className="flex justify-between mb-3">
                <h2 className="font-semibold">Top Schools</h2>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-1">
                {schools.map((school, i) => (
                  <div
                    key={school.school_name}
                    onClick={() => handleSchoolTap(school.school_name)}
                    className="min-w-[110px] bg-white/10 rounded-xl p-3 text-center cursor-pointer hover:bg-white/20 transition-all flex-shrink-0"
                  >
                    <div className={`w-12 h-12 ${colors[i % colors.length]} mx-auto rounded-xl mb-2 flex items-center justify-center`}>
                      <span className="text-white text-sm font-bold">
                        {getInitials(school.school_name)}
                      </span>
                    </div>
                    <p className="text-xs font-medium truncate">{school.school_name}</p>
                    <p className="text-xs text-gray-400">{school.members} students</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trending hashtags */}
          {initialLoading ? (
            <div className="space-y-3">
              <div className="animate-pulse bg-white/10 rounded w-20 h-5 mb-3" />
              {Array.from({ length: 4 }).map((_, i) => <TrendingSkeleton key={i} />)}
            </div>
          ) : trending.length > 0 && (
            <div>
              <div className="flex justify-between mb-3">
                <h2 className="font-semibold">Trending</h2>
              </div>
              <div className="space-y-3">
                {trending.map((item, i) => (
                  <div
                    key={item.tag}
                    onClick={() => handleHashtagTap(item.tag)}
                    className="bg-white/10 rounded-xl p-4 flex justify-between items-center cursor-pointer hover:bg-white/20 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-gray-500 text-sm font-bold w-5">{i + 1}</span>
                      <div>
                        <p className="font-semibold">{item.tag}</p>
                        <p className="text-sm text-gray-400">
                          {item.count} {item.count === 1 ? "reel" : "reels"}
                        </p>
                      </div>
                    </div>
                    <button className="bg-teal-500/20 text-teal-400 px-3 py-1 rounded-full text-xs">
                      View
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {schools.length === 0 && trending.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <p className="text-3xl">🔍</p>
              <p className="text-gray-400 text-sm">Search for schools or students</p>
            </div>
          )}
        </>
      )}

      <BottomNav />
    </div>
  )
}

export default DiscoverPage