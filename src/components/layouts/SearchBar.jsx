import React from 'react'
import { Search, X } from 'lucide-react'

function SearchBar({ value, onChange }) {
  return (
    <div className="flex items-center bg-white/10 rounded-xl px-4 py-3 mb-4 gap-3">
      <Search size={16} className="text-gray-400 flex-shrink-0" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search schools, students, videos..."
        className="flex-1 bg-transparent outline-none text-sm text-white placeholder-gray-500"
      />
      {/* Clear button — only shows when there's text */}
      {value && (
        <button onClick={() => onChange("")}>
          <X size={16} className="text-gray-400" />
        </button>
      )}
    </div>
  )
}

export default SearchBar