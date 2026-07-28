const SCHOOLS = ['HTU', 'KNUST', 'LEGON', 'UCC', 'UMAT', 'UEW', 'ASHESI', 'GIMPA', 'UPSA', 'UDS']

export default function Ticker() {
  const row = [...SCHOOLS, ...SCHOOLS]

  return (
    <div className="relative z-10 border-y border-white/10 bg-gray-900 overflow-hidden py-4">
      <div className="flex w-max gap-10 animate-scrollX">
        {row.map((s, i) => (
          <span key={i} className="text-[13.5px] tracking-[.14em] font-bold text-gray-500 whitespace-nowrap">
            <em className="text-teal-300 not-italic">{s}</em> · CAMPUS LIVE
          </span>
        ))}
      </div>
    </div>
  )
}