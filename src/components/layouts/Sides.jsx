import {
  Video, School, Users, Hash, MessageSquare,
  Store, Search, MessageCircle, Handshake,
} from 'lucide-react'

const feedFeatures = [
  { icon: <Video size={18} />, text: 'Short video and photo feed, TikTok-style' },
  { icon: <School size={18} />, text: 'School-based feed — see your campus first' },
  { icon: <Users size={18} />, text: 'Follow, like, comment, share, and DM' },
  { icon: <Hash size={18} />, text: 'Hashtag challenges and trending content' },
  { icon: <MessageSquare size={18} />, text: 'Real-time messaging with your campus' },
]

const marketFeatures = [
  { icon: <Store size={18} />, text: 'Student entrepreneurs list products & services' },
  { icon: <Search size={18} />, text: 'Buyers find them by school, category, or the feed' },
  { icon: <MessageCircle size={18} />, text: 'Orders go through WhatsApp — how Ghana already buys' },
  { icon: <Handshake size={18} />, text: 'No middleman — student to student, directly' },
]

export default function Sides() {
  return (
    <section id="feed" className="relative z-10 py-28">
      <div className="max-w-[1180px] mx-auto px-6">
        <p className="text-[12.5px] font-bold tracking-[.14em] uppercase text-teal-300 mb-3.5">
          Two sides, one app
        </p>
        <h2 className="text-[28px] sm:text-[42px] tracking-[-0.02em] font-extrabold max-w-[640px]">
          Where students post, and where students sell.
        </h2>
        <p className="mt-4 text-gray-400 text-[16.5px] max-w-[560px] leading-relaxed">
          CampusVibe grows with two kinds of students on it — the ones creating campus life,
          and the ones building a hustle around it.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-14">
          <SideCard
            title="The Feed"
            status="LIVE NOW"
            statusClass="bg-teal-500/15 text-teal-300 border-teal-500/35"
            glow="radial-gradient(260px_200px_at_90%_0%,rgba(20,184,166,0.14),transparent_70%)"
            features={feedFeatures}
            iconClass="text-teal-300"
          />
          <SideCard
            id="marketplace"
            title="The Marketplace"
            status="COMING SOON"
            statusClass="bg-yellow-400/10 text-yellow-400 border-yellow-400/30"
            glow="radial-gradient(260px_200px_at_90%_0%,rgba(250,204,21,0.10),transparent_70%)"
            features={marketFeatures}
            iconClass="text-yellow-400"
          />
        </div>
      </div>
    </section>
  )
}

function SideCard({ id, title, status, statusClass, glow, features, iconClass }) {
  return (
    <div
      id={id}
      className="relative overflow-hidden rounded-[22px] p-8 border border-white/10 bg-gradient-to-br from-white/[0.05] to-white/[0.015]"
    >
      <div className="absolute inset-0 opacity-60" style={{ background: glow }} />
      <div className="relative flex items-center justify-between mb-5">
        <span className="text-[22px] font-extrabold">{title}</span>
        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full tracking-wide border ${statusClass}`}>
          {status}
        </span>
      </div>
      <ul className="relative flex flex-col gap-3.5">
        {features.map((f, i) => (
          <li key={i} className="flex gap-3 items-start text-gray-300 text-[14.5px] leading-relaxed">
            <span className={`mt-0.5 flex-shrink-0 ${iconClass}`}>{f.icon}</span>
            {f.text}
          </li>
        ))}
      </ul>
    </div>
  )
}