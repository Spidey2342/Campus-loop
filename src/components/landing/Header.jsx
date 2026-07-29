import { Play } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Header() {
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-black/55 border-b border-white/10">
      <div className="max-w-[1180px] mx-auto px-4 sm:px-6">
        <nav className="flex items-center justify-between h-[60px] sm:h-[72px]">
          {/* Logo */}
          <div className="flex items-center gap-2 font-extrabold text-base sm:text-xl tracking-tight flex-shrink-0">
            <span className="w-[30px] h-[30px] sm:w-[34px] sm:h-[34px] rounded-[8px] flex items-center justify-center bg-gradient-to-br from-teal-500 to-teal-700 shadow-[0_0_24px_rgba(20,184,166,0.5)]">
              <Play size={14} className="text-[#001a17]" fill="currentColor" />
            </span>
            CampusVibe
          </div>

          {/* Nav links — hidden on mobile */}
          <div className="hidden md:flex gap-8 text-[14.5px] text-gray-400">
            <a href="#feed" className="hover:text-white transition-colors">The Feed</a>
            <a href="#founding" className="hover:text-white transition-colors">Founding Members</a>
          </div>

          {/* CTA buttons */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <button
              onClick={() => navigate('/login')}
              className="text-xs sm:text-sm text-gray-300 hover:text-white transition-colors px-2 sm:px-4 py-2"
            >
              Log in
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="px-3 sm:px-5 py-2 sm:py-2.5 rounded-full bg-teal-500 text-[#001a17] font-bold text-xs sm:text-sm shadow-[0_0_0_1px_rgba(20,184,166,0.4),0_8px_24px_-8px_rgba(20,184,166,0.7)] hover:-translate-y-px transition-all whitespace-nowrap"
            >
              Join now
            </button>
          </div>
        </nav>
      </div>
    </header>
  )
}