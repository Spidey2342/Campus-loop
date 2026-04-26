import React from 'react'
import SubmitButton from '../components/layouts/SubmitButton'
import CaptionBox from '../components/layouts/CaptionBox'
import VideoPreview from '../components/layouts/VideoPreview'
import TopView from '../components/layouts/TopView'
import Audience from '../components/layouts/Audience'


function UploadPage() {
  return (
    <div  className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-teal-900 text-white px-4 py-4">
        <TopView/>
        <VideoPreview/>
        <CaptionBox/>
        <Audience/>
           <SubmitButton/> 
        
        </div>
  )
}

export default UploadPage