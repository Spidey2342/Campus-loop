import { Play } from 'lucide-react'


export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10 pt-12 pb-8">
      <div className="max-w-[1180px] mx-auto px-6">
        <div className="flex justify-between items-center flex-wrap gap-5">
          <div className="flex items-center gap-2.5 font-extrabold text-[17px]">
            <span className="w-7 h-7 rounded-lg flex items-center justify-center bg-gradient-to-br from-teal-500 to-teal-700">
              <Play size={13} className="text-[#001a17]" fill="currentColor" />
            </span>
            CampusVibe
          </div>
          <div className="flex gap-6.5 text-[13.5px] text-gray-400">
            <a href="#feed" className="hover:text-white transition-colors">The Feed</a>
            <a href="#marketplace" className="hover:text-white transition-colors">Marketplace</a>
            <a href="#founding" className="hover:text-white transition-colors">Founding Members</a>
            <a href="https://campus-loop-peach.vercel.app/signup" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Open app</a>
          </div>
        </div>
        <p className="text-[12.5px] text-gray-500 mt-6">
          CampusVibe — where Ghanaian students come to be seen, connect, and do business. Built by JevisLab.
        </p>
      </div>
    </footer>
  )
}