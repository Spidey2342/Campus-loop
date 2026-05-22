import React, { useState, useEffect, useRef } from 'react'
import { Search, GraduationCap, X, ChevronDown } from 'lucide-react'

// Comprehensive list of Ghanaian universities + major global ones
// This works offline, no API needed, instant results
const SCHOOLS = [
  // Ghana — public universities
  "University of Ghana",
  "Kwame Nkrumah University of Science and Technology",
  "University of Cape Coast",
  "University for Development Studies",
  "University of Education, Winneba",
  "University of Mines and Technology",
  "University of Health and Allied Sciences",
  "C.K. Tedam University of Technology and Applied Sciences",
  "SD Dombo University of Business and Integrated Development Studies",
  "Akenten Appiah-Menka University of Skills Training and Entrepreneurial Development",
  // Ghana — technical universities
  "Ho Technical University",
  "Accra Technical University",
  "Cape Coast Technical University",
  "Kumasi Technical University",
  "Sunyani Technical University",
  "Takoradi Technical University",
  "Tamale Technical University",
  "Koforidua Technical University",
  "Bolgatanga Technical University",
  "Wa Technical University",
  // Ghana — private universities
  "Ashesi University",
  "Central University",
  "Ghana Christian University College",
  "Regent University College of Science and Technology",
  "Valley View University",
  "Wisconsin International University College",
  "Academic City University College",
  "BlueCrest University College",
  "Zenith University College",
  "Lancaster University Ghana",
  "Ghana Institute of Management and Public Administration",
  "Institute of Professional Studies",
  "Methodist University",
  "Presbyterian University College Ghana",
  "Pentecost University",
  "Catholique University College of Ghana",
  "Ghana Communication Technology University",
  // Nigeria
  "University of Lagos",
  "University of Ibadan",
  "Obafemi Awolowo University",
  "Ahmadu Bello University",
  "University of Nigeria, Nsukka",
  "Lagos State University",
  "Covenant University",
  // Kenya
  "University of Nairobi",
  "Kenyatta University",
  "Strathmore University",
  // South Africa
  "University of Cape Town",
  "University of Pretoria",
  "Stellenbosch University",
  "University of the Witwatersrand",
  // UK
  "University of Oxford",
  "University of Cambridge",
  "Imperial College London",
  "University College London",
  "University of Edinburgh",
  // US
  "Massachusetts Institute of Technology",
  "Harvard University",
  "Stanford University",
  "Yale University",
  "Columbia University",
]

function SchoolPicker({ value, onChange, placeholder = "Search your university..." }) {
  const [query, setQuery]       = useState(value || '')
  const [results, setResults]   = useState([])
  const [open, setOpen]         = useState(false)
  const [selected, setSelected] = useState(value || '')

  const debounceRef  = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    if (value && value !== selected) {
      setSelected(value)
      setQuery(value)
    }
  }, [value])

  const search = (q) => {
    if (!q || q.length < 2) {
      setResults([])
      setOpen(false)
      return
    }
    const lower = q.toLowerCase()
    const matches = SCHOOLS.filter(s => s.toLowerCase().includes(lower))
      .sort((a, b) => {
        const aStart = a.toLowerCase().startsWith(lower)
        const bStart = b.toLowerCase().startsWith(lower)
        if (aStart && !bStart) return -1
        if (!aStart && bStart) return 1
        return a.localeCompare(b)
      })
      .slice(0, 8)
    setResults(matches)
    setOpen(true)
  }

  const handleInput = (e) => {
    const q = e.target.value
    setQuery(q)
    setSelected('')
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => search(q), 200)
  }

  const handleSelect = (name) => {
    setSelected(name)
    setQuery(name)
    setOpen(false)
    setResults([])
    onChange(name)
  }

  const handleManualEntry = () => {
    if (query.trim()) {
      setSelected(query.trim())
      onChange(query.trim())
    }
    setOpen(false)
  }

  const handleClear = () => {
    setSelected('')
    setQuery('')
    setResults([])
    setOpen(false)
    onChange('')
  }

  return (
    <div ref={containerRef} className="relative w-full">

      {/* Input */}
      <div className={`flex items-center gap-2 w-full p-4 rounded-xl bg-white/10 border transition-all ${
        open ? 'border-teal-500/50' : 'border-transparent'
      }`}>
        <Search size={16} className="text-gray-400 flex-shrink-0" />
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
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-zinc-900 border border-white/10 rounded-xl overflow-hidden z-50 shadow-2xl">

          {results.length > 0 ? (
            <>
              {results.map((name, i) => (
                <button
                  key={i}
                  onClick={() => handleSelect(name)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition text-left border-b border-white/5 last:border-0"
                >
                  <span className="text-lg flex-shrink-0">🎓</span>
                  <p className="text-white text-sm font-medium truncate">{name}</p>
                </button>
              ))}
              {/* Manual entry always at bottom */}
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
            </>
          ) : (
            // No matches — show manual entry only
            <button
              onClick={handleManualEntry}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition text-left"
            >
              <span className="text-lg">✏️</span>
              <div>
                <p className="text-gray-300 text-sm">Use "{query}"</p>
                <p className="text-gray-500 text-xs">Enter your school name manually</p>
              </div>
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default SchoolPicker