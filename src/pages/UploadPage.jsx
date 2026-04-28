import React from 'react'
import { useState } from 'react'
import SubmitButton from '../components/layouts/SubmitButton'
import CaptionBox from '../components/layouts/CaptionBox'
import VideoPreview from '../components/layouts/VideoPreview'
import TopView from '../components/layouts/TopView'
import Audience from '../components/layouts/Audience'


function UploadPage() {
const [videoFile, setVideoFile] = useState(null);

const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) setVideoFile(file)
};

  return (
    <div  className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-teal-900 text-white px-4 py-4">
        <TopView/>
            <input
        type="file"
        accept="video/*"
        onChange={handleFile}
        className="mb-4"
      />
        <VideoPreview file={videoFile}/>
        <CaptionBox/>
        <Audience/>
           <SubmitButton/> 
        
        </div>
  )
}

export default UploadPage