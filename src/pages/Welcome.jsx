import React from 'react'
import { useNavigate } from "react-router-dom";
import { ArrowRight, Video, House, Users } from 'lucide-react'
import image3 from '../assets/sweet.png'

function Welcome() {
    const navigate = useNavigate();
  return (
    <div className='min-h-screen bg-gradient-to-br from-black via-gray-900 to-teal-900 text-white flex flex-col items-center justify-between px-6 py-10'
    >
{/* Logo */}
<div
className='mt-4'>
    <div className='bg-white/20 backdrop-blur-md px-5 py-2 rounded-full text-sm flex items-center gap-2'>
     <Video /> <span className="font-medium">CampusReel</span>
   
    </div>
</div>

{/* hero image */}

<div className='flex-1 flex items-center justify-center'>
<img src={image3} 
alt="Students"
className='w-[280px] md:w-[350px] object-contain' />
</div>

  <div className="text-center space-y-4 max-w-md">
        <h1 className="text-3xl md:text-4xl font-bold leading-tight">
          See what students are really posting
        </h1>

        <p className="text-gray-300 text-sm md:text-base">
          Join your campus community. No filters, just real student life.
        </p>
 {/* Tags */}
        <div className="flex justify-center gap-3 mt-3">
          <span className="bg-white/10 px-4 py-1 rounded-full text-xs flex item-center gap-1">
        <House size={18} /> Your Campus
          </span>
          <span className="bg-white/10 px-4 py-1 rounded-full text-xs flex items-center gap-1">
           <Users size={13} /> Real Friends
          </span>
        </div>
     </div>

      {/* CTA */}
      <div className="w-full max-w-md mt-6">
        <button
        onClick={() => navigate("/signup")}
         className="w-full bg-teal-600 hover:bg-teal-500 transition rounded-full py-4 text-lg font-semibold flex items-center justify-center gap-2 hover:scale-105 active:scale-95">
          Get Started <ArrowRight size={18} />
        </button>

        <p className="text-center text-sm text-gray-400 mt-4">
          Already have an account?{" "}
          <span
          onClick={() => navigate("/login")}
          className="text-teal-400 cursor-pointer">Log In</span>
        </p>
      </div>


    </div>
  )
}

export default Welcome