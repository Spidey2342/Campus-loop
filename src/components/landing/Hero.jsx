import {
  Rocket, PlayCircle, GraduationCap, ShoppingBag, MapPin,
  Heart, MessageCircle, Share2, Home, Search, PlusSquare, User,
} from 'lucide-react'
import { APP_URL } from './Header.jsx'

const stats = [
  { value: '84+', label: 'students already on CampusVibe' },
  { value: '100', label: 'founding member spots' },
  { value: '6+', label: 'Ghanaian universities and counting' },
]

export default function Hero() {
  return (
    <section className="relative z-10 pt-16 pb-10">
      <div className="max-w-[1180px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-14 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/10 text-[12.5px] text-gray-400 tracking-wide mb-6">
            <span className="w-[7px] h-[7px] rounded-full bg-teal-500 shadow-[0_0_10px_#14b8a6] animate-pulseDot" />
            Live at HTU, KNUST, Legon, UCC &amp; more
          </div>

          <h1 className="text-[38px] sm:text-[48px] lg:text-[64px] leading-[1.04] tracking-[-0.03em] font-extrabold">
            Be seen on campus.<br />
            Do business <span className="text-teal-300">on campus.</span>
          </h1>

          <p className="mt-5 text-lg leading-relaxed text-gray-400 max-w-[520px]">
            CampusVibe is the video app built for African university students — post, get
            discovered by your own school, and soon, buy and sell directly inside your
            campus community.
          </p>

          <div className="flex items-center gap-4 mt-8 flex-wrap">
            <a
              href={APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-[15px] rounded-xl font-bold text-[15.5px] bg-gradient-to-br from-teal-500 to-teal-600 text-[#001a17] shadow-[0_12px_34px_-10px_rgba(20,184,166,0.8)] hover:-translate-y-0.5 transition-transform"
            >
              <Rocket size={17} /> Join CampusVibe
            </a>
            <a
              href="#feed"
              className="inline-flex items-center gap-2 px-5 py-[15px] rounded-xl font-semibold text-[15.5px] border border-white/10 hover:border-white/30 hover:bg-white/[0.06] transition-colors"
            >
              <PlayCircle size={17} /> See how it works
            </a>
          </div>

          <div className="flex gap-8 mt-11 flex-wrap">
            {stats.map((s) => (
              <div key={s.label}>
                <b className="block text-2xl font-extrabold">{s.value}</b>
                <span className="text-[13px] text-gray-500">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <PhoneStage />
      </div>
    </section>
  )
}

function PhoneStage() {
  return (
    <div className="relative h-[420px] sm:h-[560px] flex items-center justify-center [perspective:1400px]">
      <FloatBadge
        className="top-[22px] left-[-6px] animate-floatY"
        icon={<GraduationCap size={14} />}
        label="HTU sees HTU first"
      />
      <FloatBadge
        className="bottom-16 right-[-10px] animate-floatYSlow"
        icon={<ShoppingBag size={14} />}
        label="Sell to your campus"
        gold
      />

      {/* back phone */}
      <div className="absolute w-[220px] sm:w-[250px] h-[440px] sm:h-[500px] rounded-[34px] bg-gradient-to-br from-[#0b1210] to-black border border-white/10 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] overflow-hidden [transform:translateX(-40px)_translateY(20px)_rotate(-9deg)_scale(.92)] opacity-55 saturate-[.8]">
        <div className="absolute inset-0 bg-phone-video" />
      </div>

      {/* front phone */}
      <div className="absolute z-10 w-[220px] sm:w-[250px] h-[440px] sm:h-[500px] rounded-[34px] bg-gradient-to-br from-[#0b1210] to-black border border-teal-500/35 shadow-[0_30px_90px_-18px_rgba(20,184,166,0.35),0_30px_80px_-20px_rgba(0,0,0,0.85)] overflow-hidden [transform:translateX(26px)_translateY(-8px)_rotate(6deg)]">
        <div className="absolute inset-0 bg-phone-video" />

        <div className="absolute top-4 left-4 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[10.5px] font-bold bg-black/50 border border-white/15">
          <MapPin size={11} className="text-teal-300" /> Legon Feed
        </div>

        <p className="absolute bottom-[66px] left-4 right-[60px] text-[12.5px] leading-snug text-gray-200">
          Freshers week hits different at Legon <b className="text-teal-300">#CampusVibe</b>
        </p>

        <div className="absolute right-3 bottom-[60px] flex flex-col gap-4 items-center">
          <ActionStat icon={<Heart size={19} />} value="2.4k" />
          <ActionStat icon={<MessageCircle size={19} />} value="318" />
          <ActionStat icon={<Share2 size={19} />} value="96" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-11 bg-black/55 border-t border-white/[0.08] flex items-center justify-around">
          <Home size={16} className="text-teal-300" />
          <Search size={16} className="text-gray-500" />
          <PlusSquare size={16} className="text-gray-500" />
          <ShoppingBag size={16} className="text-gray-500" />
          <User size={16} className="text-gray-500" />
        </div>
      </div>
    </div>
  )
}

function FloatBadge({ className, icon, label, gold }) {
  return (
    <div
      className={`absolute z-20 flex items-center gap-2 px-3.5 py-2.5 rounded-2xl backdrop-blur-sm bg-gray-900/85 border text-[12.5px] font-bold shadow-[0_12px_30px_-10px_rgba(0,0,0,0.7)] ${
        gold ? 'border-yellow-400/40 text-yellow-400' : 'border-white/10 text-white'
      } ${className}`}
    >
      {icon} {label}
    </div>
  )
}

function ActionStat({ icon, value }) {
  return (
    <div className="flex flex-col items-center gap-0.5 text-[10px] text-gray-200">
      {icon}
      {value}
    </div>
  )
}