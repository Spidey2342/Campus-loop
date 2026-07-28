import { School, Eye, ShoppingBag, MapPin } from 'lucide-react'

const pillars = [
  {
    icon: <School size={22} />,
    title: 'Campus-first algorithm',
    text: 'A school-based feed means your content reaches your campus before it reaches the world.',
  },
  {
    icon: <Eye size={22} />,
    title: 'Actually discoverable',
    text: "Ghanaian students aren't buried under global creators here — this feed was built for you.",
  },
  {
    icon: <ShoppingBag size={22} />,
    title: 'Marketplace built in',
    text: "Sell directly to your campus community without leaving the app you're already posting on.",
  },
  {
    icon: <MapPin size={22} />,
    title: 'Local, always',
    text: 'HTU students see HTU content first. Your school is the default, not an afterthought.',
  },
]

export default function Pillars() {
  return (
    <section className="relative z-10 py-28">
      <div className="max-w-[1180px] mx-auto px-6">
        <p className="text-[12.5px] font-bold tracking-[.14em] uppercase text-teal-300 mb-3.5">
          Why not just use TikTok
        </p>
        <h2 className="text-[28px] sm:text-[42px] tracking-[-0.02em] font-extrabold max-w-[640px]">
          Built for African campuses, not buried under them.
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-14">
          {pillars.map((p) => (
            <div key={p.title} className="p-6 rounded-2xl bg-white/[0.06] border border-white/10">
              <div className="text-teal-300 mb-4">{p.icon}</div>
              <h3 className="text-base font-bold mb-2">{p.title}</h3>
              <p className="text-[13.5px] text-gray-400 leading-relaxed">{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
