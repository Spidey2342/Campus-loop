import React, { useState, useEffect, useRef } from 'react'
import { Search, GraduationCap, X, ChevronDown } from 'lucide-react'

/**
 * SchoolPicker — searchable school dropdown using Hipolabs University API
 * Covers universities from every country globally, completely free, no API key.
 *
 * Usage:
 *   <SchoolPicker
 *     value={schoolName}
 *     onChange={(name) => setSchoolName(name)}
 *     placeholder="Search your university..."
 *   />
 */
function SchoolPicker({ value, onChange, placeholder = "Search your university..." }) {
  const [query, setQuery]         = useState(value || '')
  const [results, setResults]     = useState([])
  const [loading, setLoading]     = useState(false)
  const [open, setOpen]           = useState(false)
  const [selected, setSelected]   = useState(value || '')
  const [manualMode, setManualMode] = useState(false)

  const debounceRef = useRef(null)
  const containerRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Sync external value changes
  useEffect(() => {
    if (value && value !== selected) {
      setSelected(value)
      setQuery(value)
    }
  }, [value])

  const search = async (q) => {
    if (!q || q.length < 2) {
      setResults([])
      return
    }

    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(
        `https://campus-backend-moz5.onrender.com/discover/universities?q=${encodeURIComponent(q)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      const data = await res.json()
      const sorted = Array.isArray(data) ? data.sort((a, b) => {
        const aExact = a.name.toLowerCase().startsWith(q.toLowerCase())
        const bExact = b.name.toLowerCase().startsWith(q.toLowerCase())
        if (aExact && !bExact) return -1
        if (!aExact && bExact) return 1
        return a.name.localeCompare(b.name)
      }) : []

      setResults(sorted)
      setOpen(sorted.length > 0)
    } catch (err) {
      console.error('School search failed:', err)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleInput = (e) => {
    const q = e.target.value
    setQuery(q)
    setSelected('')  // clear selection when typing

    // Debounce — wait 350ms after typing stops
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => search(q), 350)
  }

  const handleSelect = (school) => {
    setSelected(school.name)
    setQuery(school.name)
    setOpen(false)
    setResults([])
    onChange(school.name)
  }

  const handleClear = () => {
    setSelected('')
    setQuery('')
    setResults([])
    setOpen(false)
    onChange('')
  }

  const handleManualEntry = () => {
    setManualMode(true)
    setOpen(false)
    // Keep whatever they typed and use it as-is
    if (query.trim()) {
      setSelected(query.trim())
      onChange(query.trim())
    }
  }

  const getFlagEmoji = (countryCode) => {
    if (!countryCode) return '🎓'
    try {
      return countryCode
        .toUpperCase()
        .split('')
        .map(c => String.fromCodePoint(127397 + c.charCodeAt(0)))
        .join('')
    } catch {
      return '🎓'
    }
  }

  return (
    <div ref={containerRef} className="relative w-full">

      {/* Input */}
      <div className={`flex items-center gap-2 w-full p-4 rounded-xl bg-white/10 border transition-all ${
        open ? 'border-teal-500/50' : 'border-transparent'
      }`}>
        {loading ? (
          <div className="w-4 h-4 border-2 border-teal-400 border-t-transparent rounded-full animate-spin flex-shrink-0" />
        ) : (
          <Search size={16} className="text-gray-400 flex-shrink-0" />
        )}

        <input
          type="text"
          value={query}
          onChange={handleInput}
          onFocus={() => { if (results.length > 0) setOpen(true) }}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-white placeholder-gray-500 text-sm"
        />

        {query ? (
          <button onClick={handleClear} className="flex-shrink-0">
            <X size={14} className="text-gray-400" />
          </button>
        ) : (
          <ChevronDown size={14} className="text-gray-500 flex-shrink-0" />
        )}
      </div>

      {/* Selected badge */}
      {selected && (
        <div className="flex items-center gap-2 mt-2 px-1">
          <GraduationCap size={14} className="text-teal-400 flex-shrink-0" />
          <p className="text-teal-400 text-xs font-medium truncate">{selected}</p>
          <span className="text-xs text-gray-600 flex-shrink-0">✓ selected</span>
        </div>
      )}

      {/* Dropdown */}
      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-zinc-900 border border-white/10 rounded-xl overflow-hidden z-50 shadow-2xl">

          {results.map((school, i) => (
            <button
              key={i}
              onClick={() => handleSelect(school)}
              className="w-full flex items-start gap-3 px-4 py-3 hover:bg-white/10 transition text-left border-b border-white/5 last:border-0"
            >
              <span className="text-lg flex-shrink-0 mt-0.5">
                {getFlagEmoji(school.alpha_two_code)}
              </span>
              <div className="min-w-0">
                <p className="text-white text-sm font-medium leading-tight truncate">
                  {school.name}
                </p>
                <p className="text-gray-500 text-xs mt-0.5">
                  {school.country}
                  {school.domains?.[0] && ` · ${school.domains[0]}`}
                </p>
              </div>
            </button>
          ))}

          {/* Not listed option */}
          <button
            onClick={handleManualEntry}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition text-left bg-white/5"
          >
            <span className="text-lg">✏️</span>
            <div>
              <p className="text-gray-300 text-sm">My school isn't listed</p>
              <p className="text-gray-500 text-xs">Use "{query}" as entered</p>
            </div>
          </button>
        </div>
      )}

      {/* No results state */}
      {open && results.length === 0 && query.length >= 2 && !loading && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-zinc-900 border border-white/10 rounded-xl overflow-hidden z-50 shadow-2xl">
          <div className="px-4 py-3 border-b border-white/5">
            <p className="text-gray-400 text-sm">No universities found for "{query}"</p>
            <p className="text-gray-600 text-xs mt-0.5">Try a shorter name or different spelling</p>
          </div>
          <button
            onClick={handleManualEntry}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition text-left"
          >
            <span className="text-lg">✏️</span>
            <div>
              <p className="text-gray-300 text-sm">Use "{query}" anyway</p>
              <p className="text-gray-500 text-xs">Enter your school name manually</p>
            </div>
          </button>
        </div>
      )}
    </div>
  )
}

export default SchoolPicker