import React from 'react'
import { Send } from 'lucide-react'

function SubmitButton() {
  return (
    <button className="w-full bg-teal-500 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 text-black">
      <Send size={18} />
      Post to CampusReel
    </button>
  )
}

export default SubmitButton