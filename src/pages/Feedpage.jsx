    import React from 'react'
    import VideoFeed from '../components/video/VideoFeed'
import TopBar from '../components/layouts/TopBar'
import BottomNav from '../components/layouts/BottomNav'

    function Feedpage() {
    return (
        <div className='h-screen w-full bg-black overflow-hidden'>
<TopBar/>
    <VideoFeed/>
    <BottomNav/>
        </div>
    )
    }

    export default Feedpage