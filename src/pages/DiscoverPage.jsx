import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import DiscoverHeader from "../components/layouts/DiscoverHeader"
import SearchBar from "../components/layouts/SearchBar"
import CategoryTabs from "../components/layouts/CategoryTabs"
import TopSchools from "../components/layouts/TopSchools"
import TrendingChallenges from "../components/layouts/TrendingChallenges"
import SearchResults from "../components/layouts/SearchResults"
import { getTopSchools, getTrendingTags, searchAll } from "../services/api"
import BottomNav from "../components/layouts/BottomNav"

function DiscoverPage() {
  const [schools, setSchools] = useState([])
  const [trending, setTrending] = useState([])
  const [activeCategory, setActiveCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState(null)
  const [searching, setSearching] = useState(false)
  const token = localStorage.getItem("token")
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}")

  useEffect(() => {
    const load = async () => {
      try {
        const [schoolsData, trendingData] = await Promise.all([
          getTopSchools(token),
          getTrendingTags(token),
        ])
        setSchools(schoolsData)
        setTrending(trendingData)
      } catch (err) {
        console.error(err)
      }
    }
    load()
  }, [])

  // Search with debounce — waits 500ms after user stops typing
  // This prevents hitting the server on every single keystroke
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
    }, 500) // wait 500ms

    // Cleanup — cancel the timer if user types again before 500ms
    return () => clearTimeout(timer)
  }, [searchQuery])

  return (
    <div className="min-h-screen bg-black text-white px-4 py-4 pb-24">
      <DiscoverHeader user={currentUser} />

      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
      />

      {/* Show search results when searching */}
      {searchQuery ? (
        <SearchResults
          results={searchResults}
          loading={searching}
          query={searchQuery}
        />
      ) : (
        <>
          <CategoryTabs
            active={activeCategory}
            onChange={setActiveCategory}
          />
          <TopSchools schools={schools} />
          <TrendingChallenges trending={trending} />
        </>
      )}

      <BottomNav />
    </div>
  )
}

export default DiscoverPage