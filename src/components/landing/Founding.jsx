import { Crown } from 'lucide-react'
import { APP_URL } from './Header.jsx'

const TOTAL_SPOTS = 100
const JOINED = 84

export default function Founding() {
  const spotsLeft = TOTAL_SPOTS - JOINED
  const pct = Math.round((JOINED / TOTAL_SPOTS) * 100)

  return (
    <section id="founding" className="relative z-10 py-28">
      <div className="max-w-[1180px] mx-auto px-6">
        <div className="rounded-[28px] p-9 sm:p-14 relative overflow-hidden bg-founding border border-yellow-400/25 grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-yellow-400/10 border border-yellow-400/35 text-yellow-400 text-xs font-bold mb-4.5">
              <Crown size={13} /> Founding member system
            </div>
            <h2 className="text-[28px] sm:text-[42px] tracking-[-0.02em] font-extrabold">
              The first 100 students shape what CampusVibe becomes.
            </h2>
            <p className="mt-4 text-gray-400 text-[16.5px] max-w-[560px] leading-relaxed">
              Join early and your name carries founding status on your profile — before
              CampusVibe expands beyond Ghana.
            </p>

            <div className="mt-6">
              <div className="h-2 rounded-full bg-white/[0.08] overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-yellow-300"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="flex justify-between mt-2.5 text-[12.5px] text-gray-400">
                <span>{JOINED} joined</span>
                <span>{TOTAL_SPOTS} spots</span>
              </div>
            </div>
          </div>

          <div className="rounded-[20px] p-7 bg-black/35 border border-white/10 text-center">
            <div className="text-[44px] font-extrabold text-yellow-400">{spotsLeft}</div>
            <div className="text-[13px] text-gray-400 mt-1">founding spots left</div>
            <a
              href={APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 w-full inline-flex justify-center items-center gap-2 px-6 py-[15px] rounded-xl font-bold text-[15.5px] bg-gradient-to-br from-yellow-400 to-yellow-500 text-[#1c1400] shadow-[0_12px_34px_-10px_rgba(250,204,21,0.7)] hover:-translate-y-0.5 transition-transform"
            >
              <Crown size={16} /> Claim your spot
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}